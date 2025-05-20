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
    log(`Creating marker for vehicle ${vehicle.vehicle_id} at ${vehicle.latitude},${vehicle.longitude}`);
    
    const marker = new google.maps.Marker({
        position: { lat: vehicle.latitude, lng: vehicle.longitude },
        map: map,
        icon: {
            url: "assets/train_icon_red.png",
            scaledSize: new google.maps.Size(32, 32)
        },
        title: `Train ${vehicle.vehicle_id}`
    });
    
    const infoContent = `
        <div style="padding: 10px;">
            <strong>Line 2 Train</strong><br>
            ID: ${vehicle.vehicle_id}<br>
            Trip: ${vehicle.trip_id}<br>
            Route: ${vehicle.route_id}
        </div>
    `;
    
    const infoWindow = new google.maps.InfoWindow({ content: infoContent });
    marker.addListener("click", () => infoWindow.open(map, marker));
    
    return marker;
} 