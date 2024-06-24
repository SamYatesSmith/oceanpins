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

$(document).ready(function() {
    $('#toggleGuide').click(function() {
        var $guideContainer = $('.guide-container');
        var $guideList = $('#guideList');
        var $toggleArrow = $('#toggleArrow');
        var $guideCol = $('.guide-col');
        var $mapCol = $('.map-col');

        $guideList.slideToggle(300, function() {
            if ($guideList.is(':visible')) {
                $guideContainer.addClass('expanded');
                $toggleArrow.removeClass('arrow-right').addClass('arrow-down');
                $('#toggleGuide').attr('aria-expanded', 'true');
                $guideCol.addClass('col-md-2').removeClass('col-md-1');
                $mapCol.addClass('col-md-7').removeClass('col-md-8');
            } else {
                $guideContainer.removeClass('expanded');
                $toggleArrow.removeClass('arrow-down').addClass('arrow-right');
                $('#toggleGuide').attr('aria-expanded', 'false');
                $guideCol.addClass('col-md-1').removeClass('col-md-2');
                $mapCol.addClass('col-md-8').removeClass('col-md-7');
            }
        });
    });
});


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
        const diveLog = {
            date: new Date().toISOString().split('T')[0],
            name: '',
            buddy: '',
            depth: 0,
            temp: 0,
            visibility: 0,
            bottom_time: 0
        };

        const marker = addMarker(location, diveLog);

        updateDiveFormLocation(location);
        showDiveForm();

        document.getElementById('addDiveForm').onsubmit = (e) => {
            e.preventDefault();

            diveLog.date = document.getElementById('diveDate').value;
            diveLog.name = document.getElementById('diveName').value;
            diveLog.buddy = document.getElementById('diveBuddy').value;
            diveLog.depth = document.getElementById('diveDepth').value;
            diveLog.temp = document.getElementById('waterTemp').value;
            diveLog.visibility = document.getElementById('visibility').value;
            diveLog.bottom_time = document.getElementById('bottomTime').value;

            addDiveLog(location, diveLog, marker);
        };
    }, 300));

    map.addListener('zoom_changed', handleZoomChange);

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
        markersArray.forEach(marker => marker.setMap(map));
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

const addDiveLog = (location, diveLog, marker) => {
    if (!diveLog.date || !/^\d{4}-\d{2}-\d{2}$/.test(diveLog.date)) {
        diveLog.date = new Date().toISOString().split('T')[0]; // Set to current date if not valid
    }

    diveLog.location = `${location.lat()}, ${location.lng()}`;

    console.log('Adding new dive log with data:', diveLog);

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
            diveLog.id = data.dive_log;
            marker.diveLog = diveLog;
            clearDiveForm();
            hideDiveForm();
            showConfirmationMessage();
        } else {
            alert('Failed to save dive log: ' + data.message);
        }
    })
    .catch(error => alert('Error: ' + error.message));
};

const formatLocation = (location) => {
    return `${location.lat().toFixed(6)}, ${location.lng().toFixed(6)}`;
}

const loadDiveLogs = () => {
    fetch('/dives/view_dive_logs/')
        .then(response => response.json())
        .then(data => {
            const diveLogs = data.dive_logs;
            diveLogs.forEach(log => {
                const [lat, lng] = log.location.split(',').map(coord => parseFloat(coord).toFixed(6));
                const location = new google.maps.LatLng(parseFloat(lat), parseFloat(lng));
                addMarker(location, log);
            });
        })
        .catch(error => alert('Error loading dive logs: ' + error.message));
};


const addMarker = (location, diveLog) => {
    const marker = new google.maps.Marker({
        position: location,
    });

    marker.diveLog = diveLog || {};

    marker.addListener('click', () => {
        showEditDiveForm(marker);
    });

    marker.addListener('mouseover', () => {
        showHoverWindow(marker);
    });

    marker.addListener('mouseout', () => {
        hideHoverWindow(marker);
    });

    marker.addListener('rightclick', (event) => {
        showConfirmationDialog(() => {
            removeMarker(marker, location);
        });
    });

    markersArray.push(marker);
    if (map.getZoom() <= 5) {
        markerCluster.addMarker(marker);
    } else {
        marker.setMap(map);
    }
    
    return marker;
};

