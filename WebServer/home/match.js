
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
            // console.log(data);
            var historyContainer = this.getElementById('history');
            for (let i = 0; i < data.length; i++) {
                if (i == 5)
                    break;
                let container = document.createElement('div');
                container.style.display = 'flex';
                container.style.alignItems = 'center';

                let img = document.createElement('img');
                let winner = document.createElement('p');
                let loser = document.createElement('p');
                let img2 = document.createElement('img');
                let space1 = document.createElement('div');
                let space2 = document.createElement('div');
                let text = document.createElement('p');

                img.style.width = '40px';
                img.style.height = '40px';
                img.style.borderRadius = '50%';
                img.style.border = '2px solid black';
                img.style.marginRight = '10px';

                img2.style.width = '40px';
                img2.style.height = '40px';
                img2.style.borderRadius = '50%';
                img2.style.border = '2px solid black';
                img2.style.marginRight = '10px';
                
                space1.style.width = '30px';
                space2.style.width = '50px';
                text.style.fontSize = '20px';
                text.style.fontWeight = 'bold';
                text.style.marginRight = '10px';
                text.style.marginLeft = '10px';
                text.style.color = 'cyan'

                let namecontainer = document.createElement('div');
                namecontainer.style.display = 'flex';
                namecontainer.style.alignItems = 'center';
                winner.textContent = data[i]['winner'].username;
                winner.style.color = 'balck';
                winner.style.fontWeight = 'bold';
                winner.style.fontSize = '20px';
                winner.style.marginLeft = '10px';
                loser.textContent = data[i]['loser'].username;
                loser.style.color = 'balck';
                loser.style.fontWeight = 'bold';
                loser.style.fontSize = '20px';
                loser.style.marginLeft = '10px';


                namecontainer.appendChild(winner);
                namecontainer.appendChild(space2);
                namecontainer.appendChild(loser);

                text.innerHTML = data[i].score1 + ' - ' + data[i].score2;
                img.src = data[i]['winner'].photo_profile;
                img2.src = data[i]['loser'].photo_profile;
                
                container.appendChild(space1);
                container.appendChild(img);
                container.appendChild(text);
                container.appendChild(img2);
                historyContainer.appendChild(container);
                historyContainer.appendChild(namecontainer);
                historyContainer.appendChild(document.createElement('br'));
            }
        });
});