// Interactive Map Javascript

// Global variable for the map
let map;
let diveLogs = [];
let markers = [];
let markersArray = [];
let userId = document.getElementById('userId').value || null; // Read user ID from the hidden input field

// Function to get the CSRF token
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Function to debounce multiple rapid calls to a function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Function to get data from the cache or fetch from the server
function getDataFromCache(key) {
    const cachedData = localStorage.getItem(key);
    if (cachedData) {
        return JSON.parse(cachedData);
    }
    return [];
}

// Function to save data to the cache
function saveDataToCache(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Initialize the map and add a click listener
function initMap() {
    const mapDiv = document.getElementById('map');
    if (mapDiv) {
        map = new google.maps.Map(mapDiv, {
            center: { lat: 30.049, lng: 2.2277 },
            zoom: 2,
            mapTypeId: google.maps.MapTypeId.HYBRID,
            streetViewControl: false
        });
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

        // Initialize the search box
        initAutocomplete();
        initializeData();
    } else {
        console.error('Map div not found!');
    }
}

const initAutocomplete = () => {
    const input = document.getElementById('map-search');
    const autocomplete = new google.maps.places.Autocomplete(input);

    autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
            return console.error("No details available for the input '" + place.name + "'");
        }

        map.setCenter(place.geometry.location);
        map.setZoom(10);

        addMarker(place.geometry.location);
        updateDiveFormLocation(place.geometry.location);
        rotateForm();
    });
};

// Function to add a marker on the map
function addMarker(location) {
    const marker = new google.maps.Marker({
        position: location,
        map: map,
    });
    marker.addListener('click', () => {
        updateDiveFormLocation(location);
    });
    marker.addListener('rightclick', () => {
        marker.setMap(null);
        clearDiveFormLocation();
    });
    markersArray.push(marker);
    console.log('Marker added:', marker);
    console.log('Markers Array:', markersArray);
    updateMarkerCluster();
    saveMarker(location);
}


// Debounced function for saving markers
const debouncedSaveMarkerRequest = debounce(saveMarker, 500);

function saveMarker(location) {
    console.log('Saving marker at:', location.lat(), location.lng());

    // Check if the marker already exists in the cache
    const marker = { lat: location.lat(), lng: location.lng(), user: userId };
    if (!markers.some(m => m.lat === marker.lat && m.lng === marker.lng && m.user === marker.user)) {
        markers.push(marker);
        saveDataToCache('markers', markers);

        debouncedSaveMarkerToServer(location);
    }
}

function clearDiveFormLocation() {
    console.log('Clearing dive location field');
    const diveLocation = document.getElementById('diveLocation');
    if (diveLocation) {
        diveLocation.value = '';
    } else {
        console.error('diveLocation element not found');
    }
}

// Function to update the dive form location field
function updateDiveFormLocation(location) {
    const latLngStr = `${location.lat()}, ${location.lng()}`;
    const diveLocation = document.getElementById('diveLocation');
    if (diveLocation) {
        diveLocation.value = latLngStr;
    } else {
        console.error('diveLocation element not found');
    }
}

// Function to rotate and show the dive form
function rotateForm() {
    const initialImage = document.getElementById('initialImage');
    const addDiveForm = document.getElementById('addDiveForm');

    if (initialImage && addDiveForm) {
        initialImage.style.display = 'none';
        addDiveForm.style.display = 'block';
    } else {
        console.error('initialImage or addDiveForm element not found');
    }
}

// Function to hide the dive form and show a random image
function hideDiveForm() {
    const addDiveForm = document.getElementById('addDiveForm');
    if (addDiveForm) {
        addDiveForm.style.display = 'none';
        showRandomImage();
    } else {
        console.error('addDiveForm element not found');
    }
}

// Function to show the confirmation message
function showConfirmationMessage() {
    console.log("showConfirmationMessage called");
    const messageContainer = document.getElementById('confirmationMessage');
    if (messageContainer) {
        console.log("Confirmation message element found.");
        messageContainer.style.display = 'block';
        setTimeout(() => {
            messageContainer.style.display = 'none';
            showRandomImage();
        }, 5000);
    } else {
        console.error("Confirmation message element not found.");
    }
}

// Function to show a random image
function showRandomImage() {
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
    } else {
        console.error('randomImage element not found');
    }
}

// Render existing dive logs
function renderDiveLogs() {
    if (Array.isArray(diveLogs) && diveLogs.length) {
        diveLogs.forEach(log => {
            const [lat, lng] = log.location.split(',').map(Number);
            addMarker(new google.maps.LatLng(lat, lng));
        });
    } else {
        console.warn('No dive logs found or diveLogs is not an array');
    }
}

function initializeData() {
    // Fetch markers and dive logs from the cache
    markers = getDataFromCache('markers') || [];
    diveLogs = getDataFromCache('dive_logs') || [];

    renderDiveLogs();
    renderMarkers();
}

