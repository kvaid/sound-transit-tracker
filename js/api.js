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
        
        // Fetch additional trip data for each vehicle
        await enrichVehicleData(vehicles);
        
        return vehicles;
        
    } catch (error) {
        log(`Error fetching real-time data: ${error.message}`);
        updateStatus(`Error: ${error.message}`, "error");
        return [];
    }
}

async function enrichVehicleData(vehicles) {
    if (!config.ONE_BUS_AWAY_API_KEY) return;
    
    // Create a map to store trip data for both routes
    const tripMap = new Map();
    
    // Fetch data for both routes
    const routes = ['40_2LINE', '40_100479'];
    
    for (const route of routes) {
        try {
            const apiUrl = `https://api.pugetsound.onebusaway.org/api/where/trips-for-route/${route}.json?key=${config.ONE_BUS_AWAY_API_KEY}`;
            log(`Fetching trip data from: ${apiUrl}`);
            updateStatus(`Fetching trip schedule data for route ${route}...`);
            
            const response = await fetch(apiUrl);
            if (!response.ok) {
                log(`Trip API returned status ${response.status} for route ${route}`);
                log(`Error response: ${await response.text()}`);
                continue;
            }
            
            const data = await response.json();
            log(`Received response for route ${route}:`);
            log(`  Status: ${data.status}`);
            log(`  Version: ${data.version}`);
            log(`  Data available: ${!!data.data}`);
            log(`  List length: ${data.data?.list?.length || 0}`);
            
            if (!data.data || !data.data.list) {
                log(`No trip data available in response for route ${route}`);
                continue;
            }
            
            // Add trips to the map
            data.data.list.forEach(trip => {
                log(`Raw trip data for ${trip.tripId}:`);
                log(`  Full trip object: ${JSON.stringify(trip, null, 2)}`);
                
                if (!trip.schedule) {
                    log(`  WARNING: No schedule data for trip ${trip.tripId}`);
                    return;
                }
                
                if (!trip.schedule.stopTimes) {
                    log(`  WARNING: No stop times for trip ${trip.tripId}`);
                    return;
                }

                // Extract status information
                const status = trip.status || {};
                const position = status.position || {};
                const lastKnownLocation = status.lastKnownLocation || {};
                
                // Get destination from last stop
                const stopTimes = trip.schedule.stopTimes;
                const lastStop = stopTimes[stopTimes.length - 1];
                const destination = lastStop ? getStopName(lastStop.stopId) : 'Unknown';
                
                log(`Processing trip ${trip.tripId} for route ${route}:`);
                log(`  Vehicle ID: ${status.vehicleId || 'undefined'}`);
                log(`  Phase: ${status.phase || 'undefined'}`);
                log(`  Destination: ${destination}`);
                log(`  Next Stop: ${status.nextStop || 'undefined'}`);
                log(`  Next Stop Time Offset: ${status.nextStopTimeOffset || 'undefined'}`);
                log(`  Schedule Deviation: ${status.scheduleDeviation || 'undefined'}`);
                log(`  Distance Along Trip: ${status.distanceAlongTrip || 'undefined'}`);
                log(`  Total Distance: ${status.totalDistanceAlongTrip || 'undefined'}`);
                log(`  Orientation: ${status.orientation || 'undefined'}`);
                log(`  Current Position: ${position.lat || lastKnownLocation.lat}, ${position.lon || lastKnownLocation.lon}`);
                log(`  Stop Times: ${stopTimes.length}`);
                
                tripMap.set(trip.tripId, {
                    stopTimes: stopTimes,
                    tripHeadsign: destination,
                    serviceDate: trip.serviceDate || status.serviceDate || Date.now(),
                    directionId: trip.directionId || '0',
                    blockId: trip.blockId || status.blockTripSequence?.toString() || 'unknown',
                    routeId: trip.routeId || route,
                    tripShortName: trip.tripShortName || 'Unknown',
                    tripId: trip.tripId,
                    scheduleDeviation: status.scheduleDeviation || 0,
                    status: status.status || 'unknown',
                    totalDistanceAlongTrip: status.totalDistanceAlongTrip || 0,
                    distanceAlongTrip: status.distanceAlongTrip || 0,
                    nextStop: status.nextStop || 'unknown',
                    nextStopTimeOffset: status.nextStopTimeOffset || 0,
                    orientation: status.orientation || 0,
                    position: {
                        lat: position.lat || lastKnownLocation.lat || 0,
                        lon: position.lon || lastKnownLocation.lon || 0
                    },
                    phase: status.phase || 'unknown',
                    vehicleId: status.vehicleId || 'unknown',
                    destination: destination
                });
            });
            
            log(`Added ${data.data.list.length} trips for route ${route}`);
            
        } catch (error) {
            log(`Error fetching trip data for route ${route}: ${error.message}`);
            log(`Error stack: ${error.stack}`);
            updateStatus(`Error fetching trip data for route ${route}: ${error.message}`, "error");
        }
    }
    
    // Log trip map contents
    log(`Trip map contains ${tripMap.size} total trips`);
    tripMap.forEach((trip, id) => {
        log(`Trip ${id}:`);
        log(`  Route: ${trip.routeId}`);
        log(`  Direction: ${trip.directionId}`);
        log(`  Next Stop: ${trip.nextStop}`);
    });
    
    // Enrich vehicle data with trip information
    vehicles.forEach(vehicle => {
        // Try to find trip with exact ID first
        let tripInfo = tripMap.get(vehicle.trip_id);
        
        // If not found, try with "40_" prefix
        if (!tripInfo && !vehicle.trip_id.startsWith('40_')) {
            tripInfo = tripMap.get('40_' + vehicle.trip_id);
        }
        
        // If still not found, try without "40_" prefix
        if (!tripInfo && vehicle.trip_id.startsWith('40_')) {
            tripInfo = tripMap.get(vehicle.trip_id.substring(3));
        }
        
        if (tripInfo) {
            // Store all trip metadata in the vehicle object
            Object.assign(vehicle, {
                schedule: tripInfo.stopTimes,
                tripHeadsign: tripInfo.tripHeadsign,
                serviceDate: tripInfo.serviceDate,
                directionId: tripInfo.directionId,
                blockId: tripInfo.blockId,
                routeId: tripInfo.routeId,
                tripShortName: tripInfo.tripShortName,
                scheduleDeviation: tripInfo.scheduleDeviation,
                status: tripInfo.status,
                totalDistanceAlongTrip: tripInfo.totalDistanceAlongTrip,
                distanceAlongTrip: tripInfo.distanceAlongTrip,
                nextStop: tripInfo.nextStop,
                nextStopTimeOffset: tripInfo.nextStopTimeOffset,
                orientation: tripInfo.orientation,
                position: tripInfo.position,
                phase: tripInfo.phase,
                vehicleId: tripInfo.vehicleId
            });
            
            // Calculate completion percentage
            if (tripInfo.totalDistanceAlongTrip > 0) {
                vehicle.completionPercentage = (tripInfo.distanceAlongTrip / tripInfo.totalDistanceAlongTrip) * 100;
            }
            
            // Add formatted status information
            vehicle.statusInfo = {
                isDelayed: tripInfo.scheduleDeviation > 0,
                delaySeconds: tripInfo.scheduleDeviation,
                nextStopId: tripInfo.nextStop,
                nextStopTimeOffset: tripInfo.nextStopTimeOffset,
                heading: tripInfo.orientation
            };

            // Log detailed vehicle metadata
            const nextStopName = getStopName(tripInfo.nextStop);
            const nextStopTime = formatTimeOffset(tripInfo.nextStopTimeOffset);
            const direction = getDirectionText(tripInfo.directionId, vehicle.route_id);
            const progress = vehicle.completionPercentage ? `${vehicle.completionPercentage.toFixed(1)}%` : 'unknown';
            const delay = tripInfo.scheduleDeviation > 0 ? ` (Delayed by ${formatTimeOffset(tripInfo.scheduleDeviation)})` : '';
            
            log(`Vehicle ${vehicle.vehicle_id} (${vehicle.route_id}):`);
            log(`  Direction: ${direction}`);
            log(`  Next Stop: ${nextStopName}`);
            log(`  Arrival: ${nextStopTime}${delay}`);
            log(`  Progress: ${progress}`);
            log(`  Heading: ${degreesToCardinal(tripInfo.orientation)}°`);
            
        } else {
            log(`No trip data found for vehicle ${vehicle.vehicle_id} with trip ID ${vehicle.trip_id}`);
            log(`Tried matching with: ${vehicle.trip_id}, 40_${vehicle.trip_id}, ${vehicle.trip_id.startsWith('40_') ? vehicle.trip_id.substring(3) : 'N/A'}`);
            log(`Available trip IDs: ${Array.from(tripMap.keys()).join(', ')}`);
        }
    });
    
    log(`Enriched ${vehicles.length} vehicles with trip data`);
}

