// import { handlenotif } from './notif.js';

// Use the imported function
// handlenotif();
export function handlechalleng()
{
    document.getElementById('challenge_friend').innerHTML = '';
    fetch('/api/friends/')
        .then(response => {
            if (!response.ok) {
                window.location.href = "/";
            }
            return response.json();
        })
        .then(data => {
            var reward = document.getElementById('challenge_friend');
            for (let i = 0; i < data.length; i++) {

                let container = document.createElement('div');
                container.classList.add('bar_content');
                container.style.display = 'flex';
                container.style.alignItems = 'center';

                let img = document.createElement('img');
                img.setAttribute("onclick", "view_profile()");
                img.src = data[i].photo_profile;
                img.style.width = "40px";
                img.style.height = "40px";
                img.style.borderRadius = "50%";
                img.style.border = "2px solid black";
                let div = document.createElement('div');
                div.style.width = "30%";
                

                let username = document.createElement('p');
                username.textContent = data[i].username;
                div.appendChild(username);
                let addfriend = document.createElement('button');
                addfriend.textContent = "challenge friend";
                addfriend.id = data[i].username;

                container.appendChild(img);
                container.appendChild(div);

                container.appendChild(addfriend);
                reward.appendChild(container);
                reward.appendChild(document.createElement('br'));
            }
        })
}

document.addEventListener('DOMContentLoaded', function() {
    handlechalleng();
});