let currentRequestSize = 0;
import { view_profile } from './userInformation.js';
leaderboard_requests(); 
document.addEventListener('DOMContentLoaded', function() {
    leaderboard_requests(); 
});


function leaderboard(data) {
    var mydiv = document.getElementById("rank_list");
    let one = document.getElementById("number-one");
    let two = document.getElementById("number-two");
    let three = document.getElementById("number-tree");
    mydiv.innerHTML = "";
    one.innerHTML = "";
    two.innerHTML = "";
    three.innerHTML = "";
    // document.getElementById("crown").style.display = "flex";
   for (let i = 0; i < 3 && i < data.length ; i++) {
        let container = document.createElement('div');
        let img = document.createElement('img');
        let username = document.createElement('p');
        let score = document.createElement('p');
        if (i == 0) {
            container.classList.add('one');
            img.addEventListener('click', view_profile);
            img.id = data[i].username;
            img.src = data[i].photo_profile;
            score.textContent = data[i].score + "PS";
            username.textContent = data[i].username;
            
            container.appendChild(img);
            container.appendChild(username);
            container.appendChild(score);
            one.appendChild(container);
        }
        else if (i == 1) {
            container.classList.add('two');
            img.addEventListener('click', view_profile);
            img.id = data[i].username;
            img.src = data[i].photo_profile;
            score.textContent = data[i].score + "PS";
            username.textContent = data[i].username;
            
            container.appendChild(img);
            container.appendChild(username);
            container.appendChild(score);
            two.appendChild(container);
           
        }
        else if (i == 2) {
            container.classList.add('three');
            img.addEventListener('click', view_profile);
            img.id = data[i].username;
            img.src = data[i].photo_profile;
            score.textContent = data[i].score + "PS";
            username.textContent = data[i].username;
            
            container.appendChild(img);
            container.appendChild(username);
            container.appendChild(score);
            three.appendChild(container);
        }
   }
    for (let i = 3; i < data.length; i++) {
        let container = document.createElement('div');
        container.classList.add('bar-content');
        let rk = document.createElement('p');
        // container.style.height = "100px";

        let img = document.createElement('img');
        // img.style.objectFit = "cover";
        img.addEventListener('click', view_profile);
        img.id = data[i].username;
        img.src = data[i].photo_profile;
        img.style.width = "80px";
        img.style.height = "80px";
        img.style.borderRadius = "50%";
        img.style.border = "2px solid black";

        let username = document.createElement('p');
        username.classList.add('nameuser');
        let score = document.createElement('p');
        score.style.width = "200px";
        score.textContent = data[i].score + "PS";

        username.textContent = data[i].username;

        let space = document.createElement('div');
        space.style.width = "10px";
        rk.textContent = i;
        rk.style.width = "100px";

        container.appendChild(space);
        container.appendChild(img);
        container.appendChild(username);
        container.appendChild(score);
        container.appendChild(rk);

        mydiv.appendChild(container);
        // mydiv.appendChild(document.createElement('br'));
    }
}

export function leaderboard_requests() {
    fetch("/api/leaderboard/")
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch friend requests');
            }
            return response.json();
        })
        .then(data => {
            
                leaderboard(data);
        
        })
        .catch(error => {
            console.error('Error fetching friend requests:', error);
        });
}