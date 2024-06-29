
document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/friends/')
        .then(response => response.json())
        .then(friends => {
            const friendsList = document.getElementById('list_friends');
            for (let i = 0; i < friends.length; i++) {
                let container = document.createElement('div');
                container.style.display = 'flex'; 
                container.style.alignItems = 'center'; 

                let img = document.createElement('img');
                img.src = friends[i].photo_profile;
                img.style.width = "40px";
                img.style.height = "40px";
                img.style.borderRadius = "50%";
                img.style.border = "2px solid black";
                
                let username = document.createElement('p');
                username.textContent = friends[i].username
                username.style.color = "cyan";
                username.style.fontWeight = "bold";
                username.style.fontSize = "20px";
                username.style.marginLeft = "10px"; 
        
                let space = document.createElement('div');
                space.style.width = "10px";
          
                container.appendChild(space);
                container.appendChild(img);
                container.appendChild(username);
                friendsList.appendChild(container);
                friendsList.appendChild(document.createElement('br'));
            };
        }
        )
        .catch(error => console.error('Error fetching friends:', error));
}  );

