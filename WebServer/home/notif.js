// import { fetchRequests } from './suggest.js';
// import { handlechalleng } from './challenge.js';

document.addEventListener('DOMContentLoaded', function() {
    fetchRequests();
    fetchSuggestions();
    // setInterval(fetchRequests, 3000);
    // setInterval(fetchSuggestions, 3000);

});

// Global state to track current data

let currentSuggestions = 0;

// Fetch friend requests
let currentRequests = 0;
export function fetchRequests() {
    fetch("/api/get_requests/")
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch friend requests');
            }
            return response.json();
        })
        .then(data => {
            if (data.length !== currentRequests) {
                currentRequests = data.length;
                updateRequests(data);
            }
        })
        .catch(error => {
            console.error('Error fetching friend requests:', error);
        });
}

// Handle friend request action
function handleRequestAction(action, senderUsername, requestId) {
    // console.log('Handling request:', action, senderUsername);
    fetch('/api/csrf-token/')
        .then(response => response.json())
        .then(data => {
            let token = data.csrfToken;
            fetch('/api/accept_request/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': token,
                },
                body: JSON.stringify({
                    'action': action,
                    'sender': senderUsername
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === true) {
                    // removeRequestFromUI(requestId);
                    // handlechalleng();
                    handlenotif();
                } else {
                    console.error('Failed to handle request:', data.message);
                }
            })
            .catch(error => {
                console.error('Error handling request action:', error);
            });
        })
        .catch(error => {
            console.error('Error fetching CSRF token:', error);
        });
}

// Remove request from UI
// function removeRequestFromUI(requestId) {
//     const requestElement = document.getElementById(`request-${requestId}`);
//     if (requestElement) {
//         requestElement.remove();
//     }
// }

// Update friend requests in the UI
function updateRequests(data) {
    const requests = document.getElementById('content_notify');
    requests.innerHTML = ''; // Clear previous requests
    data.forEach(item => {
        let container = document.createElement('div');
        container.classList.add('bar_content');
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.classList.add('bar_notify');
        container.id = `request-${item.id}`; // Set unique ID for the request

        let img = document.createElement('img');
        img.addEventListener('click', view_profile);
        img.id = item.username;
        img.src = item.photo_profile;
        img.style.width = "40px";
        img.style.height = "40px";
        img.style.borderRadius = "50%";
        img.style.border = "2px solid black";

        let username = document.createElement('p');
        username.textContent = item.sender_username;

        let accept = document.createElement('button');
        accept.textContent = "Accept";
        accept.id = `accept-${item.id}`; // Set unique ID for the button

        let reject = document.createElement('button');
        reject.textContent = "Reject";
        reject.id = `reject-${item.id}`; // Set unique ID for the button
        reject.style.background = "#C1462B";

        container.appendChild(img);
        container.appendChild(username);
        container.appendChild(accept);
        container.appendChild(reject);
        requests.appendChild(container);
        requests.appendChild(document.createElement('br'));

        // Event listener for 'Accept' button
        accept.addEventListener('click', function() {
            handleRequestAction('accept', item.sender_username, item.id);
        });

        // Event listener for 'Reject' button
        reject.addEventListener('click', function() {
            handleRequestAction('reject', item.sender_username, item.id);
        });
    });
}

// Fetch suggestions
function fetchSuggestions() {
    fetch('/api/suggest/')
        .then(response => {
            if (!response.ok) {
                document.getElementById('list_friend').style.display = 'none';
                // console.log("Failed to fetch suggestions");
                return;
            }
            return response.json();
        })
        .then(data => {
            if (data.length !== currentSuggestions) {
                currentSuggestions = data.length;
                handlenotif();
                updateSuggestions(data);
            }
        })
        .catch(error => {
            console.error('Error fetching suggestions:', error);
        });
}

// Update suggestions in the UI
function updateSuggestions(data) {
    var reward = document.getElementById('list_friend');
    reward.innerHTML = ''; // Clear previous suggestions

    data.forEach(item => {
        let container = document.createElement('div');
        container.classList.add('bar_content');
        container.style.display = 'flex';
        container.style.alignItems = 'center';

        let img = document.createElement('img');
        img.addEventListener('click', view_profile);
        img.id = item.username;
        img.src = item.photo_profile;
        img.style.width = "40px";
        img.style.height = "40px";
        img.style.borderRadius = "50%";
        img.style.border = "2px solid black";

        let div = document.createElement('div');
        div.style.width = "30%";

        let username = document.createElement('p');
        username.classList.add('username');
        username.textContent = item.username;
        div.appendChild(username);

        let addfriend = document.createElement('button');
        addfriend.textContent = "Add Friend";
        addfriend.id = item.username;

        container.appendChild(img);
        container.appendChild(div);
        container.appendChild(addfriend);
        reward.appendChild(container);
        reward.appendChild(document.createElement('br'));

        addfriend.addEventListener('click', function() {
            handleAddFriend(item.username);
        });
    });
}

// Handle add friend action
function handleAddFriend(username) {
    fetch('/api/csrf-token/')
        .then(response => response.json())
        .then(data => {
            let token = data.csrfToken;
            return fetch('/api/send_request/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': token,
                },
                body: JSON.stringify({
                    'receiver': username,
                })
            });
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === true) {
                fetchSuggestions();
            }
        })
        .catch(error => {
            console.error('Error sending friend request:', error);
        });
}

// Combined notification handling function
export function handlenotif() {
    // handleRequestsuggestion();
    // handlechalleng();
    fetchRequests();
    fetchSuggestions();
    
}
