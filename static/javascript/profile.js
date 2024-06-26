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

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded event triggered');
    console.log('Profile.js script is running');
    fetchMostRecentBuddy();
    fetchDiveCount();
});

function fetchMostRecentBuddy() {
    console.log('Fetching most recent buddy');
    fetch('/dives/most_recent_buddy/', {
        method: 'GET',
        headers: {
            'X-CSRFToken': csrftoken,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        console.log('Response received:', response);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Fetched most recent buddy data:', data);
        const buddyNameInput = document.getElementById('buddyName');
        buddyNameInput.value = data.most_recent_buddy || 'No data available';
    })
    .catch(error => {
        console.error('Error fetching the most recent buddy:', error);
        alert(`Error fetching the most recent buddy: ${error.message}`);
    });
}

function fetchDiveCount() {
    console.log('Fetching dive count');
    fetch('/dives/get_dive_count/', {
        method: 'GET',
        headers: {
            'X-CSRFToken': csrftoken,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        console.log('Response received:', response);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Fetched dive count:', data);
        const diveCountElement = document.getElementById('diveCount');
        diveCountElement.value = data.dive_count !== undefined ? data.dive_count : 'No data available';
    })
    .catch(error => {
        console.error('Error fetching dive count:', error);
        alert(`Error fetching dive count: ${error.message}`);
    });
}
