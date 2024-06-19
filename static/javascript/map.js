let map;
let diveLogs = [];
let markers = [];
let markersArray = [];
const userId = document.getElementById('userId').value || null;

// Get CSRF token
const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        document.cookie.split(';').forEach(cookie => {
            cookie = cookie.trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
            }
        });
    }
    return cookieValue;
}

// Debounce function
const debounce = (func, wait) => {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

// Get data from cache
const getDataFromCache = (key) => JSON.parse(localStorage.getItem(key)) || [];

// Save data to cache
const saveDataToCache = (key, data) => localStorage.setItem(key, JSON.stringify(data));

// Initialize the map
function initMap() {
    const mapDiv = document.getElementById('map');
    if (mapDiv) {
        map = new google.maps.Map(mapDiv, {
            center: { lat: 30.049, lng: 2.2277 },
            zoom: 2,
            mapTypeId: google.maps.MapTypeId.HYBRID,
            streetViewControl: false
        });
        console.log("Map initialized:", map);

        map.addListener('dblclick', debounce((event) => {
            event.stop();
            addMarker(event.latLng);
            updateDiveFormLocation(event.latLng);
            rotateForm();
        }, 300));
        window.addEventListener('resize', () => {
            const center = map.getCenter();
            google.maps.event.trigger(map, 'resize');
            map.setCenter(center);
        });

        initAutocomplete();
        initializeData();
    } else {
        console.error('Map div not found!');
    }
}

// Initialize autocomplete
const initAutocomplete = () => {
    const input = document.getElementById('map-search');
    const autocomplete = new google.maps.places.Autocomplete(input);

    autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
            console.error(`No details available for the input '${place.name}'`);
            return;
        }
        map.setCenter(place.geometry.location);
        map.setZoom(10);
        addMarker(place.geometry.location);
        updateDiveFormLocation(place.geometry.location);
        rotateForm();
    });
}

// Add marker on the map
const addMarker = (location) => {

    if (!map) {
        console.error("Map instance is not initialized");
        return;
    }

    const marker = new google.maps.Marker({
        position: location,
        map: map, // Set the map property here
    });
    marker.addListener('click', () => updateDiveFormLocation(location));
    marker.addListener('rightclick', () => {
        marker.setMap(null);
        clearDiveFormLocation();
    });
    markersArray.push(marker);
    saveMarker(location);

    if (typeof MarkerClusterer !== 'undefined') {
        updateMarkerCluster();
    } else {
        console.error('MarkerClusterer is not defined. Make sure the MarkerClusterer library is loaded.');
    }
}

// Save marker with debounce
const saveMarker = (location) => {
    const marker = { lat: location.lat(), lng: location.lng(), user: userId };
    if (!markers.some(m => m.lat === marker.lat && m.lng === marker.lng && m.user === marker.user)) {
        markers.push(marker);
        saveDataToCache('markers', markers);
        debouncedSaveMarkerToServer(location);
    }
}

const debouncedSaveMarkerRequest = debounce(saveMarker, 500);

const clearDiveFormLocation = () => {
    const diveLocation = document.getElementById('diveLocation');
    if (diveLocation) diveLocation.value = '';
}

const updateDiveFormLocation = (location) => {
    const latLngStr = `${location.lat()}, ${location.lng()}`;
    const diveLocation = document.getElementById('diveLocation');
    if (diveLocation) diveLocation.value = latLngStr;
}

const rotateForm = () => {
    const initialImage = document.getElementById('initialImage');
    const addDiveForm = document.getElementById('addDiveForm');
    if (initialImage && addDiveForm) {
        initialImage.style.display = 'none';
        addDiveForm.style.display = 'block';
    }
}

const hideDiveForm = () => {
    const addDiveForm = document.getElementById('addDiveForm');
    if (addDiveForm) addDiveForm.style.display = 'none';
    showRandomImage();
}

const showConfirmationMessage = () => {
    const messageContainer = document.getElementById('confirmationMessage');
    if (messageContainer) {
        messageContainer.style.display = 'block';
        setTimeout(() => {
            messageContainer.style.display = 'none';
            showRandomImage();
        }, 5000);
    }
}