function renderMarkers() {
    markersArray.forEach(marker => marker.setMap(null));
    markersArray = [];

    if (Array.isArray(markers) && markers.length) {
        markers.forEach(markerData => {
            const marker = new google.maps.Marker({
                position: { lat: markerData.lat, lng: markerData.lng },
                map: map,
            });
            marker.addListener('click', () => {
                const latLng = new google.maps.LatLng(markerData.lat, markerData.lng);
                updateDiveFormLocation(latLng);
            });
            marker.addListener('rightclick', () => {
                marker.setMap(null);
                clearDiveFormLocation();
            });
            markersArray.push(marker);
        });
        updateMarkerCluster();
    } else {
        console.warn('No markers found or markers is not an array');
    }
}

function updateMarkerCluster() {
    if (typeof MarkerClusterer !== 'undefined') {
        if (map.markerClusterer) {
            map.markerClusterer.clearMarkers();
        }

        console.log('Updating MarkerClusterer with markers:', markersArray);

        map.markerClusterer = new MarkerClusterer({
            markers: markersArray,
            map: map,
            // Use default algorithm and renderer
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

function createClusterElement(count) {
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

function saveDiveLog(diveLog) {
    console.log('Saving dive log:', diveLog);

    // Add the dive log to the cache
    diveLogs.push(diveLog);
    saveDataToCache('dive_logs', diveLogs);

    // Send the dive log data to the server in batches
    debouncedSaveDiveLog();
}

function debouncedSaveMarkerToServer(location) {
    fetch('/dives/add_marker/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({ lat: location.lat(), lng: location.lng() })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        if (data.status !== 'success') {
            throw new Error('Server error: ' + data.message);
        }
        console.log('Markers saved:', data);
        markers = [];
        saveDataToCache('markers', markers);
    })
    .catch(error => {
        console.error('Error:', error.message);
    });
}

function debouncedSaveDiveLog() {
    fetch('/dives/add_dive_log/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify(diveLogs)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (data.status !== 'success') {
                throw new Error('Server error: ' + data.message);
            }
            console.log('Dive logs saved:', data);
            diveLogs = [];
            saveDataToCache('dive_logs', diveLogs);
        })
        .catch(error => {
            console.error('Error:', error.message);
        });
}

// DOM content is loaded before adding event listeners
document.addEventListener('DOMContentLoaded', () => {
    const rawMarkers = JSON.parse(document.getElementById('rawMarkers').textContent);
    const rawDiveLogs = JSON.parse(document.getElementById('rawDiveLogs').textContent);

    if (rawMarkers) {
        markers = rawMarkers;
    }

    if (rawDiveLogs) {
        diveLogs = rawDiveLogs;
    }

    initializeData();

    fetch('/dives/most_common_buddy/')
        .then(response => {
            console.log('Fetching most common buddy...');
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const buddyInput = document.getElementById('diveBuddy');
            if (buddyInput && data.most_common_buddy) {
                buddyInput.value = data.most_common_buddy;
            } else {
                console.error('buddyInput not found or data missing');
            }
        })
        .catch(error => console.error('Error fetching most common buddy:', error));

    const addDiveForm = document.getElementById('addDiveForm');
    if (addDiveForm) {
        addDiveForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const diveDate = document.getElementById('diveDate');
            const diveName = document.getElementById('diveName');
            const diveLocation = document.getElementById('diveLocation');
            const buddyName = document.getElementById('diveBuddy');
            const diveDepth = document.getElementById('diveDepth');
            const waterTemp = document.getElementById('waterTemp');
            const visibility = document.getElementById('visibility');
            const bottomTime = document.getElementById('bottomTime');

            if (diveDate && diveName && diveLocation && buddyName && diveDepth && waterTemp && visibility && bottomTime) {
                const diveLog = {
                    date: diveDate.value,
                    name: diveName.value,
                    location: diveLocation.value,
                    buddy: buddyName.value,
                    depth: diveDepth.value,
                    temp: waterTemp.value,
                    visibility: visibility.value,
                    bottomTime: bottomTime.value,
                };
                saveDiveLog(diveLog);
                hideDiveForm();
                showConfirmationMessage();
            } else {
                console.error('One or more form elements are missing');
            }
        });
    } else {
        console.error('Add Dive form not found');
    }
});

function loadGoogleMapsApi() {
    const script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAPI3E9RTADYzaO0QRLzTbno11uKf-RxVQ&libraries=places&callback=initMap';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    const markerClustererScript = document.createElement('script');
    markerClustererScript.src = 'https://unpkg.com/@googlemaps/markerclusterer/dist/markerclustererplus.min.js';
    markerClustererScript.async = true;
    markerClustererScript.defer = true;
    document.head.appendChild(markerClustererScript);
}

loadGoogleMapsApi();
