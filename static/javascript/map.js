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
        var $mapHelpContainer = $('#mapHelpContainer');
        var $toggleArrow = $('#toggleArrow');

        $mapHelpContainer.slideToggle(300, function() {
            if ($mapHelpContainer.is(':visible')) {
                $toggleArrow.removeClass('arrow-right').addClass('arrow-down');
                $('#toggleGuide').attr('aria-expanded', 'true');
            } else {
                $toggleArrow.removeClass('arrow-down').addClass('arrow-right');
                $('#toggleGuide').attr('aria-expanded', 'false');
            }
        });
    });

    // Copy content from guideList to mapHelpContainer
    $('#mapHelpContainer').html($('#guideList').html());

    const mapElement = document.getElementById('map');
    if (mapElement) {
        mapElement.addEventListener('contextmenu', function(event) {
            event.preventDefault();
        });
    }

    // Function to apply column layout and handle scroll behavior
    const applyColumnLayout = () => {
        if (window.innerWidth <= 1200) {
            $('.row.head-row').css({ 'flex-direction': 'column', 'align-items': 'center' });
            $('.col-md-2, .col-md-3, .col-md-7').css({ 'width': '100%', 'max-width': '100%', 'margin-bottom': '20px' });
            $('.map-container').css({ 'flex-direction': 'column', 'height': 'auto' });
            $('.main-content').css({ 'overflow-y': 'auto', 'height': 'auto' });
            $('#toggleGuide').css({ 'width': '50%', 'max-width': '400px', 'margin': '0 auto' });
        } else {
            $('.row.head-row').css({ 'flex-direction': '', 'align-items': '' });
            $('.col-md-2, .col-md-3, .col-md-7').css({ 'width': '', 'max-width': '', 'margin-bottom': '' });
            $('.map-container').css({ 'flex-direction': '', 'height': '' });
            $('.main-content').css({ 'overflow-y': '', 'height': '' });
            $('#toggleGuide').css({ 'width': '50%', 'max-width': '400px', 'margin': '0 auto' });
        }
    };

    // Handle responsive changes
    const handleResponsiveChanges = () => {
        applyColumnLayout();
    };

    // Initial layout adjustment
    handleResponsiveChanges();

    // Adjust layout on window resize
    $(window).resize(function() {
        handleResponsiveChanges();
    });
});

const updateMapToolsHeight = () => {
    const mapTools = document.querySelector('.map-tools');
    if (mapTools) {
        if (window.innerWidth <= 1200) {
            mapTools.style.height = 'auto';
            mapTools.style.maxHeight = '40vh';
            mapTools.style.marginBottom = '20px';
        } else {
            mapTools.style.height = 'calc(100vh - var(--header-height) - var(--footer-height) - 20px)';
            mapTools.style.maxHeight = 'calc(100vh - var(--header-height) - var(--footer-height) - 20px)';
            mapTools.style.overflowY = 'auto';
        }
    }
};

const resizeMap = () => {
    if (diveMap) {
        google.maps.event.trigger(diveMap, 'resize');
        const bounds = new google.maps.LatLngBounds();
        markersArray.forEach(marker => {
            bounds.extend(marker.getPosition());
        });
        diveMap.fitBounds(bounds);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    clearLocalStorage();
    loadGoogleMapsApi()
        .then(() => {
            initMap();
            window.addEventListener('resize', resizeMap);
        })
        .catch(error => alert('Error loading Google Maps: ' + error.message));
    
    const mapElement = document.getElementById('map');
    if (mapElement) {
        mapElement.addEventListener('contextmenu', function(event) {
                event.preventDefault();
            });
    }
});

const loadGoogleMapsApi = () => new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
        resolve();
        return;
    }

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

const initMap = async () => {
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    const mapDiv = document.getElementById('map');
    diveMap = new google.maps.Map(mapDiv, {
        center: { lat: 30.149, lng: 17.041 },
        zoom: 2.2,
        mapId: '23026dc1bc7a39cd',
        mapTypeId: google.maps.MapTypeId.HYBRID,
        streetViewControl: false,
        tilt: 45,
        heading: 90,
        gestureHandling: 'auto',
        draggable: true,
    });

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
        updateMapToolsHeight();
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
            e.stopPropagation();
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

    google.maps.event.addListener(markerCluster, 'clusterclick', function(cluster) {
        diveMap.fitBounds(cluster.getBounds());
    });
}

const handleZoomChange = () => {
    const currentZoom = diveMap.getZoom();
    if (currentZoom <= 5) {
        if (markerCluster) {
            markerCluster.addMarkers(markersArray);
        }
    } else {
        if (markerCluster) {
            markerCluster.clearMarkers();
        }
        markersArray.forEach(marker => marker.setMap(diveMap));
    }
};

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
    hideRandomImage();
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
            showConfirmationMessage('New marker added to the map');
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
        content: markerContent,
        title: 
