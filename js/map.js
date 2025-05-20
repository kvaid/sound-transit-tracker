// Map Functions
function initMap() {
    log('Initializing map...');
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: config.MAP_ZOOM,
        center: config.MAP_CENTER,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
    });

    const transitLayer = new google.maps.TransitLayer();
    transitLayer.setMap(map);

    log('Starting real-time updates...');
    updateRealTimeLocations(map);
    setInterval(() => updateRealTimeLocations(map), config.UPDATE_INTERVAL);
    
    log("Map initialized successfully");
}

async function updateRealTimeLocations(map) {
    log('Updating real-time locations...');
    
    // Clear existing markers
    log(`Clearing ${vehicleMarkers.length} existing markers`);
    vehicleMarkers.forEach(marker => marker.setMap(null));
    vehicleMarkers.length = 0;
    
    // Fetch new locations
    const vehicles = await fetchGTFSRealtimeData();
    log(`Received ${vehicles.length} vehicles from API`);
    
    // Create new markers
    vehicles.forEach(vehicle => {
        try {
            const marker = createVehicleMarker(vehicle, map);
            vehicleMarkers.push(marker);
            // log(`Created marker for vehicle ${vehicle.vehicle_id}`);
        } catch (error) {
            log(`Error creating marker for vehicle ${vehicle.vehicle_id}: ${error.message}`);
        }
    });
    
    log(`Updated map with ${vehicleMarkers.length} markers`);
}

function createVehicleMarker(vehicle, map) {
    // log(`Creating marker for vehicle ${vehicle.vehicle_id} at ${vehicle.latitude},${vehicle.longitude}`);
    
    const marker = new google.maps.Marker({
        position: { lat: vehicle.latitude, lng: vehicle.longitude },
        map: map,
        icon: {
            url: "assets/train_icon_red.png",
            scaledSize: new google.maps.Size(32, 32)
        },
        title: `Train ${vehicle.vehicle_id}`
    });
    
    // Format the schedule times if available
    let scheduleHtml = '';
    if (vehicle.schedule && Array.isArray(vehicle.schedule) && vehicle.schedule.length > 0) {
        log(`Creating schedule HTML for ${vehicle.schedule.length} stops`);
        scheduleHtml = `
            <div class="schedule-section">
                <h4>Schedule</h4>
                <div class="schedule-container">
                    <table class="schedule-table">
                        <thead>
                            <tr>
                                <th>Stop</th>
                                <th>Arrival</th>
                                <th>Departure</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${vehicle.schedule.map(stop => {
                                const arrivalTime = formatTime(stop.arrivalTime);
                                const departureTime = formatTime(stop.departureTime);
                                const stopName = getStopName(stop.stopId);
                                log(`Stop ${stopName}: Arrival ${arrivalTime}, Departure ${departureTime}`);
                                return `
                                    <tr>
                                        <td>${stopName}</td>
                                        <td>${arrivalTime}</td>
                                        <td>${departureTime}</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    } else {
        log(`No schedule data available for vehicle ${vehicle.vehicle_id}`);
    }

    // Get formatted metadata using helper functions
    const directionText = getDirectionText(vehicle.directionId);
    const nextStopName = getStopName(vehicle.nextStop);
    const nextStopTime = formatTimeOffset(vehicle.nextStopTimeOffset);
    const completionPercentage = getCompletionPercentage(vehicle.distanceAlongTrip, vehicle.totalDistanceAlongTrip);
    const heading = degreesToCardinal(vehicle.orientation);

    const infoContent = `
        <div class="vehicle-info">
            <h3>Line 2 Train Information</h3>
            <div class="info-section">
                <h4>Basic Information</h4>
                <table class="info-table">
                    <tr>
                        <td><strong>Vehicle ID:</strong></td>
                        <td>${vehicle.vehicle_id}</td>
                    </tr>
                    <tr>
                        <td><strong>Trip ID:</strong></td>
                        <td>${vehicle.trip_id}</td>
                    </tr>
                    <tr>
                        <td><strong>Route:</strong></td>
                        <td>${vehicle.route_id}</td>
                    </tr>
                    <tr>
                        <td><strong>Direction:</strong></td>
                        <td>${directionText}</td>
                    </tr>
                    ${vehicle.tripHeadsign ? `
                    <tr>
                        <td><strong>Destination:</strong></td>
                        <td>${vehicle.tripHeadsign}</td>
                    </tr>
                    ` : ''}
                    ${vehicle.serviceDate ? `
                    <tr>
                        <td><strong>Service Date:</strong></td>
                        <td>${new Date(vehicle.serviceDate).toLocaleDateString()}</td>
                    </tr>
                    ` : ''}
                </table>
            </div>

            <div class="info-section">
                <h4>Current Status</h4>
                <table class="info-table">
                    <tr>
                        <td><strong>Next Stop:</strong></td>
                        <td>${nextStopName} (${nextStopTime})</td>
                    </tr>
                    <tr>
                        <td><strong>Progress:</strong></td>
                        <td>${completionPercentage}% of route completed</td>
                    </tr>
                    <tr>
                        <td><strong>Heading:</strong></td>
                        <td>${heading} (${Math.round(vehicle.orientation)}°)</td>
                    </tr>
                    <tr>
                        <td><strong>Schedule Status:</strong></td>
                        <td class="${vehicle.scheduleDeviation > 0 ? 'text-yellow-600' : vehicle.scheduleDeviation < 0 ? 'text-green-600' : 'text-gray-600'}">
                            ${vehicle.scheduleDeviation > 0 
                                ? `${vehicle.scheduleDeviation} seconds late` 
                                : vehicle.scheduleDeviation < 0 
                                    ? `${Math.abs(vehicle.scheduleDeviation)} seconds early`
                                    : 'On time'}
                        </td>
                    </tr>
                </table>
            </div>

            ${scheduleHtml}
        </div>
    `;
    
    const infoWindow = new google.maps.InfoWindow({ 
        content: infoContent,
        maxWidth: 400,
        pixelOffset: new google.maps.Size(0, -10),
        disableAutoPan: false
    });
    
    // Create a single InfoWindow instance for the map
    if (!window.infoWindow) {
        window.infoWindow = infoWindow;
    }
    
    marker.addListener("click", () => {
        // Close any existing InfoWindow
        if (window.infoWindow) {
            window.infoWindow.close();
        }
        // Open the InfoWindow for this marker
        window.infoWindow.setContent(infoContent);
        window.infoWindow.open(map, marker);
        
        // Add event listener for when InfoWindow is fully loaded
        google.maps.event.addListenerOnce(window.infoWindow, 'domready', () => {
            // Force InfoWindow to recalculate its size
            window.infoWindow.setContent(window.infoWindow.getContent());
        });
    });
    
    return marker;
}

// Helper function to format time from seconds since midnight
function formatTime(seconds) {
    if (!seconds) return 'N/A';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
} 