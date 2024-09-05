// import { handlenotif } from './notif.js';
// import { handlechalleng } from './challenge.js';
import { view_profile } from './userInformation.js';



fetchSuggestions();


export function fetchSuggestions() {
    // console.log('invite.js loaded');
    fetch('/api/suggest/')
        .then(response => {
            if (!response.ok) {
                // document.getElementById('list_friend').style.display = 'none';
                console.log("Failed to fetch suggestions");
                return;
            }
            return response.json();
        })
        .then(data => {
            // if (data.length !== currentData) {
            //     currentData = data.length;
                // handlenotif();
                // if (data.length === 0)
                //     console.log('No friend suggestions');
                // else
                // console.log('friend suggestions');
                updateSuggestions(data);
            // }
        })
        .catch(error => {
            console.error('Error fetching suggestions:', error);
        });
}

function updateSuggestions(data) {
    var reward = document.getElementById('list_friend');
    reward.innerHTML = ''; // Clear previous suggestions
    // console.log(data);
   
    
    if (data.length === 0) {
        
        let container = document.createElement('div');
        container.classList.add('not-found');
        // let im = document.createElement('img');
        // im.src = "./resrc/not_friend_to_invit.png";
        let p = document.createElement('h2');
        p.textContent = "No friend suggestions";
        // container.appendChild(im);
        container.appendChild(p);
        reward.appendChild(container);
        return;
    }
    // else {
    //     container.di
        
    // }
    data.forEach(item => {
        // console.log(item);
        let container = document.createElement('div');
        container.classList.add('bar_content');
        // container.style.display = 'flex';
        // container.style.alignItems = 'center';

        let img = document.createElement('img');
        img.addEventListener('click', view_profile);
        img.id = item.username;
        img.src = item.photo_profile;
        img.style.width = "60px";
        img.style.height = "60px";
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
                // handlechalleng();
            }
        })
        .catch(error => {
            console.error('Error sending friend request:', error);
        });
}