const showHoverWindow = (marker) => {
    const diveLog = marker.diveLog || {};
    const contentString = `
        <div>
            <p><strong>Dive Name:</strong> ${diveLog.name || 'N/A'}</p>
            <p><strong>Date:</strong> ${diveLog.date || 'N/A'}</p>
            <p><strong>Location:</strong> ${diveLog.location || 'N/A'}</p>
            <p><strong>Buddy:</strong> ${diveLog.buddy || 'N/A'}</p>
            <p><strong>Depth:</strong> ${diveLog.depth !== undefined ? diveLog.depth + ' meters' : 'N/A'}</p>
            <p><strong>Water Temp:</strong> ${diveLog.temp !== undefined ? diveLog.temp + ' °C' : 'N/A'}</p>
            <p><strong>Visibility:</strong> ${diveLog.visibility !== undefined ? diveLog.visibility + ' meters' : 'N/A'}</p>
            <p><strong>Bottom Time:</strong> ${diveLog.bottom_time !== undefined ? diveLog.bottom_time + ' minutes' : 'N/A'}</p>
        </div>
    `;
    const infowindow = new google.maps.InfoWindow({
        content: contentString,
    });
    infowindow.open(map, marker);
    marker.infowindow = infowindow;
};


const hideHoverWindow = (marker) => {
    if (marker && marker.infowindow) {
        marker.infowindow.close();
        marker.infowindow = null;
    }
}

const showEditDiveForm = (marker) => {
    const diveLog = marker.diveLog;

    const addDiveForm = document.getElementById('addDiveForm');
    const initialImage = document.getElementById('initialImage');
    const randomImage = document.getElementById('randomImage');

    if (addDiveForm) addDiveForm.style.display = 'block';
    if (initialImage) initialImage.style.display = 'none';
    if (randomImage) randomImage.style.display = 'none';

    document.getElementById('diveDate').value = diveLog.date || '';
    document.getElementById('diveName').value = diveLog.name || '';
    document.getElementById('diveLocation').value = diveLog.location || '';
    document.getElementById('diveBuddy').value = diveLog.buddy || '';
    document.getElementById('diveDepth').value = diveLog.depth || '';
    document.getElementById('waterTemp').value = diveLog.temp || '';
    document.getElementById('visibility').value = diveLog.visibility || '';
    document.getElementById('bottomTime').value = diveLog.bottom_time || '';

    const formTitle = document.querySelector('#addDiveForm h2');
    if (formTitle) formTitle.textContent = 'Edit your Dive';

    addDiveForm.onsubmit = (e) => {
        e.preventDefault();
        const updatedDiveLog = {
            date: document.getElementById('diveDate').value,
            name: document.getElementById('diveName').value,
            location: document.getElementById('diveLocation').value,
            buddy: document.getElementById('diveBuddy').value,
            depth: document.getElementById('diveDepth').value,
            temp: document.getElementById('waterTemp').value,
            visibility: document.getElementById('visibility').value,
            bottomTime: document.getElementById('bottomTime').value,
        };
        updateDiveLog(marker, updatedDiveLog);
    };
}

const removeMarker = (marker, location) => {
    const formattedLocation = formatLocation(location);
    const user = userId;
    console.log('Attempting to remove marker at location:', formattedLocation, 'for user:', user);

    const payload = { id: marker.diveLog.id, location: formattedLocation, user: user };
    console.log('Payload being sent for removal:', payload);  // Log the payload

    fetch('/dives/remove_dive_log/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            console.log(`Marker at location ${formattedLocation} removed successfully.`);
            markerCluster.removeMarker(marker);
            markersArray = markersArray.filter(m => m !== marker);
            marker.setMap(null);  // Ensure the marker is removed from the map
        } else {
            alert('Failed to remove dive log: ' + data.message);
        }
    })
    .catch(error => alert('Error: ' + error.message));
};

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

const updateDiveLog = (marker, updatedDiveLog) => {
    const payload = { id: marker.diveLog.id, ...updatedDiveLog };
    console.log('Payload being sent:', payload);

    fetch('/dives/update_dive_log/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            marker.diveLog = { ...marker.diveLog, ...updatedDiveLog };
            hideDiveForm();
            showConfirmationMessage();
        } else {
            alert('Failed to update dive log: ' + data.message);
        }
    })
    .catch(error => alert('Error: ' + error.message));
};


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