function parseVehicleData(pbText) {
    const vehicles = [];
    const entityRegex = /entity\s*{\s*id:\s*"[^"]*"\s*vehicle\s*{\s*trip\s*{\s*trip_id:\s*"([^"]*)"\s*route_id:\s*"([^"]*)"\s*}\s*position\s*{\s*latitude:\s*([\d.-]+)\s*longitude:\s*([\d.-]+)\s*}\s*timestamp:\s*\d+\s*vehicle\s*{\s*id:\s*"([^"]*)"\s*}\s*}\s*}/g;

    let match;
    while ((match = entityRegex.exec(pbText)) !== null) {
        const [_, tripId, routeId, latitude, longitude, vehicleId] = match;
        
        // Log each match for debugging
        log(`Found vehicle: route=${routeId}, trip=${tripId}, lat=${latitude}, lng=${longitude}`);
        
        if (!routeId.includes("2LINE") && !routeId.includes("100479")) {
            log(`Skipping non-Line 1 or 2 vehicle: ${routeId}`);
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
        updateStatus("No Line 1 or 2 trains currently active or detected", "warning");
    } else {
        const line1Count = vehicles.filter(v => v.route_id.includes("100479")).length;
        const line2Count = vehicles.filter(v => v.route_id.includes("2LINE")).length;
        updateStatus(`Found ${line1Count} Line 1 trains and ${line2Count} Line 2 trains`, "success");
    }
} 