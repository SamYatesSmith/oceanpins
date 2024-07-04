function initMap() {
    const map = new google.maps.Map(document.getElementById('readonly-map'), {
        center: { lat: 30.049, lng: 2.2277 },
        zoom: 2,
        mapTypeId: google.maps.MapTypeId.HYBRID,
        streetViewControl: false,
        disableDefaultUI: true,
        draggable: false,
        zoomControl: false,
    });

    fetch('/dives/get_divelog_markers/')
        .then(response => response.json())
        .then(markers => {
            const markerObjects = markers.map(location => {
                return new google.maps.Marker({
                    position: location,
                    map: map
                });
            });

            new MarkerClusterer(map, markerObjects, {
                imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
            });
        });
}
