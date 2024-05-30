// Interactive Map Javascript

// Global variable for the map
let map;

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
            showDiveForm();
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
    } else {
        console.error('Map div not found!');
    }
}

// Function to add a marker on the map using AdvancedMarkerElement
function addMarker(location) {
    const marker = new google.maps.Marker({
        position: location,
        map: map,
    });

    marker.addListener('click', () => {
        updateDiveFormLocation(location);
    });

    // Right-click listener to remove the marker
    marker.addListener('rightclick', () => {
        console.log('Marker right-clicked');
        marker.setMap(null);
    });
}

// Function to update the dive form location field
function updateDiveFormLocation(location) {
    const latLngStr = `${location.lat()}, ${location.lng()}`;
    document.getElementById('diveLocation').value = latLngStr;
}

// Function to show the dive form
function showDiveForm() {
    document.getElementById('addDiveForm').style.display = 'block';
}

// Function to hide the dive form
function hideDiveForm() {
    document.getElementById('addDiveForm').style.display = 'none';
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
        }, 5000);
    } else {
        console.error("Confirmation message element not found.");
    }
}

// Ensure DOM content is loaded before adding event listeners
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('addDiveForm').addEventListener('submit', function (e) {
        e.preventDefault();

        // Create a dive log object from form inputs
        const diveLog = {
            date: document.getElementById('diveDate').value,
            name: document.getElementById('diveName').value,
            location: document.getElementById('diveLocation').value,
            buddy: document.getElementById('diveBuddy').value,
            depth: document.getElementById('diveDepth').value,
            temp: document.getElementById('waterTemp').value,
            visibility: document.getElementById('visibility').value,
            bottomTime: document.getElementById('bottomTime').value,
        };
        addDive(diveLog);
        hideDiveForm();
        showConfirmationMessage();
    });

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
            marker.setMap(null);  // Remove the marker from the map
        });
        // Send the dive log data to the server
        fetch('/dives/addDive/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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
        script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAPI3E9RTADYzaO0QRLzTbno11uKf-RxVQ&callback=initMap';
        script.async = true;
        script.defer = true;
        script.setAttribute('loading', 'async');  // Adding loading=async attribute
        document.head.appendChild(script);
    }

    // Load the Google Maps API
    loadGoogleMapsApi();
});