`
Dive Name: ${diveLog.name || 'N/A'}, Date: ${diveLog.date || 'N/A'}, 
Buddy: ${diveLog.buddy || 'N/A'}, 
Depth: ${diveLog.depth !== undefined ? diveLog.depth + ' meters' : 'N/A'}, 
Temperature: ${diveLog.temp !== undefined ? diveLog.temp + ' °C' : 'N/A'}, 
Visibility: ${diveLog.visibility !== undefined ? diveLog.visibility + ' meters' : 'N/A'}, 
Bottom Time: ${diveLog.bottom_time !== undefined ? diveLog.bottom_time + ' minutes' : 'N/A'}
`
    });

    marker.diveLog = diveLog || {};

    marker.addListener('click', () => {
        showEditDiveForm(marker);
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
    hideRandomImage();
    let confirmationModal = document.getElementById('confirmationModal');
    if (!confirmationModal) {
        console.error('Confirmation modal not found!');
        return;
    }

    $(confirmationModal).modal('show');

    const confirmYesButton = document.getElementById('confirmYes');
    confirmYesButton.onclick = () => {
        console.log('Confirmation received');
        $(confirmationModal).modal('hide');
        callback();
    };
};

const showEditDiveForm = (marker) => {
    hideRandomImage();
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
    hideRandomImage();
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
            marker.map = null;
            markersArray = markersArray.filter(m => m !== marker);
            marker.setMap(null);
            showConfirmationMessage('Marker deleted successfully', showRandomImage);
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
    const initialImage = document.getElementById('initialImage');
    const randomImage = document.getElementById('randomImage');
    const addDiveForm = document.getElementById('addDiveForm');

    if (initialImage) initialImage.style.display = 'none';
    if (randomImage) randomImage.style.display = 'none';
    if (addDiveForm) {
        addDiveForm.style.display = 'block';
        addDiveForm.style.position = 'relative';
    } else {
        console.error('addDiveForm element not found');
    }
}

const hideDiveForm = () => {
    document.getElementById('addDiveForm').style.display = 'none';
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

const showConfirmationMessage = (message, callback) => {
    hideRandomImage();
    const messageContainer = document.getElementById('confirmationMessage');
    const randomImage = document.getElementById('randomImage');

    if (randomImage) {
        randomImage.style.display = 'none';
    }

    if (messageContainer) {
        messageContainer.textContent = message;
        messageContainer.style.display = 'block';
        setTimeout(() => {
            messageContainer.style.display = 'none';
            if (typeof callback === 'function') {
                setTimeout(callback, 3500);
            }
        }, 3500);
    }
};

function showRandomImage() {
    console.log('showRandomImage called');

    // Hide the initial image
    const initialImage = document.getElementById('initialImage');
    if (initialImage) {
        initialImage.style.display = 'none';
        console.log('initialImage hidden');
    } else {
        console.log('initialImage not found');
    }

    // Remove any existing randomImage
    const existingRandomImage = document.getElementById('randomImage');
    if (existingRandomImage) {
        existingRandomImage.remove();
        console.log('Existing randomImage removed');
    }

    setTimeout(() => {
        const randomImage = document.createElement('img');
        randomImage.id = 'randomImage';
        randomImage.src = images[Math.floor(Math.random() * images.length)];
        randomImage.classList.add('img-fluid');

        const mapToolsDiv = document.querySelector('.map-tools');
        if (mapToolsDiv) {
            mapToolsDiv.appendChild(randomImage);
            console.log('randomImage appended', randomImage);
            setTimeout(() => {
                randomImage.classList.add('show');
            }, 50);
        } else {
            console.log('mapToolsDiv not found');
        }
    }, 3500); // Forced delay matching the confirmation message duration
}


const hideRandomImage = () => {
    const randomImage = document.getElementById('randomImage');
    if (randomImage) {
        randomImage.remove()
        console.log('randomImage hidden');
    }
};

const confirmationMessage = document.getElementById('confirmationMessage');
if (confirmationMessage) {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'style') {
                const display = window.getComputedStyle(confirmationMessage).display;
                if (display !== 'none') {
                    console.log('confirmationMessage is visible');
                    showRandomImage();
                }
            }
        });
    });

    observer.observe(confirmationMessage, { attributes: true });
} else {
    console.log('confirmationMessage not found');
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
    showConfirmationMessage('New marker added to the map', showRandomImage);
};

const updateDiveLog = (marker, updatedDiveLog) => {
    hideRandomImage();

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
            showConfirmationMessage('Marker edited successfully');
        } else {
            alert('Failed to update dive log: ' + data.message);
        }
    })
    .catch(error => alert('Error: ' + error.message));
};

const debounce = (func, wait) => {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}
