import { handleRequestsuggestion } from './suggest.js';
import { handlechalleng } from './challenge.js';
document.addEventListener('DOMContentLoaded', function() {
    fetch("/api/get_requests/")
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch friend requests');
            }
            return response.json();
        })
        .then(data => {
            var requests = document.getElementById('content_notify');
            data.forEach(item => {
                let container = document.createElement('div');
                container.classList.add('bar_content');
                container.style.display = 'flex';
                container.style.alignItems = 'center';
                container.classList.add('bar_notify');

                let img = document.createElement('img');
                img.setAttribute("onclick", "view_profile()");
                img.src = item.photo_profile;
                img.style.width = "40px";
                img.style.height = "40px";
                img.style.borderRadius = "50%";
                img.style.border = "2px solid black";

                let username = document.createElement('p');
                username.textContent = item.sender_username;

                let accept = document.createElement('button');
                accept.textContent = "Accept";
                accept.id = item.id; // Assuming item.id uniquely identifies the request

                let reject = document.createElement('button');
                reject.textContent = "Reject";
                reject.id = item.id; // Assuming item.id uniquely identifies the request
                reject.style.background = "red";

                container.appendChild(img);
                container.appendChild(username);
                container.appendChild(accept);
                container.appendChild(reject);
                requests.appendChild(container);
                requests.appendChild(document.createElement('br'));

                // Event listener for 'Accept' button
                accept.addEventListener('click', function() {
                    console.log('Accepting request:');
                    handleRequestAction('accept', item.sender_username); 
                    // handlenotif()
                });

                // Event listener for 'Reject' button
                reject.addEventListener('click', function() {
                    console.log('reject request:');
                    handleRequestAction('reject', item.sender_username);
                    // handlenotif();
                });
            });
        })
        .catch(error => {
            console.error('Error fetching friend requests:', error);
        });

    
});


function handleRequestAction(action, senderUsername) {
    console.log('Handling request:', action, senderUsername);
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
                    'sender': senderUsername // Use senderUsername parameter
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === true) {
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
export function handlenotif() {
    handleRequestsuggestion();
    handlechalleng();
    document.getElementById('content_notify').innerHTML = "";
    fetch("/api/get_requests/")
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch friend requests');
            }
            return response.json();
        })
        .then(data => {
            var requests = document.getElementById('content_notify');
            data.forEach(item => {
                let container = document.createElement('div');
                
                container.classList.add('bar_content');
                container.style.display = 'flex';
                container.style.alignItems = 'center';
                container.classList.add('bar_notify');

                let img = document.createElement('img');
                img.setAttribute("onclick", "view_profile()");
                img.src = item.photo_profile;
                img.style.width = "40px";
                img.style.height = "40px";
                img.style.borderRadius = "50%";
                img.style.border = "2px solid black";

                let username = document.createElement('p');
                username.textContent = item.sender_username;

                let accept = document.createElement('button');
                accept.textContent = "Accept";
                accept.id = item.id; // Assuming item.id uniquely identifies the request

                let reject = document.createElement('button');
                reject.textContent = "Reject";
                reject.id = item.id; // Assuming item.id uniquely identifies the request
                reject.style.background = "red";

                container.appendChild(img);
                container.appendChild(username);
                container.appendChild(accept);
                container.appendChild(reject);
                requests.appendChild(container);
                requests.appendChild(document.createElement('br'));

                // Event listener for 'Accept' button
                accept.addEventListener('click', function() {
                    handleRequestAction('accept', item.sender_username); // Pass item.username
                });

                // // Event listener for 'Reject' button
                reject.addEventListener('click', function() {
                    handleRequestAction('reject', item.sender_username);
                });
            });
        })
        .catch(error => {
            console.error('Error fetching friend requests:', error);
        });
}
