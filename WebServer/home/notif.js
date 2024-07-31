
import { fetchdelette } from './suggest.js';
import { fetchSuggestions } from './invite.js';
import { fetchAndUpdateFriends } from './msgfriend.js';



document.addEventListener('DOMContentLoaded', function() {
    fetchRequests();
    fetchSuggestions();

});



let currentSuggestions = 0;

// Fetch friend requests
let currentRequests = 0;
function fetchRequests() {
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
                    fetchdelette();
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
            fetchdelette();
            
            console.log('accept----------');
        });

        // Event listener for 'Reject' button
        reject.addEventListener('click', function() {
            handleRequestAction('reject', item.sender_username, item.id);
            fetchSuggestions();
        });
    });
}

// Fetch suggestions


// Combined notification handling function
export function handlenotif() {
    // handleRequestsuggestion();
    // handlechalleng();
    fetchRequests();
    fetchSuggestions();
    
}
