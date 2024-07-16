import { handlenotif } from './notif.js';

document.addEventListener('DOMContentLoaded', function() {
    fetchSuggestions();
    setInterval(fetchSuggestions, 30000);
});

let currentData = [];

function fetchSuggestions() {
    fetch('/api/suggest/')
        .then(response => {
            if (!response.ok) {
                document.getElementById('list_friend').style.display = 'none';
                console.log("Failed to fetch suggestions");
                return;
            }
            return response.json();
        })
        .then(data => {
            if (JSON.stringify(data) !== JSON.stringify(currentData)) {
                currentData = data;
                handlenotif();
                updateSuggestions(data);
            }
        })
        .catch(error => {
            console.error('Error fetching suggestions:', error);
        });
}

function updateSuggestions(data) {
    var reward = document.getElementById('list_friend');
    reward.innerHTML = ''; // Clear previous suggestions

    data.forEach(item => {
        console.log(item);
        let container = document.createElement('div');
        container.classList.add('bar_content');
        container.style.display = 'flex';
        container.style.alignItems = 'center';

        let img = document.createElement('img');
        img.setAttribute("onclick", "view_profile()");
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
            handleRequestAction(item.username);
        });
    });
}

function handleRequestAction(senderUsername) {
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
                    'receiver': senderUsername,
                })
            });
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === true) {
                document.getElementById('list_friend').innerHTML = '';
                fetchSuggestions();
            }
        })
        .catch(error => {
            console.error('Error sending friend request:', error);
        });
}
