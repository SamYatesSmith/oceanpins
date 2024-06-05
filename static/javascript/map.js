// Interactive Map Javascript

// Global variable for the map
let map;

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

        // Add a double-click listener to the map
        map.addListener('dblclick', (event) => {
            event.stop();
            addMarker(event.latLng);
            updateDiveFormLocation(event.latLng);
            rotateForm();
        });

        map.addListener('dblclick', (event) => {
            event.stop();
        });

        // Ensure the map resizes correctly
        window.addEventListener('resize', () => {
            const center = map.getCenter();
            google.maps.event.trigger(map, 'resize');
            map.setCenter(center);
        });

        // Initialize the search box
        initAutocomplete();
        renderDiveLogs();
        renderMarkers();
    } else {
        console.error('Map div not found!');
    }
}

const initAutocomplete = () => {
    const input = document.getElementById('map-search');
    const autocomplete = new google.maps.places.Autocomplete(input);

    autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if(!place.geometry) {
            return console.error("No details available for the input '" + place.name + "'");
        }

        map.setCenter(place.geometry.location);
        map.setZoom(10);

        addMarker(place.geometry.location);
        updateDiveFormLocation(place.geometry.location);
        rotateForm();
    });
};

// Render existing markers
function renderMarkers() {
    if (Array.isArray(markers) && markers.length) {
        markers.forEach(marker => {
            addMarker(new google.maps.LatLng(marker.lat, marker.lng));
        });
    } else {
        console.warn('No markers found or markers is not an array');
    }
}

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

    saveMarker(location);
}

function saveMarker(location) {
    console.log('Saving marker at:', location.lat(), location.lng()); // Debug statement
    fetch('/dives/add_marker/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({ lat: location.lat(), lng: location.lng() }),
    }).then(response => response.json()).then(data => {
        console.log('Marker saved:', data);
    }).catch((error) => {
        console.error('Error:', error);
    });
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
        'images/coral2.jpg',
        'images/dolphins.jpg',
        'images/hero.jpg',
        'images/openwater.jpg',
        'images/underwater1.jpg',
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

// DOM content is loaded before adding event listeners
document.addEventListener('DOMContentLoaded', () => {
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
                // Create a dive log object from form inputs
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
                addDive(diveLog);
                hideDiveForm();
                showConfirmationMessage();
            } else {
                console.error('One or more form elements are missing');
            }
        });
    } else {
            console.error('Add Dive form not found');
    }

    // Function to add a dive to the map and send data to the server
    function addDive(diveLog) {
        const [lat, lng] = diveLog.location.split(',').map(Number);
        const marker = new google.maps.Marker({
            position: { lat, lng },
            map: map,
            title: diveLog.name,
        });

        // Add a click listener to the marker to show dive details
        marker.addListener('click', () => {
            showDiveCard(diveLog);
        });

        marker.addListener('rightclick', () => {
            marker.setMap(null);
            clearDiveFormLocation();
        });

        // Send the dive log data to the server
        fetch('/dives/addDive/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify(diveLog),
        }).then(response => response.json()).then(data => {
            console.log('Dive added:', data);
        }).catch((error) => {
            console.error('Error:', error);
        });
    }

    // Function to display dive details in a modal
    function showDiveCard(diveLog) {
        document.getElementById('diveNameDetail').innerText = `Name: ${diveLog.name}`;
        document.getElementById('diveLocationDetail').innerText = `Location: ${diveLog.location}`;
        document.getElementById('diveDateDetail').innerText = `Date: ${diveLog.date}`;
        document.getElementById('diveDepthDetail').innerText = `Depth: ${diveLog.depth} m`;
        document.getElementById('diveBuddyDetail').innerText = `Buddy: ${diveLog.buddy}`;
        document.getElementById('waterTempDetail').innerText = `Water Temp: ${diveLog.temp} °C`;
        document.getElementById('visibilityDetail').innerText = `Visibility: ${diveLog.visibility} m`;
        document.getElementById('bottomTimeDetail').innerText = `Bottom Time: ${diveLog.bottomTime} minutes`;

        // Display dive images in the gallery
        const diveGallery = document.getElementById('diveGallery');
        diveGallery.innerHTML = '';
        const imageUrls = diveLog.imageUrls || [];
        imageUrls.forEach((url) => {
            const img = document.createElement('img');
            img.src = url;
            img.classList.add('img-fluid');
            diveGallery.appendChild(img);
        });

        // Show the modal with dive details
        $('#diveCardModal').modal('show');
    }

    // Function to load Google Maps API
    function loadGoogleMapsApi() {
        const script = document.createElement('script');
        script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAPI3E9RTADYzaO0QRLzTbno11uKf-RxVQ&libraries=places&callback=initMap';
        script.async = true;
        script.defer = true;
        script.setAttribute('loading', 'async');
        document.head.appendChild(script);
    }

    // Load the Google Maps API
    loadGoogleMapsApi();
})