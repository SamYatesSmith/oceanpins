// Interactive Map Javascript

let map;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
    });

    map.addListener('click', (event) => {
        // Optionally, add a marker on click
        addMarker(event.latLng);
    });
}

document.getElementById('addDiveForm').addEventListener('submit', function (e) {
    e.preventDefault();

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

    addDive(diveLog)
});
