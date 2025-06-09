// Utility Functions
function log(message) {
    // Commented out for production
    // console.log(message);
}

function updateStatus(message, type = 'info') {
    const status = document.getElementById('status');
    status.textContent = message;
    status.className = type;
}

// Helper function to find stop name by ID
function getStopName(stopId) {
    const stop = stopsData.stops.find(s => s.id === stopId);
    return stop ? stop.name : stopId;
}

// Helper function to format time offset
function formatTimeOffset(seconds) {
    if (seconds === 0) return "arriving now";
    if (seconds < 0) return `${Math.abs(seconds)} seconds ago`;
    if (seconds < 60) return `in ${seconds} seconds`;
    
    const minutes = Math.floor(seconds / 60);
    return `in ${minutes} minute${minutes > 1 ? 's' : ''}`;
}

// Helper function to get completion percentage
function getCompletionPercentage(current, total) {
    return Math.min(100, Math.max(0, Math.round((current / total) * 100)));
}

// Helper function to get direction text
function getDirectionText(directionId, routeId) {
    if (routeId && routeId.includes("100479")) {
        return directionId === "0" ? "Northbound" : "Southbound";
    } else {
        return directionId === "0" ? "Eastbound" : "Westbound";
    }
}

// Helper function to convert degrees to cardinal direction
function degreesToCardinal(degrees) {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
} 