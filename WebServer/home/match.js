
document.addEventListener('DOMContentLoaded', function() 
{
    fetch('/api/history/')
        .then(response => {
            if (!response.ok) {
                console.error('Error:', response);
            }
            return response.json();   
        })
        .then(data => {
            console.log(data);
            var historyContainer = this.getElementById('data_history');
            for (let i = 0; i < data.length; i++) {
  
                let container = document.createElement('div');

                let content = document.createElement('div');
                content.classList.add('content');

                let date = document.createElement('p');
                date.textContent = data[i].date.split('T')[0] + ' ' + data[i].date.split('T')[1].split('.')[0];
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
                let loser = document.createElement('p');
                let img2 = document.createElement('img');
                div2.appendChild(img2);
                div2.appendChild(loser);

                let div3 = document.createElement('div');
                div3.classList.add('result');

                let text = document.createElement('p');
                div3.appendChild(text);

                content.appendChild(div1);
                content.appendChild(div3);
                content.appendChild(div2);


                winner.textContent = data[i]['winner'].username;
                loser.textContent = data[i]['loser'].username;
       
                text.innerHTML = data[i].score1 + ' - ' + data[i].score2;
                img.src = data[i]['winner'].photo_profile;
                img2.src = data[i]['loser'].photo_profile;
                
                container.appendChild(content);
                container.appendChild(date);
                historyContainer.appendChild(container);
                // historyContainer.appendChild(document.createElement('br'));
            }
        });
});