document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/online/')
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
                container.style.display = 'flex';
                container.style.alignItems = 'center';

                let img = document.createElement('img');
                img.src = data[i].photo_profile;
                img.style.width = "40px";
                img.style.height = "40px";
                img.style.borderRadius = "50%";
                img.style.border = "3px solid green";

                let username = document.createElement('p');
                username.textContent = data[i].username;

                let addfriend = document.createElement('button');
                addfriend.textContent = "Challenge";
                addfriend.id = data[i].username;

                container.appendChild(img);
                container.appendChild(username);

                container.appendChild(addfriend);
                reward.appendChild(container);
                reward.appendChild(document.createElement('br'));
            }
        })

});