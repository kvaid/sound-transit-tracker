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
    
    try {
        // Fetch new locations
        const vehicles = await fetchGTFSRealtimeData();
        log(`Received ${vehicles.length} vehicles from API`);
        
        // Update markers with new vehicle data
        updateVehicleMarkers(vehicles, map);
        
        log(`Updated map with ${vehicleMarkers.size} markers`);
    } catch (error) {
        log('Error updating real-time locations:', error);
    }
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

// Store vehicle markers in a Map for easy access and updates
const vehicleMarkers = new Map();

// Function to get the appropriate icon for a vehicle
function getVehicleIcon(vehicle) {
    // Get direction text to determine which icon to use
    const directionText = getDirectionText(vehicle.directionId, vehicle.route_id);
    const isWestOrNorth = directionText === 'Westbound' || directionText === 'Northbound';
    
    const iconUrl = isWestOrNorth ? "assets/train_icon_blue.png" : "assets/train_icon_red.png";
    
    return {
        url: iconUrl,
        scaledSize: new google.maps.Size(32, 32)
    };
}

// Function to get the title (tooltip) for a vehicle
function getVehicleTitle(vehicle) {
    const directionText = getDirectionText(vehicle.route_id);
    const lineNumber = vehicle.route_id && vehicle.route_id.includes('100479') ? '1' : '2';
    return `Line ${lineNumber} Train - ${directionText}`;
}

// Function to update vehicle markers on the map
function updateVehicleMarkers(vehicles, map) {
    // Create a Set of current vehicle IDs
    const currentVehicleIds = new Set(vehicles.map(v => v.vehicle_id));
    
    // Remove markers for vehicles that are no longer present
    for (const [vehicleId, marker] of vehicleMarkers.entries()) {
        if (!currentVehicleIds.has(vehicleId)) {
            marker.setMap(null);
            vehicleMarkers.delete(vehicleId);
        }
    }

    // Update or create markers for current vehicles
    vehicles.forEach(vehicle => {
        try {
            if (!vehicle.latitude || !vehicle.longitude) {
                return;
            }

            const position = {
                lat: parseFloat(vehicle.latitude),
                lng: parseFloat(vehicle.longitude)
            };

            if (vehicleMarkers.has(vehicle.vehicle_id)) {
                // Update existing marker
                const marker = vehicleMarkers.get(vehicle.vehicle_id);
                marker.setPosition(position);
                
                // Update the marker's icon based on the vehicle's status
                const icon = getVehicleIcon(vehicle);
                marker.setIcon(icon);
                
                // Update the marker's title (tooltip)
                marker.setTitle(getVehicleTitle(vehicle));
            } else {
                // Create new marker
                const marker = new google.maps.Marker({
                    position: position,
                    map: map,
                    icon: getVehicleIcon(vehicle),
                    title: getVehicleTitle(vehicle),
                    zIndex: 1000
                });
                
                // Add click listener for the marker
                marker.addListener('click', () => {
                    showVehicleInfo(vehicle, marker);
                });
                
                vehicleMarkers.set(vehicle.vehicle_id, marker);
            }
        } catch (error) {
            log(`Error processing vehicle ${vehicle.vehicle_id}:`, error);
        }
    });
}

// Function to show vehicle information in an InfoWindow
function showVehicleInfo(vehicle, marker) {
    // Format the schedule times if available
    let scheduleHtml = '';
    if (vehicle.schedule && Array.isArray(vehicle.schedule) && vehicle.schedule.length > 0) {
        // Get current time in seconds since midnight
        const now = new Date();
        const currentSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
        
        // Filter schedule to only show future stops
        const futureStops = vehicle.schedule.filter(stop => {
            const stopTime = stop.arrivalTime || stop.departureTime;
            return stopTime > currentSeconds;
        });

        if (futureStops.length > 0) {
            scheduleHtml = `
                <div class="schedule-section">
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
                                ${futureStops.map(stop => {
                                    const arrivalTime = formatTime(stop.arrivalTime);
                                    const departureTime = formatTime(stop.departureTime);
                                    const stopName = getStopName(stop.stopId);
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
        }
    }

    // Get formatted metadata using helper functions
    const directionText = getDirectionText(vehicle.directionId, vehicle.route_id);
    const nextStopName = getStopName(vehicle.nextStop);
    const nextStopTime = formatTimeOffset(vehicle.nextStopTimeOffset);
    const completionPercentage = getCompletionPercentage(vehicle.distanceAlongTrip, vehicle.totalDistanceAlongTrip);
    const heading = degreesToCardinal(vehicle.orientation);

    // Format route display
    const routeDisplay = vehicle.route_id.includes('100479') ? 'Line 1' : vehicle.route_id;

    // Convert schedule deviation to minutes
    const deviationMinutes = Math.abs(Math.round(vehicle.scheduleDeviation / 60));
    const scheduleStatus = vehicle.scheduleDeviation > 0 
        ? `[${deviationMinutes} min late]` 
        : vehicle.scheduleDeviation < 0 
            ? `[${deviationMinutes} min early]`
            : '[On time]';

    const infoContent = `
        <div class="vehicle-info">
            <h3>Line ${vehicle.route_id.includes('100479') ? '1' : '2'} Train Information</h3>
            <div class="info-section">
                <table class="info-table">
                    <tr>
                        <td><strong>Vehicle ID:</strong></td>
                        <td>${vehicle.vehicle_id} ${scheduleStatus}</td>
                    </tr>
                    <tr>
                        <td><strong>Route:</strong></td>
                        <td>${routeDisplay} ${directionText} [${Math.round(vehicle.orientation)}° ${heading}]</td>
                    </tr>
                    ${vehicle.tripHeadsign ? `
                    <tr>
                        <td><strong>Destination:</strong></td>
                        <td>${vehicle.tripHeadsign} [${completionPercentage}% completed]</td>
                    </tr>
                    ` : ''}
                    <tr>
                        <td><strong>Next Stop:</strong></td>
                        <td>${nextStopName} (${nextStopTime})</td>
                    </tr>
                </table>
            </div>

            ${scheduleHtml}
        </div>
    `;
    
    // Create a single InfoWindow instance for the map if it doesn't exist
    if (!window.infoWindow) {
        window.infoWindow = new google.maps.InfoWindow({ 
            maxWidth: 400,
            pixelOffset: new google.maps.Size(0, -10),
            disableAutoPan: false
        });
    }
    
    // Close any existing InfoWindow
    window.infoWindow.close();
    
    // Open the InfoWindow for this marker
    window.infoWindow.setContent(infoContent);
    window.infoWindow.open(map, marker);
    
    // Add event listener for when InfoWindow is fully loaded
    google.maps.event.addListenerOnce(window.infoWindow, 'domready', () => {
        // Force InfoWindow to recalculate its size
        window.infoWindow.setContent(window.infoWindow.getContent());
    });
} 