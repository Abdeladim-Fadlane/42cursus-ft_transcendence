document.addEventListener('DOMContentLoaded', function() {
    
    // let currentRequestSize = 0;
    // function fetchRequests() {
    //     fetch("/api/leaderboard/")
    //         .then(response => {
    //             if (!response.ok) {
    //                 throw new Error('Failed to fetch friend requests');
    //             }
    //             return response.json();
    //         })
    //         .then(data => {
    //             if (data.length !== currentRequestSize) {
    //                 currentRequestSize = data.length;
    //                 // leaderboard(data);
    //                 fetchHistory();
    //             }
    //         })
    //         .catch(error => {
    //             console.error('Error fetching friend requests:', error);
    //         });
    // }

    
    fetchHistory();
    // setInterval(fetchRequests, 4000);
});

export function fetchHistory() {
    fetch('/api/history/')
        .then(response => {
            if (!response.ok) {
                console.error('Error:', response);
                return;
            }
            return response.json();
        })
        .then(data => {
            // console.log(data);
            var historyContainer = document.getElementById('data_history');
            if (historyContainer) {
                historyContainer.innerHTML = ''; // Clear previous content
                data.forEach(item => {
                    let container = document.createElement('div');

                    let content = document.createElement('div');
                    content.classList.add('content');

                    let date = document.createElement('p');
                    date.textContent = item.date.split('T')[0] + ' ' + item.date.split('T')[1].split('.')[0];
                    date.classList.add('date');
                    date.style.textAlign = 'center';
                    date.style.fontSize = '10px';
                    date.style.fontWeight = 'bold';
                    date.style.color = 'white';

                    let div1 = document.createElement('div');
                    div1.classList.add('player1');
                    let img = document.createElement('img');
                    let winner = document.createElement('p');
                    div1.appendChild(img);
                    div1.appendChild(winner);

                    let div2 = document.createElement('div');
                    div2.classList.add('player2');
                    let img2 = document.createElement('img');
                    let loser = document.createElement('p');
                    div2.appendChild(img2);
                    div2.appendChild(loser);

                    let div3 = document.createElement('div');
                    div3.classList.add('result');
                    let text = document.createElement('p');
                    div3.appendChild(text);

                    content.appendChild(div1);
                    content.appendChild(div3);
                    content.appendChild(div2);

                    winner.textContent = item.winner.username;
                    loser.textContent = item.loser.username;

                    text.innerHTML = item.score1 + ' - ' + item.score2;
                    img.src = item.winner.photo_profile;
                    img2.src = item.loser.photo_profile;

                    container.appendChild(content);
                    container.appendChild(date);
                    historyContainer.appendChild(container);
                });
            } else {
                console.error('Element with ID "data_history" not found.');
            }
        })
        .catch(error => {
            console.error('Error fetching history:', error);
        });
}
