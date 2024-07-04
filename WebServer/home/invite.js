document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/suggest/')
        .then(response => {
            if (!response.ok) {
                window.location.href = "/";
            }
            return response.json();
        })
        .then(data => {
            var reward = document.getElementById('list_friend');
            for (let i = 0; i < data.length; i++) {

                let container = document.createElement('div');
                container.style.display = 'flex';
                container.style.alignItems = 'center';

                let img = document.createElement('img');
                img.src = data[i].photo_profile;
                img.style.width = "40px";
                img.style.height = "40px";
                img.style.borderRadius = "50%";
                img.style.border = "2px solid black";

                let username = document.createElement('p');
                username.textContent = data[i].username;

                let addfriend = document.createElement('button');
                addfriend.textContent = "Add Friend";
                
                addfriend.id = data[i].username;
                container.appendChild(img);
                container.appendChild(username);

                container.appendChild(addfriend);
                reward.appendChild(container);
          
                reward.appendChild(document.createElement('br'));
                addfriend.addEventListener('click', function() {
                    handleRequestAction(data[i].username);
                });
            }
            
        })
        function handleRequestAction(senderUsername) {
            fetch('/api/csrf-token/')
            .then(response => response.json())
            .then(data => {
                let token = data.csrfToken;
                fetch('/api/send_request/', {
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
                        window.location.reload();
                    }
                })
            })
        }
});