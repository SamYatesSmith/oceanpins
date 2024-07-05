let diveMap;
let markersArray = [];
let markerCluster;
let userId = null;
const userIdElement = document.getElementById('userId');

if (userIdElement) {
    userId = userIdElement.value;
}

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

const csrftoken = getCookie('csrftoken');

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

const loadGoogleMapsApi = () => new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAPI3E9RTADYzaO0QRLzTbno11uKf-RxVQ&map_ids=23026dc1bc7a39cd&libraries=places,marker';
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error('Failed to load Google Maps API'));
    document.head.appendChild(script);
});

const createClusterContent = (count) => {
    const div = document.createElement('div');
    div.className = 'cluster-marker';
    div.textContent = count;
    div.style.backgroundColor = 'rgba(0, 123, 255, 0.6)';
    div.style.borderRadius = '50%';
    div.style.color = 'white';
    div.style.width = '40px';
    div.style.height = '40px';
    div.style.display = 'flex';
    div.style.alignItems = 'center';
    div.style.justifyContent = 'center';
    return div;
};

async function initMap() {
    console.log('Initializing map');
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    const mapDiv = document.getElementById('map');
    diveMap = new google.maps.Map(mapDiv, {
        center: { lat: 30.049, lng: 2.2277 },
        zoom: 2,
        mapId: '23026dc1bc7a39cd',
        mapTypeId: google.maps.MapTypeId.HYBRID,
        streetViewControl: false,
        tilt: 45,
        heading: 90
    });

    console.log('Map initialized with Map ID:', diveMap.mapId);

    diveMap.addListener('dblclick', debounce((event) => {
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

    diveMap.addListener('zoom_changed', handleZoomChange);

    initAutocomplete();
    loadDiveLogs();

    markerCluster = new markerClusterer.MarkerClusterer({ 
        map: diveMap, 
        markers: [], 
        renderer: {
            render: ({ count, position }) => {
                return new AdvancedMarkerElement({
                    position,
                    content: createClusterContent(count),
                });
            },
        },
        algorithm: new markerClusterer.GridAlgorithm({ maxDistance: 100 }),
    });
}

const handleZoomChange = () => {
    const currentZoom = diveMap.getZoom();
    if (currentZoom <= 5) {
        markerCluster.addMarkers(markersArray);
    } else {
        markerCluster.clearMarkers();
        markersArray.forEach(marker => marker.map = diveMap);
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
        diveMap.setCenter(place.geometry.location);
        diveMap.setZoom(10);
        input.value = '';
    });
}

const addDiveLog = (location, diveLog, marker) => {
    if (!diveLog.date || !/^\d{4}-\d{2}-\d{2}$/.test(diveLog.date)) {
        diveLog.date = new Date().toISOString().split('T')[0];
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
    const markerContent = document.createElement('div');
    markerContent.innerHTML = '<img src="/static/images/markerPin.png" style="width: 80px; height: 80px;">'; 
    const marker = new google.maps.marker.AdvancedMarkerElement({
        position: location,
        map: diveMap,
        content: markerContent
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

    markerContent.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        showConfirmationDialog(() => {
            removeMarker(marker, location);
        });
    });

    markersArray.push(marker);
    if (diveMap.getZoom() <= 5) {
        markerCluster.addMarker(marker);
    } else {
        marker.map = diveMap;
    }
    
    return marker;
};

// Show Confirmation Dialog
const showConfirmationDialog = (callback) => {
    let confirmationModal = document.getElementById('confirmationModal');
    if (!confirmationModal) {
        console.error('Confirmation modal not found!');
        return;
    }

    console.log('Displaying confirmation dialog');
    $(confirmationModal).modal('show');

    const confirmYesButton = document.getElementById('confirmYes');
    confirmYesButton.onclick = () => {
        console.log('Confirmation received');
        $(confirmationModal).modal('hide');
        callback();
    };
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
    infowindow.open(diveMap, marker);
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
    console.log('Payload being sent for removal:', payload);

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
            marker.setMap(null);
        } else {
            alert('Failed to remove dive log: ' + data.message);
        }
    })
    .catch(error => alert('Error: ' + error.message));
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
    
    // Prevent context menu only for the map, not for markers
    const mapElement = document.getElementById('map');
    if (mapElement) {
        mapElement.addEventListener('contextmenu', function(event) {
            if (event.target.tagName !== 'IMG' || !event.target.src.includes('markerPin.png')) {
                event.preventDefault();
            }
        });
    }
});

const debounce = (func, wait) => {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}
