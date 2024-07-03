

document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/friends/')
        .then(response => {
            if (!response.ok) {
                window.location.href = "/";
            }
            return response.json();
        })
        .then(data => {
            // console.log(data);
            var reward = document.getElementById('Friends');
            for (let i = 0; i < data.length; i++) {

                let container = document.createElement('div');
                container.style.display = 'flex';
                container.style.alignItems = 'center';
                container.style.backgroundColor = "white";

                let img = document.createElement('img');
                img.src = data[i].photo_profile;
                img.style.width = "40px";
                img.style.height = "40px";
                img.style.borderRadius = "50%";
                img.style.border = "2px solid black";

                let username = document.createElement('p');
                username.textContent = data[i].username;

            
                let addfriend = document.createElement('button');
                addfriend.textContent = "delete friend";

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
                        window.location.reload();
                    }
                });
            });
        }
});
