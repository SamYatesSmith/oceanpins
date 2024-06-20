let map;
let markersArray = [];
let markerCluster;
const userId = document.getElementById('userId').value || null;

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

const clearLocalStorage = () => {
    localStorage.clear();
    sessionStorage.clear();
}

function initMap() {
    const mapDiv = document.getElementById('map');
    map = new google.maps.Map(mapDiv, {
        center: { lat: 30.049, lng: 2.2277 },
        zoom: 2,
        mapTypeId: google.maps.MapTypeId.HYBRID,
        streetViewControl: false
    });

    map.addListener('dblclick', debounce((event) => {
        const location = event.latLng;
        addMarker(location);
        updateDiveFormLocation(location);
        showDiveForm();
    }, 300));

    initAutocomplete();
    loadDiveLogs();

    markerCluster = new MarkerClusterer(map, [], {
        imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
    });
}

const handleZoomChange = () => {
    const currentZoom = map.getZoom();
    if (currentZoom <= 5) {
        markerCluster.addMarkers(markersArray);
    } else {
        markerCluster.clearMarkers();
    }
}

const initAutocomplete = () => {
    const input = document.getElementById('map-search');
    const autocomplete = new google.maps.places.Autocomplete(input);

    autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
            return;
        }
        map.setCenter(place.geometry.location);
        map.setZoom(10);
        input.value = '';
    });
}

const addDiveLog = (location, diveLog) => {
    diveLog.location = `${location.lat()}, ${location.lng()}`;

    fetch('/dives/add_dive_log/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify(diveLog)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            clearDiveForm();
            hideDiveForm();
            showConfirmationMessage();
        } else {
            alert('Failed to save dive log: ' + data.message);
        }
    })
    .catch(error => alert('Error: ' + error.message));
}

const formatLocation = (location) => {
    return `${location.lat().toFixed(6)}, ${location.lng().toFixed(6)}`;
}

const addMarker = (location) => {
    const marker = new google.maps.Marker({
        position: location,
        map: map,
    });
    marker.addListener('click', () => updateDiveFormLocation(location));
    marker.addListener('rightclick', (e) => {
        e.domEvent.preventDefault();
        showConfirmationDialog(() => removeMarker(marker, location));
    });
    markersArray.push(marker);
    if (map.getZoom() <= 5) {
        markerCluster.addMarker(marker);
    } else {
        marker.setMap(map);
    }
}

const removeMarker = (marker, location) => {
    const formattedLocation = formatLocation(location);
    const user = userId;
    console.log('Attempting to remove marker at location:', formattedLocation, 'for user:', user);

    fetch('https://8000-samyatessmith-oceanpins-afvm4g1x7r4.ws-eu114.gitpod.io/dives/remove_dive_log/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({ location: formattedLocation, user: user })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            markerCluster.removeMarker(marker);
            markersArray = markersArray.filter(m => m !== marker);
        } else {
            alert('Failed to remove dive log: ' + data.message);
        }
    })
    .catch(error => alert('Error: ' + error.message));
}

const showConfirmationDialog = (callback) => {
    let confirmationModal = document.getElementById('confirmationModal');
    if (!confirmationModal) {
        confirmationModal = document.createElement('div');
        confirmationModal.id = 'confirmationModal';
        confirmationModal.classList.add('modal', 'fade');
        confirmationModal.setAttribute('tabindex', '-1');
        confirmationModal.setAttribute('role', 'dialog');
        confirmationModal.innerHTML = `
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Confirm Marker Removal</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p>Are you sure you want to remove this marker?</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">No</button>
                        <button type="button" class="btn btn-primary" id="confirmYes">Yes</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(confirmationModal);
    }

    $(confirmationModal).modal('show');

    const confirmYesButton = document.getElementById('confirmYes');
    confirmYesButton.onclick = () => {
        $(confirmationModal).modal('hide');
        callback();
    };
};

const updateDiveFormLocation = (location) => {
    const latLngStr = `${location.lat()}, ${location.lng()}`;
    const diveLocation = document.getElementById('diveLocation');
    if (diveLocation) diveLocation.value = latLngStr;
}

const showDiveForm = () => {
    document.getElementById('initialImage').style.display = 'none';
    document.getElementById('randomImage').style.display = 'none';
    document.getElementById('addDiveForm').style.display = 'block';
}

const hideDiveForm = () => {
    document.getElementById('addDiveForm').style.display = 'none';
    showRandomImage();
}

const clearDiveForm = () => {
    document.getElementById('diveDate').value = '';
    document.getElementById('diveName').value = '';
    document.getElementById('diveLocation').value = '';
    document.getElementById('diveBuddy').value = '';
    document.getElementById('diveDepth').value = '';
    document.getElementById('waterTemp').value = '';
    document.getElementById('visibility').value = '';
    document.getElementById('bottomTime').value = '';
}

const showConfirmationMessage = () => {
    const messageContainer = document.getElementById('confirmationMessage');
    if (messageContainer) {
        messageContainer.style.display = 'block';
        setTimeout(() => {
            messageContainer.style.display = 'none';
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

document.getElementById('addDiveForm').onsubmit = (e) => {
    e.preventDefault();
    const locationStr = document.getElementById('diveLocation').value;
    const [lat, lng] = locationStr.split(',').map(Number);
    const location = new google.maps.LatLng(lat, lng);
    const diveLog = {
        date: document.getElementById('diveDate').value,
        name: document.getElementById('diveName').value,
        buddy: document.getElementById('diveBuddy').value,
        depth: document.getElementById('diveDepth').value,
        temp: document.getElementById('waterTemp').value,
        visibility: document.getElementById('visibility').value,
        bottomTime: document.getElementById('bottomTime').value,
    };
    addDiveLog(location, diveLog);
};

const loadDiveLogs = () => {
    fetch('/dives/view_dive_logs/')
        .then(response => response.json())
        .then(data => {
            const diveLogs = data.dive_logs;
            diveLogs.forEach(log => {
                const [lat, lng] = log.location.split(',').map(coord => parseFloat(coord).toFixed(6));
                addMarker(new google.maps.LatLng(parseFloat(lat), parseFloat(lng)));
            });
        })
        .catch(error => alert('Error loading dive logs: ' + error.message));
}

document.addEventListener('DOMContentLoaded', () => {
    clearLocalStorage();
    loadGoogleMapsApi()
        .then(() => initMap())
        .catch(error => alert('Error loading Google Maps: ' + error.message));
    
    document.addEventListener('contextmenu', function(event) {
        event.preventDefault();
    });
});

const loadGoogleMapsApi = () => new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAPI3E9RTADYzaO0QRLzTbno11uKf-RxVQ&libraries=places';
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error('Failed to load Google Maps API'));
    document.head.appendChild(script);
});

const debounce = (func, wait) => {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}
