
document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/csrf-token/')
    .then(response => response.json())
    .then(data => {
        let token = data.csrfToken;
        fetch('/api/friend/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': token,
            },
            body: JSON.stringify({
                'username': 'afadlane',
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // console.log(data);
            var friendProfile = document.getElementById('card-container');
            img = document.createElement('img');
            img.src = data.photo_profile;
            img.className = 'round';
            img.style.width = '100px';
            img.style.height = '100px';
            img.style.border = '2px solid black';
            var username = document.getElementById('username-card');
            email = document.getElementById('email-card');
            email.textContent = data.email;
            fullname = document.getElementById('name-card');
            fullname.textContent = data.first_name + ' ' + data.last_name;
            username.textContent = data.username;
            ranking = document.getElementById('rank-card');
            ranking.textContent =  "Rannking : " + data.ranking;
            date_joined = document.getElementById('date-joined-card');
            date_joined.textContent = "Date joined : " + data.date_joined.split('T')[0] + ' ' + data.date_joined.split('T')[1].split('.')[0];
            score = document.getElementById('score-card');
            score.textContent = "Score : " + data.score;

            Total_card = document.getElementById('Total-match');
            Total_card.textContent = "Total : " + (data.win + data.lose);
            Win_card = document.getElementById('Win-match');
            Win_card.textContent = "Win : " + data.win;
            rate = document.getElementById('rate-match');
            if (data.win == 0)
                rate.textContent = "Rate : 0%";
            else
                rate.textContent = "Rate : " + Math.round((data.win / (data.win+data.lose)) * 100) + "%";
            Lose_card = document.getElementById('Lose-match');
            Lose_card.textContent = "Lose : " + data.lose;
            friendProfile.prepend(img);
        })})
});