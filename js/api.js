// API Functions
async function fetchGTFSRealtimeData() {
    if (!config.ONE_BUS_AWAY_API_KEY) {
        log('No API key available');
        return [];
    }
    
    const apiUrl = `https://api.pugetsound.onebusaway.org/api/gtfs_realtime/vehicle-positions-for-agency/40.pbtext?key=${config.ONE_BUS_AWAY_API_KEY}`;
    
    try {
        updateStatus("Fetching real-time vehicle positions...");
        log(`Requesting data from: ${apiUrl}`);
        
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`API returned status ${response.status}`);
        
        const pbText = await response.text();
        log(`Received response: ${pbText.substring(0, 200)}...`); // Log first 200 chars of response
        
        const vehicles = parseVehicleData(pbText);
        log(`Parsed ${vehicles.length} vehicles from response`);
        return vehicles;
        
    } catch (error) {
        log(`Error fetching real-time data: ${error.message}`);
        updateStatus(`Error: ${error.message}`, "error");
        return [];
    }
}

function parseVehicleData(pbText) {
    const vehicles = [];
    const entityRegex = /entity\s*{\s*id:\s*"[^"]*"\s*vehicle\s*{\s*trip\s*{\s*trip_id:\s*"([^"]*)"\s*route_id:\s*"([^"]*)"\s*}\s*position\s*{\s*latitude:\s*([\d.-]+)\s*longitude:\s*([\d.-]+)\s*}\s*timestamp:\s*\d+\s*vehicle\s*{\s*id:\s*"([^"]*)"\s*}\s*}\s*}/g;

    let match;
    while ((match = entityRegex.exec(pbText)) !== null) {
        const [_, tripId, routeId, latitude, longitude, vehicleId] = match;
        
        // Log each match for debugging
        log(`Found vehicle: route=${routeId}, trip=${tripId}, lat=${latitude}, lng=${longitude}`);
        
        if (!routeId.includes("2LINE") && routeId !== "100479") {
            log(`Skipping non-Line 2 vehicle: ${routeId}`);
            continue;
        }
        
        const vehicle = {
            route_id: routeId,
            trip_id: tripId || "unknown",
            vehicle_id: vehicleId || "unknown",
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude)
        };

        log(`Added vehicle: ID=${vehicle.vehicle_id}, Route=${vehicle.route_id}, Lat=${vehicle.latitude}, Lng=${vehicle.longitude}`);
        vehicles.push(vehicle);
    }
    
    updateVehicleStatus(vehicles);
    return vehicles;
}

function updateVehicleStatus(vehicles) {
    if (vehicles.length === 0) {
        updateStatus("No Line 2 trains currently active or detected", "warning");
    } else {
        updateStatus(`Found ${vehicles.length} Line 2 trains`, "success");
    }
} 