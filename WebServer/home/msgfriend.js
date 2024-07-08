import { create_chatRoom } from "./chatScript.js";

let map = new Map();
document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/friends/')
    .then(response => {
        if (!response.ok) {
            window.location.href = "/";
            }
            return response.json();
            })
        .then(data => {
            var reward = document.getElementById('list_friend_chat');
            for (let i = 0; i < data.length; i++) {
                
                let container = document.createElement('button');
                let img = document.createElement('img');
                img.src = data[i].photo_profile;
                img.style.width = "40px";
                img.style.height = "40px";
                img.style.borderRadius = "50%";
                img.style.border = "2px solid black";
                
                
                let username = document.createElement('p');
                username.textContent = data[i].username;
                username.style.marginLeft = "15px";
                container.id = data[i].username;
                container.style.cssText = `
                    display : flex;
                    align-items : center;
                    width : 100%;
                    background-color : gray;
                `
                container.addEventListener('mouseover', () => {
                    container.style.backgroundColor = 'lightblue';  
                    container.style.fontWeight = 'bold';   
                 });
                  
                container.addEventListener('mouseout', () => {
                    container.style.backgroundColor = 'gray';
                    container.style.fontWeight = 'normal';  
                    
                    
                });
                container.appendChild(img);
                container.appendChild(username);
                container.classList.add("friend-list-room")
                reward.appendChild(container);
                reward.appendChild(document.createElement('br'));
                map.set(data[i].username, "block");
            
                }
                create_chatRoom(map)  
        })

});






