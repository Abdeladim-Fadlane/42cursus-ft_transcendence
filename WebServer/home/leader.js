
document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/leaderboard/')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            var mydiv = document.getElementById("leadrboard");
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
                let score = document.createElement('p');
                score.textContent = data[i].score + "PS";
                score.style.color = "black";
                score.style.fontWeight = "bold";
                score.style.fontSize = "20px";
                score.style.marginLeft = "10px";

                username.textContent = data[i].username
                username.style.color = "cyan";
                username.style.fontWeight = "bold";
                username.style.fontSize = "20px";
                username.style.marginLeft = "10px"; 
            
               
                let space = document.createElement('div');
                space.style.width = "10px";
          
                container.appendChild(space);
                container.appendChild(img);
                container.appendChild(username);
                container.appendChild(score);
                
                mydiv.appendChild(container);
                mydiv.appendChild(document.createElement('br'));
            }
            
        })
        .catch(error => console.error('Error fetching leaderboard:', error));
}  );