import { fetchSuggestions } from './invite.js';
import { fetchdelette } from './suggest.js';
import { fetchAndUpdateFriends } from './msgfriend.js';
import { handlechalleng } from './challenge.js';

export {func_add_friend , to_chat ,remove_friend}

let button_friend = document.querySelector('.profile-user-action-add_friend');
let button_unfriend = document.querySelector('.profile-user-action-unfriend');
let button_chat = document.querySelector('.profile-user-action-go_to_chat');
let parent = document.querySelector('.profile-user-action');
let message = document.querySelector('.profile-user-action-message');

function to_chat(e)
{
    let username = e.target.id;

    let close_btn = document.querySelector('.close_profile');
    close_btn.click()
    let chat_aside = document.querySelector('.chat-aside');
    chat_aside.click()
    let friends = document.querySelectorAll('.friend-list-room');
    for (let j = 0; j < friends.length; j++)
        if (friends[j].id == username)
            friends[j].click();
}
function CreateDiv(element_name, class_name)
{
    let element = document.createElement(element_name);
    element.classList.add(class_name)
    return element;
}



function Animation_elemeny(element, w, h)
{

    let text = element.textContent;
    element.textContent = '';

    let parent = CreateDiv('div', 'animation')
    parent.style.width = `${w}px`
    parent.style.height=  `${h}px`
    parent.append(
        CreateDiv('div', 'one'),
        CreateDiv('div', 'two'),
        CreateDiv('div', 'three')
    )
    element.append(parent);
}


function func_add_friend(e)
{
    let text = e.target.textContent;

    fetch('/api/csrf-token/')
    .then(response => response.json())
    .then(data => {
        let token = data.csrfToken;
        fetch('/api/send_request/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': token,
            },
            body: JSON.stringify({
                'receiver': e.target.id,
            })
        })
        .then(response => {return response.json()})
        .then(data => {
            if (data.status === true)
            {
                parent.style.display = 'none';
                button_unfriend.style.display = 'none';
                button_friend.style.display = 'none';
                button_chat.style.display = 'none';
                button_chat.style.transition = '1s ease-out'
                e.target.textContent = text;
                fetchSuggestions();

            }
        })
    })
    .catch(error => {
        console.log('Error sending friend request:', error);
    });
}



function remove_friend(e)
{
    let text = e.target.textContent;
 
    fetch('/api/csrf-token/')
    .then(response => {return response.json()})
    .then(data => {
        let token = data.csrfToken;
        fetch('/api/delete_friend/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': token,
            },
            body: JSON.stringify({
                'receiver': e.target.id,
            })
        })
        .then(response => {return response.json()})
        .then(data => {
            // console.log(data.error);
            if (data.status === true)
            {
                
                parent.style.display = 'flex';
                button_unfriend.style.display = 'none';
                button_chat.style.display = 'none';
                message.style.display = 'flex';
                
                button_friend.style.display = 'flex';
                button_friend.id = e.target.id;
                e.target.textContent = text; 
                fetchdelette();
                fetchSuggestions();
                fetchAndUpdateFriends();
                handlechalleng();
            }
        });
    });
    
}
let statis_div = document.querySelector('.profile-user-statistique');
let match_div = document.querySelector('.profile-user-history-match');
let button_statis = document.querySelector('.statistique-header');
let button_match = document.querySelector('.history-header');
button_match.addEventListener('click', (e)=>{
    let div_style = window.getComputedStyle(match_div);
    if (div_style.display == 'none')
    {
        button_statis.style.border = 'none';
        e.currentTarget.style.borderBottom = '2px solid white';
        match_div.style.display = 'flex';
        statis_div.style.display = 'none';
    }
})
button_statis.addEventListener('click', (e)=>{
    let div_style = window.getComputedStyle(statis_div)
    if (div_style.display == 'none')
    {
        button_match.style.border = 'none';
        e.currentTarget.style.borderBottom = '2px solid white';
        statis_div.style.display = 'flex';
        match_div.style.display = 'none';
    }
})