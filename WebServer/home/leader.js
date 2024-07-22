let currentRequestSize = 0;

document.addEventListener('DOMContentLoaded', function() {
    function leaderboard(data) {
        var mydiv = document.getElementById("leadrboard_container");
        mydiv.innerHTML = "";
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
            let score = document.createElement('p');
            score.textContent = data[i].score + "PS";

            username.textContent = data[i].username;

            let space = document.createElement('div');
            space.style.width = "10px";

            container.appendChild(space);
            container.appendChild(img);
            container.appendChild(username);
            container.appendChild(score);

            mydiv.appendChild(container);
            mydiv.appendChild(document.createElement('br'));
        }
    }

    function fetchRequests() {
        fetch("/api/leaderboard/")
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch friend requests');
                }
                return response.json();
            })
            .then(data => {
                if (data.length !== currentRequestSize) {
                    currentRequestSize = data.length;
                    leaderboard(data);
                }
            })
            .catch(error => {
                console.error('Error fetching friend requests:', error);
            });
    }

    // Initial call to fetch and display leaderboard
    fetchRequests();

    // Set interval to check for updates every 5 seconds
    setInterval(fetchRequests, 5000);
});
