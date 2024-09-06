
import { fetchSuggestions } from './invite.js';
import { fetchAndUpdateFriends } from './msgfriend.js';
import { handlechalleng } from './challenge.js';
import { view_profile } from './userInformation.js';



// document.addEventListener('DOMContentLoaded', function() {
//     handleRequestsuggestion();
//     // setInterval(fetchdelette, 2000);
// });
handleRequestsuggestion();
let current = 0;
export function fetchdelette() {
    fetch('/api/friends/')
        .then(response => {
            if (!response.ok) {
                // document.getElementById('list_friend').style.display = 'none';
                
                return;
            }
            return response.json();
        })
        .then(data => {
                handleRequestsuggestion();
                // fetchAndUpdateFriends();
            // }
        })
        .catch(error => {
            console.error('Error fetching suggestions:', error);
        });
}

function handleRequestAction(senderUsername) {
    fetch('/api/csrf-token/')
    .then(response => response.json())
    .then(data => {
        let token = data.csrfToken;
        fetch('/api/delete_friend/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': token,
            },
            body: JSON.stringify({
                'receiver': senderUsername,
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === true) {
                
               handleRequestsuggestion();
               fetchSuggestions();
                fetchAndUpdateFriends();
                handlechalleng();
            }
        });
    });
}
 export function handleRequestsuggestion(){
    // handlenotif();
    
    fetch('/api/friends/')
    .then(response => {
        if (!response.ok) {
            window.location.href = "/";
        }
        return response.json();
    })
    .then(data => {
        document.getElementById('Friends').innerHTML = "";
        var reward = document.getElementById('Friends');
        if (data.length === 0) {
            let container = document.createElement('div');
            container.classList.add('not-found');
            // let im = document.createElement('img');
            // im.src = "./resrc/no_fr.png";
            let p = document.createElement('h2');
            p.textContent = "you don't have any friend";
            // container.appendChild(im);
            container.appendChild(p);
            reward.appendChild(container);
            return;
        }
        for (let i = 0; i < data.length; i++) {

            let container = document.createElement('div');
            container.classList.add('bar_content');
            

            let img = document.createElement('img');
            img.addEventListener('click', view_profile);
            img.id = data[i].username;
            img.src = data[i].photo_profile;
            img.style.width = "40px";
            img.style.height = "40px";
            img.style.borderRadius = "50%";
            img.style.border = "2px solid black";

            let username = document.createElement('p');
            username.textContent = data[i].username;

        
            let addfriend = document.createElement('button');
            addfriend.textContent = "Unfriend";

            addfriend.id = data[i].username;

            container.appendChild(img);
            container.appendChild(username);

            container.appendChild(addfriend);
            reward.appendChild(container);
            reward.appendChild(document.createElement('br'));
            addfriend.addEventListener('click', function() {
                handleRequestAction(data[i].username);
                
                // console.log('lllllll');

            });
        }
    })
            
}





