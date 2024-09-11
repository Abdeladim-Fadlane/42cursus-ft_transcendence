import { create_chatRoom , setLastButton} from "./chatScript.js";

let map = new Map();
let previousDataSize = 0;
function cleaning_chat(){
    setLastButton();
    document.querySelector('.image-chat').textContent = ''
    document.querySelector('.chat-messages').style.display = 'none';
    document.querySelector('.chat-input').style.display = 'none';
    if (document.querySelector('.header-chat-status') != null)
        document.querySelector('.header-chat-status').remove();
    if (document.querySelector('.chat-option-user') != null)
        document.querySelector('.chat-option-user').remove();
    if (document.querySelector('.header-chat-photouser') != null)
        document.querySelector('.header-chat-photouser').style.display = 'none'
    if (document.querySelector('.user-info-menu') != null)
    {
        console.log(document.querySelector('.chat-container'))
        document.querySelector('.chat-container').removeChild(document.querySelector('.user-info-menu'),
        document.querySelector('.chat-option-user'))
    }
    document.querySelector('.empty-chat-body').style.display = 'flex';
    document.querySelector('#chat-friend-name').textContent = '';
    document.querySelector('#chat-friend-name').style.fontSize = '25px'
    document.querySelector('.chat-header').style.border = 'none';
}
export {cleaning_chat}
let buttons = document.querySelector('.aside_content');

if (buttons) {
    let listItems = buttons.querySelector('ul');
    if (listItems) {
        let items = listItems.querySelectorAll('li');
        items.forEach(element => {
            let link = element.querySelector('a');
            let dataTarget = link.getAttribute('data-target');
            if (link && dataTarget !== 'notification' && dataTarget !== 'logout') {
                link.addEventListener('click', cleaning_chat);
            }
        });
    } 
} 
fetchAndUpdateFriends();
let userFind = document.querySelector('.image-chat')
let name = document.querySelector('#chat-friend-name')
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
                if (userFind.innerHTML.length != 0 && element.querySelector('.chat-friend-username').textContent == name.textContent)
                    document.querySelector('.header-chat-status').textContent = 'offline';
                element.querySelector('.chat-friend-status').style.backgroundColor = 'red'
            }
            else
            {
                if (userFind.innerHTML.length != 0 && element.querySelector('.chat-friend-username').textContent == name.textContent)
                    document.querySelector('.header-chat-status').textContent = 'online';
                element.querySelector('.chat-friend-status').style.backgroundColor = 'green'
            }
        })
      
    })
}
export function fetchAndUpdateFriends() {
    // console.log('is here Frined list')
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
            // if (data.length !== previousDataSize) {
                previousDataSize = data.length;
                var reward = document.getElementById('list_friend_chat');
                reward.innerHTML = ""; 
                if (data.length === 0) {
                    // console.log('is here when you find 0 friend');
                    let container = document.createElement('div');
                    container.classList.add('not-found');
                    let p = document.createElement('h2');
                    p.textContent = "No friend to chat";
                    container.appendChild(p);
                    reward.appendChild(container);
                    cleaning_chat();
                    return;
                }
                for (let i = 0; i < data.length; i++) {
                    if (chat_msg && chat_msg != undefined && chat_msg == data[i].username)
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
                    map.set(data[i].id, "block");
                    
                }
                // console.log('is here afadalane')
                if (!ishere)
                    cleaning_chat();
                create_chatRoom(map);
                fetchOnlineFriendInChat()
        })
        .catch(error => {
            console.error('Error fetching friends:', error);
        });
        // console.log('doooone');
}
