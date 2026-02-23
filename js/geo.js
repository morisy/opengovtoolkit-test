/**
 * Client-side geolocation + bounding-box state lookup.
 * No external API calls — coordinates stay in the browser.
 *
 * Bounding boxes are [south, west, north, east] in decimal degrees.
 * These are approximate and meant to be suggestive, not authoritative.
 */
const Geo = (() => {
  // State bounding boxes: [minLat, minLng, maxLat, maxLng]
  const boxes = {
    "Alabama": [30.22, -88.47, 35.01, -84.89],
    "Alaska": [51.21, -179.15, 71.39, -129.98],
    "Arizona": [31.33, -114.81, 37.00, -109.04],
    "Arkansas": [33.00, -94.62, 36.50, -89.64],
    "California": [32.53, -124.41, 42.01, -114.13],
    "Colorado": [36.99, -109.06, 41.00, -102.04],
    "Connecticut": [40.95, -73.73, 42.05, -71.79],
    "Delaware": [38.45, -75.79, 39.84, -75.05],
    "District of Columbia": [38.79, -77.12, 38.99, -76.91],
    "Florida": [24.40, -87.63, 31.00, -80.03],
    "Georgia": [30.36, -85.61, 35.00, -80.84],
    "Hawaii": [18.91, -160.24, 22.24, -154.81],
    "Idaho": [41.99, -117.24, 49.00, -111.04],
    "Illinois": [36.97, -91.51, 42.51, -87.02],
    "Indiana": [37.77, -88.10, 41.76, -84.78],
    "Iowa": [40.38, -96.64, 43.50, -90.14],
    "Kansas": [36.99, -102.05, 40.00, -94.59],
    "Kentucky": [36.50, -89.57, 39.15, -81.96],
    "Louisiana": [28.93, -94.04, 33.02, -89.00],
    "Maine": [43.06, -71.08, 47.46, -66.95],
    "Maryland": [37.91, -79.49, 39.72, -75.05],
    "Massachusetts": [41.24, -73.51, 42.89, -69.93],
    "Michigan": [41.70, -90.42, 48.26, -82.41],
    "Minnesota": [43.50, -97.24, 49.38, -89.49],
    "Mississippi": [30.17, -91.66, 34.99, -88.10],
    "Missouri": [35.99, -95.77, 40.61, -89.10],
    "Montana": [44.36, -116.05, 49.00, -104.04],
    "Nebraska": [40.00, -104.05, 43.00, -95.31],
    "Nevada": [35.00, -120.00, 42.00, -114.04],
    "New Hampshire": [42.70, -72.56, 45.31, -70.70],
    "New Jersey": [38.93, -75.56, 41.36, -73.89],
    "New Mexico": [31.33, -109.05, 37.00, -103.00],
    "New York": [40.50, -79.76, 45.01, -71.86],
    "North Carolina": [33.84, -84.32, 36.59, -75.46],
    "North Dakota": [45.94, -104.05, 49.00, -96.55],
    "Ohio": [38.40, -84.82, 41.98, -80.52],
    "Oklahoma": [33.62, -103.00, 37.00, -94.43],
    "Oregon": [41.99, -124.57, 46.29, -116.46],
    "Pennsylvania": [39.72, -80.52, 42.27, -74.69],
    "Rhode Island": [41.15, -71.86, 42.02, -71.12],
    "South Carolina": [32.03, -83.35, 35.22, -78.54],
    "South Dakota": [42.48, -104.06, 45.94, -96.44],
    "Tennessee": [34.98, -90.31, 36.68, -81.65],
    "Texas": [25.84, -106.65, 36.50, -93.51],
    "Utah": [36.99, -114.05, 42.00, -109.04],
    "Vermont": [42.73, -73.44, 45.02, -71.46],
    "Virginia": [36.54, -83.68, 39.47, -75.24],
    "Washington": [45.54, -124.85, 49.00, -116.92],
    "West Virginia": [37.20, -82.64, 40.64, -77.72],
    "Wisconsin": [42.49, -92.89, 47.08, -86.25],
    "Wyoming": [40.99, -111.06, 45.01, -104.05]
  };

  function findState(lat, lng) {
    // Check each bounding box; return first match
    // For overlapping boxes, prefer smaller area (more specific)
    let best = null;
    let bestArea = Infinity;

    for (const [state, box] of Object.entries(boxes)) {
      const [minLat, minLng, maxLat, maxLng] = box;
      if (lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng) {
        const area = (maxLat - minLat) * (maxLng - minLng);
        if (area < bestArea) {
          best = state;
          bestArea = area;
        }
      }
    }
    return best;
  }

  function detect(callback) {
    if (!navigator.geolocation) {
      callback(new Error('Geolocation not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const state = findState(latitude, longitude);
        if (state) {
          callback(null, { state, lat: latitude, lng: longitude });
        } else {
          callback(new Error('Could not determine state from coordinates'));
        }
      },
      (err) => {
        callback(err);
      },
      { timeout: 10000, maximumAge: 300000 }
    );
  }

  return { detect, findState };
})();
