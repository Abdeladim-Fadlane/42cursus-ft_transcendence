import { create_chatRoom , setLastButton} from "./chatScript.js";

let map = new Map();
let previousDataSize = 0;
function cleaning_chat(){
    setLastButton();
    document.querySelector('.image-chat').textContent = ''
    document.querySelector('.chat-messages').style.display = 'none';
    document.querySelector('.chat-input').style.display = 'none';
    if (document.querySelector('.chat-option-user') != null)
        document.querySelector('.chat-header').removeChild(document.querySelector('.chat-option-user'))
    if (document.querySelector('.header-chat-photouser') != null)
        document.querySelector('.header-chat-photouser').style.display = 'none'
    if (document.querySelector('.user-info-menu') != null)
    {
        console.log(document.querySelector('.chat-container'))
        document.querySelector('.chat-container').removeChild(document.querySelector('.user-info-menu'),
        document.querySelector('.chat-option-user'))
    }
    document.querySelector('#chat-friend-name').innerHTML = '<span class="span">Select</span> a friend to <span class="span">chat</span>';
    document.querySelector('#chat-friend-name').style.fontSize = '25px'
    document.querySelector('.chat-header').style.border = 'none';
    // document.getElementById("chat").style.display = 'none';
}
export {cleaning_chat}
let buttons = document.querySelector('.aside_content')
buttons = buttons.querySelector('ul').querySelectorAll('li');
buttons.forEach(element => {
    // console.log(element);
    element.querySelector('a').addEventListener('click' , cleaning_chat);
});
document.addEventListener('DOMContentLoaded', function() {
    
    fetchAndUpdateFriends();
});
export function fetchOnlineFriendInChat(){
    fetch('/api/online/')
    .then(response=>{
        return response.json()
    })
    .then(data =>{
        let friends = document.querySelector('#list_friend_chat').querySelectorAll('button');
        friends.forEach(element=>{
            if (data.find(d => d.username == element.querySelector('.chat-friend-username').textContent) == undefined)
            {
                element.querySelector('.chat-friend-status').style.backgroundColor = 'red'
            }
            else
            {
                element.querySelector('.chat-friend-status').style.backgroundColor = 'green'
            }
        })
      
    })
}
export function fetchAndUpdateFriends() {
    let log = [];
    console.log(typeof(log))
    fetch('/api/friends/')
        .then(response => {
            if (!response.ok) {
                window.location.href = "/";
            }
            return response.json();
        })
        .then(data => {
            let chat_msg = document.querySelector('.chat-friend-name');
            let ishere =  false;
            if (data.length !== previousDataSize) {
                previousDataSize = data.length;
                var reward = document.getElementById('list_friend_chat');
                reward.innerHTML = ""; 

                for (let i = 0; i < data.length; i++) {
                    if (chat_msg != undefined && chat_msg == data[i].username)
                        ishere = true;
                    let container = document.createElement('button');
                    let img = document.createElement('img');
                    let count = document.createElement('p');
                    count.style.display = 'none'
                    count.classList.add('user-count-message')
                    img.src = data[i].photo_profile;
                    img.style.width = "40px";
                    img.style.height = "40px";
                    img.style.borderRadius = "50%";
                    img.style.border = "2px solid black";

                    let username = document.createElement('p');
                    let status = document.createElement('span')
                    status.classList.add('chat-friend-status');
                    container.append(status);
                    username.classList.add('chat-friend-username')
                    username.textContent = data[i].username;
                    username.style.marginLeft = "15px";
                    container.id = data[i].id_user;
                    container.style.cssText = `
                        display: flex;
                        align-items: center;
                        width: 100%;   
                    `;
                    container.appendChild(img);
                    container.appendChild(username);
                    container.appendChild(count);
                
                    container.classList.add("friend-list-room");
                    reward.appendChild(container);
                    map.set(data[i].username, "block");
                    fetchOnlineFriendInChat()

                }
                if (!ishere)
                cleaning_chat();
                create_chatRoom(map);
            }
        })
        .catch(error => {
            console.error('Error fetching friends:', error);
        });
}