const showRandomImage = () => {
    const randomImage = document.getElementById('randomImage');
    const images = [
        '/static/images/coral2.jpg',
        '/static/images/dolphins.jpg',
        '/static/images/hero.jpg',
        '/static/images/openwater.jpg',
        '/static/images/underwater1.jpg',
    ];

    if (randomImage) {
        const randomIndex = Math.floor(Math.random() * images.length);
        randomImage.src = images[randomIndex];
        randomImage.style.display = 'block';
    }
}

// Render existing dive logs
const renderDiveLogs = () => {
    if (Array.isArray(diveLogs) && diveLogs.length) {
        diveLogs.forEach(log => {
            const [lat, lng] = log.location.split(',').map(Number);
            addMarker(new google.maps.LatLng(lat, lng));
        });
    } else {
        console.warn('No dive logs found or diveLogs is not an array');
    }
}

const initializeData = () => {
    markers = window.markersData || [];
    diveLogs = window.diveLogsData || [];

    renderDiveLogs();
    renderMarkers();
}

const renderMarkers = () => {
    markersArray.forEach(marker => marker.setMap(null));
    markersArray = [];

    if (Array.isArray(markers) && markers.length && map) { // Check if map is available
        markers.forEach(markerData => {
            const marker = new google.maps.Marker({
                position: { lat: markerData.lat, lng: markerData.lng },
                map: map, // Set the map property here
            });
            // ... (rest of the code)
        });
        updateMarkerCluster();
    } else {
        console.warn('No markers found or markers is not an array or map is not initialized');
    }
}

const updateMarkerCluster = () => {
    if (typeof MarkerClusterer !== 'undefined') {
        if (map && map.markerClusterer) map.markerClusterer.clearMarkers(); // Check if map is available

        map.markerClusterer = new MarkerClusterer({
            markers: markersArray,
            map: map,
            algorithm: {
                maxZoom: 15,
                gridSize: 60
            },
            renderer: {
                render: ({ count }) => {
                    return {
                        element: createClusterElement(count),
                        anchor: { x: 15, y: 15 }
                    };
                }
            }
        });
    } else {
        console.error('MarkerClusterer is not defined. Make sure the MarkerClusterer library is loaded.');
    }
}

const createClusterElement = (count) => {
    const div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.width = '30px';
    div.style.height = '30px';
    div.style.background = 'rgba(0, 128, 0, 0.6)';
    div.style.borderRadius = '50%';
    div.style.display = 'flex';
    div.style.alignItems = 'center';
    div.style.justifyContent = 'center';
    div.style.color = 'white';
    div.style.fontSize = '14px';
    div.style.fontWeight = 'bold';
    div.textContent = count;
    return div;
}

const saveDiveLog = (diveLog) => {
    diveLogs.push(diveLog);
    saveDataToCache('dive_logs', diveLogs);
    debouncedSaveDiveLog();
}

const debouncedSaveMarkerToServer = debounce((location) => {
    fetch('/dives/add_marker/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({ lat: location.lat(), lng: location.lng() })
    })
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok: ' + response.statusText);
        return response.json();
    })
    .then(data => {
        if (data.status !== 'success') throw new Error('Server error: ' + data.message);
        markers = [];
        saveDataToCache('markers', markers);
    })
    .catch(error => console.error('Error:', error.message));
}, 500);

const debouncedSaveDiveLog = debounce(() => {
    fetch('/dives/add_dive_log/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify(diveLogs)
    })
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok: ' + response.statusText);
        return response.json();
    })
    .then(data => {
        if (data.status !== 'success') throw new Error('Server error: ' + data.message);
        diveLogs = [];
        saveDataToCache('dive_logs', diveLogs);
    })
    .catch(error => console.error('Error:', error.message));
}, 500);

function loadGoogleMapsApi() {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAPI3E9RTADYzaO0QRLzTbno11uKf-RxVQ&libraries=places';
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = (e) => reject(new Error(`Failed to load Google Maps API: ${e.message}`));
        document.head.appendChild(script);
    });
}

function loadMarkerClusterer() {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/@googlemaps/markerclustererplus/dist/index.min.js';
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = (e) => reject(new Error(`Failed to load MarkerClusterer library: ${e.message}`));
        document.head.appendChild(script);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadGoogleMapsApi()
        .then(() => loadMarkerClusterer())
        .then(() => {
            console.log('Google Maps and MarkerClusterer scripts loaded');
            initMap(); // Call initMap here
        })
        .catch((error) => {
            console.error('Error loading Google Maps or MarkerClusterer scripts:', error);
        });
});