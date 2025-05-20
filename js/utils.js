// Utility Functions
function log(message) {
    const debug = document.getElementById('debug');
    const timestamp = new Date().toLocaleTimeString();
    debug.innerHTML += `<div>[${timestamp}] ${message}</div>`;
    debug.scrollTop = debug.scrollHeight;
    console.log(message);
}

function updateStatus(message, type = 'info') {
    const status = document.getElementById('status');
    status.textContent = message;
    status.className = type;
} 