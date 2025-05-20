import React, { useState } from 'react';

// Simplified version of the JSON data
const tripData = {
  route: {
    name: "2 Line",
    description: "2 Line runs between South Bellevue Station and Downtown Redmond Station seven days a week",
    color: "#007CAD"
  },
  activeTrips: [
    {
      tripId: "40_LLR_2025-05-19_May13_Combined_May_June_2025_ALS_Closure_2LINE_4096",
      directionId: "0",
      tripHeadsign: "Downtown Redmond",
      vehicleId: "40_656.386652",
      position: {
        lat: 47.62990846292273,
        lon: -122.15084950987152
      },
      status: {
        phase: "in_progress",
        predicted: true,
        scheduleDeviation: 1,
        nextStop: "40_E25-T2",
        nextStopTimeOffset: 97,
        distanceAlongTrip: 7543.692875995301,
        totalDistanceAlongTrip: 15052.658561123588,
        orientation: 17.850318301824778
      }
    },
    {
      tripId: "40_LLR_2025-05-19_May13_Combined_May_June_2025_ALS_Closure_2LINE_4097",
      directionId: "0",
      tripHeadsign: "Downtown Redmond",
      vehicleId: "40_657.353901",
      position: {
        lat: 47.61316501529536,
        lon: -122.19353
      },
      status: {
        phase: "in_progress",
        predicted: true,
        scheduleDeviation: -44,
        nextStop: "40_E15-T2",
        nextStopTimeOffset: 57,
        distanceAlongTrip: 3128.624633930449,
        totalDistanceAlongTrip: 15052.658561123588,
        orientation: 90.0
      }
    },
    {
      tripId: "40_LLR_2025-05-19_May13_Combined_May_June_2025_ALS_Closure_2LINE_3094",
      directionId: "1",
      tripHeadsign: "South Bellevue",
      vehicleId: "40_657.932634",
      position: {
        lat: 47.58651779469355,
        lon: -122.19045581412222
      },
      status: {
        phase: "in_progress",
        predicted: true,
        scheduleDeviation: 0,
        nextStop: "40_E09-T2",
        nextStopTimeOffset: 286,
        distanceAlongTrip: 14984.688658619067,
        totalDistanceAlongTrip: 15024.88018021869,
        orientation: 304.56252464874547
      }
    },
    {
      tripId: "40_LLR_2025-05-19_May13_Combined_May_June_2025_ALS_Closure_2LINE_3095",
      directionId: "1",
      tripHeadsign: "South Bellevue",
      vehicleId: "40_655.514575",
      position: {
        lat: 47.61616002875885,
        lon: -122.18428345387836
      },
      status: {
        phase: "in_progress",
        predicted: true,
        scheduleDeviation: -20,
        nextStop: "40_E15-T1",
        nextStopTimeOffset: 69,
        distanceAlongTrip: 10866.59833051666,
        totalDistanceAlongTrip: 15024.88018021869,
        orientation: 229.70785224344314
      }
    },
    {
      tripId: "40_LLR_2025-05-19_May13_Combined_May_June_2025_ALS_Closure_2LINE_3096",
      directionId: "1",
      tripHeadsign: "South Bellevue",
      vehicleId: "40_656.582010",
      position: {
        lat: 47.64441963471609,
        lon: -122.13360392694322
      },
      status: {
        phase: "in_progress",
        predicted: true,
        scheduleDeviation: 82,
        nextStop: "40_E27-T1",
        nextStopTimeOffset: 0,
        distanceAlongTrip: 5225.382162470312,
        totalDistanceAlongTrip: 15024.88018021869,
        orientation: 281.3099324749336
      }
    },
    {
      tripId: "40_LLR_2025-05-19_May13_Combined_May_June_2025_ALS_Closure_2LINE_4094",
      directionId: "0",
      tripHeadsign: "Downtown Redmond",
      vehicleId: "40_660.797429",
      position: {
        lat: 47.67183,
        lon: -122.11901
      },
      status: {
        phase: "in_progress",
        predicted: true,
        scheduleDeviation: 0,
        nextStop: "40_E31-T1",
        nextStopTimeOffset: 180,
        distanceAlongTrip: 15102.383457965974,
        totalDistanceAlongTrip: 15052.658561123588,
        orientation: 166.17134902763806
      }
    },
    {
      tripId: "40_LLR_2025-05-19_May13_Combined_May_June_2025_ALS_Closure_2LINE_4095",
      directionId: "0",
      tripHeadsign: "Downtown Redmond",
      vehicleId: "40_657.569463",
      position: {
        lat: 47.671813152937446,
        lon: -122.11894155880839
      },
      status: {
        phase: "in_progress",
        predicted: true,
        scheduleDeviation: 0,
        nextStop: "40_E31-T2",
        nextStopTimeOffset: 0,
        distanceAlongTrip: 15047.20227191312,
        totalDistanceAlongTrip: 15052.658561123588,
        orientation: 166.17134902763806
      }
    }
  ],
  stops: [
    { id: "40_E09-T2", name: "South Bellevue", lat: 47.586932, lon: -122.190604 },
    { id: "40_E11-T2", name: "East Main", lat: 47.608403, lon: -122.191099 },
    { id: "40_E15-T2", name: "Bellevue Downtown", lat: 47.615183, lon: -122.191303 },
    { id: "40_E19-T2", name: "Wilburton", lat: 47.618229, lon: -122.183687 },
    { id: "40_E21-T2", name: "Spring District", lat: 47.623776, lon: -122.178239 },
    { id: "40_E23-T2", name: "BelRed", lat: 47.6244, lon: -122.165224 },
    { id: "40_E25-T2", name: "Overlake Village", lat: 47.636622, lon: -122.138361 },
    { id: "40_E27-T2", name: "Redmond Technology", lat: 47.645199, lon: -122.133673 },
    { id: "40_E29-T2", name: "Marymoor Village", lat: 47.667381, lon: -122.109118 },
    { id: "40_E31-T2", name: "Downtown Redmond", lat: 47.671788, lon: -122.118952 },
    // Stops in the other direction
    { id: "40_E31-T1", name: "Downtown Redmond", lat: 47.671467, lon: -122.117864 },
    { id: "40_E29-T1", name: "Marymoor Village", lat: 47.667166, lon: -122.110398 },
    { id: "40_E27-T1", name: "Redmond Technology", lat: 47.644424, lon: -122.133556 },
    { id: "40_E25-T1", name: "Overlake Village", lat: 47.636151, lon: -122.139236 },
    { id: "40_E23-T1", name: "BelRed", lat: 47.624499, lon: -122.166364 },
    { id: "40_E21-T1", name: "Spring District", lat: 47.623772, lon: -122.178901 },
    { id: "40_E19-T1", name: "Wilburton", lat: 47.617909, lon: -122.183806 },
    { id: "40_E15-T1", name: "Bellevue Downtown", lat: 47.615285, lon: -122.192531 },
    { id: "40_E11-T1", name: "East Main", lat: 47.607707, lon: -122.191202 },
    { id: "40_E09-T2", name: "South Bellevue", lat: 47.586932, lon: -122.190604 }
  ]
};

