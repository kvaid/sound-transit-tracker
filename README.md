# Sound Transit Line 2 Real-Time Map

A web application that displays real-time locations of Sound Transit Line 2 trains on a Google Maps interface.

## Features
- Real-time train tracking
- Interactive map interface
- Train information display
- Automatic updates every 30 seconds
- Debug console for monitoring

## Project Structure
```
lightrail-map/
├── index.html              # Main HTML file
├── css/
│   └── styles.css         # Styling
├── js/
│   ├── config.js          # Configuration (API keys, etc.)
│   ├── utils.js           # Utility functions
│   ├── api.js             # API interaction
│   ├── map.js             # Map functionality
│   └── app.js             # Main application logic
└── assets/
    └── train_icon_red.png # Train marker icon
```

## Setup
1. Clone this repository
2. Copy `js/config.example.js` to `js/config.js`
3. Add your API keys to `js/config.js`:
   - Google Maps API key
   - OneBusAway API key
4. Open `lightrail-map.html` in a web browser

## Dependencies
- Google Maps JavaScript API
- OneBusAway GTFS-realtime API

## Development
- Debug information is displayed in the debug console at the bottom of the page
- API responses and errors are logged for troubleshooting
- Map updates every 30 seconds automatically

## License
MIT License