// Helper function to find stop name by ID
const getStopName = (stopId) => {
  const stop = tripData.stops.find(s => s.id === stopId);
  return stop ? stop.name : stopId;
};

// Helper function to format time offset
const formatTimeOffset = (seconds) => {
  if (seconds === 0) return "arriving now";
  if (seconds < 0) return `${Math.abs(seconds)} seconds ago`;
  if (seconds < 60) return `in ${seconds} seconds`;
  
  const minutes = Math.floor(seconds / 60);
  return `in ${minutes} minute${minutes > 1 ? 's' : ''}`;
};

// Helper function to get completion percentage
const getCompletionPercentage = (current, total) => {
  return Math.min(100, Math.max(0, Math.round((current / total) * 100)));
};

// Helper function to get direction text
const getDirectionText = (directionId) => {
  return directionId === "0" ? "Eastbound/Northbound" : "Westbound/Southbound";
};

// Helper function to convert compass degrees to cardinal direction
const degreesToCardinal = (degrees) => {
  const directions = ['E', 'ENE', 'NE', 'NNE', 'N', 'NNW', 'NW', 'WNW', 'W', 'WSW', 'SW', 'SSW', 'S', 'SSE', 'SE', 'ESE'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};

const SoundTransit2Line = () => {
  const [filterDirection, setFilterDirection] = useState("all");
  
  // Filter trips based on selected direction
  const filteredTrips = tripData.activeTrips.filter(trip => {
    if (filterDirection === "all") return true;
    return trip.directionId === filterDirection;
  });

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="p-4 bg-blue-600 text-white">
            <h1 className="text-2xl font-bold">Sound Transit 2 Line</h1>
            <p className="text-sm">{tripData.route.description}</p>
          </div>
          
          <div className="p-4 border-b">
            <div className="flex items-center space-x-4">
              <span className="font-semibold">Filter by direction:</span>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setFilterDirection("all")}
                  className={`px-3 py-1 rounded ${filterDirection === "all" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                >
                  All
                </button>
                <button 
                  onClick={() => setFilterDirection("0")}
                  className={`px-3 py-1 rounded ${filterDirection === "0" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                >
                  To Downtown Redmond
                </button>
                <button 
                  onClick={() => setFilterDirection("1")}
                  className={`px-3 py-1 rounded ${filterDirection === "1" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                >
                  To South Bellevue
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-4">
            <div className="grid grid-cols-1 gap-4">
              {filteredTrips.map((trip) => (
                <div key={trip.tripId} className="border rounded-lg overflow-hidden">
                  <div className={`p-3 ${trip.directionId === "0" ? "bg-blue-100" : "bg-green-100"} flex justify-between items-center`}>
                    <div>
                      <span className="font-bold">{trip.tripHeadsign}</span>
                      <span className="ml-2 text-sm text-gray-600">({getDirectionText(trip.directionId)})</span>
                    </div>
                    <div className="text-sm bg-gray-800 text-white px-2 py-1 rounded">
                      Vehicle: {trip.vehicleId.split('_')[1]}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Current position: {getCompletionPercentage(trip.status.distanceAlongTrip, trip.status.totalDistanceAlongTrip)}% of route</span>
                        <span>Heading: {degreesToCardinal(trip.status.orientation)} ({Math.round(trip.status.orientation)}°)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${trip.directionId === "0" ? "bg-blue-600" : "bg-green-600"}`}
                          style={{ width: `${getCompletionPercentage(trip.status.distanceAlongTrip, trip.status.totalDistanceAlongTrip)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Next Stop:</span>
                        <span>{getStopName(trip.status.nextStop)} {formatTimeOffset(trip.status.nextStopTimeOffset)}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="font-medium">Schedule Status:</span>
                        <span className={`${trip.status.scheduleDeviation > 0 ? "text-yellow-600" : trip.status.scheduleDeviation < 0 ? "text-green-600" : "text-gray-600"}`}>
                          {trip.status.scheduleDeviation > 0 
                            ? `${trip.status.scheduleDeviation} ${trip.status.scheduleDeviation === 1 ? 'second' : 'seconds'} late` 
                            : trip.status.scheduleDeviation < 0 
                              ? `${Math.abs(trip.status.scheduleDeviation)} ${Math.abs(trip.status.scheduleDeviation) === 1 ? 'second' : 'seconds'} early`
                              : 'On time'}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="font-medium">Current Coordinates:</span>
                        <span className="text-sm">{trip.position.lat.toFixed(5)}, {trip.position.lon.toFixed(5)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold mb-3">Direction ID Information</h2>
          <div className="space-y-2">
            <p><span className="font-medium">Direction ID = 0:</span> Eastbound/Northbound (South Bellevue to Downtown Redmond)</p>
            <p><span className="font-medium">Direction ID = 1:</span> Westbound/Southbound (Downtown Redmond to South Bellevue)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoundTransit2Line;
