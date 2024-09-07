import { handlenotif } from './notif.js';
import { fetchdelette } from './suggest.js';
import { fetchSuggestions } from './invite.js';
import { fetchHistory } from './match.js';
import { handlechalleng } from './challenge.js';
import { leaderboard_requests } from './leader.js';
import { fetchAndUpdateFriends , fetchOnlineFriendInChat} from './msgfriend.js';
import { fetchConversation, fetchAllMessage} from './chatScript.js';
import { my_data } from './data.js';


import { ProfileUsername , ProfileUser_id, button_profile, ProfileStutus} from './userInformation.js';
let user_id = document.querySelector('#login');
let user_name = document.querySelector('#login');
let Profile_module = window.getComputedStyle(document.querySelector('#content-user'))

let area = document.querySelector('.carte-message');

function show_message(content, username){
    
    const now = new Date();
    fetch('/api/csrf-token/')
    .then(response =>{
        return response.json();
    })
    .then(data =>{
        fetch('/api/friend/', {
            method: 'POST',
            headers : {
                'Content-Type': 'application/json',
                'X-CSRFToken': data.csrfToken,
            },
            body :JSON.stringify({
                'username' : username,
            })
        })
        .then(response =>{
            return response.json();
        })
        .then(data=>{
            area.id = data.id;
            area.querySelector('.carte-user-profile').querySelector('img').src = data.photo_profile;
        })
    })
    area.querySelector('.carte-sender-name').textContent = username;
    if (content.length >= 145)
        area.querySelector('.carte-message-content').textContent = content.substring(0, 145) + ' ...';
    else
        area.querySelector('.carte-message-content').textContent = content;
    document.querySelector('.carte-date').textContent = `${now.toLocaleTimeString()}`;
    area.addEventListener('click', function click_area(e){
        area.style.display = 'none';
        let chat_aside = document.querySelector('.chat-aside');
        chat_aside.click();
        let friends = document.querySelectorAll('.friend-list-room');
        for (let j = 0; j < friends.length; j++)
            if (friends[j].id == area.id)
            {
                friends[j].click();
                area.removeEventListener('click', click_area);
                break ;
            }
    });
    area.style.display = 'flex';
    setTimeout(()=>{
        area.style.display = 'none';
    }, 5000)
}
fetch('/api/token/')
    .then(response => response.json())
    .then(data => {
       let token = data.token;
        let id = data.id;1
        const socket = new WebSocket(`wss://${window.location.host}/wss/track/?token=${token}&id=${id}`);
        socket.onopen = () => {
            console.log('WebSocket connected');
        };
        socket.onclose = () => {
            console.log('WebSocket closed');
        };
        
        socket.onerror = (error) => {
            console.error('WebSocket error: ', error);
        };
        socket.onmessage =  (event) => {
            
            const data = JSON.parse(event.data);
            console.log(data.message);
            if (typeof(data) == 'object' && data.message.message === "friend send message"){
                fetchConversation(user_id.className, user_name.textContent)
                fetchAllMessage(user_id.className, user_name.textContent);
            
                if (window.getComputedStyle(document.getElementById("chat")).display == 'none')
                    show_message(data.message.message_content, data.message.sender_name);
            }
            else if (data.message === 'friend_request_send') {
                handlenotif();
                if (Profile_module.display == 'flex')
                    button_profile(ProfileUsername, ProfileUser_id);
            }
            else if (data.message === 'friend_request_reject') {
                fetchSuggestions();
                if (Profile_module.display == 'flex')
                    button_profile(ProfileUsername, ProfileUser_id);

            }
            else if (data.message === 'friend_request_accept') {
                fetchdelette();
                fetchAndUpdateFriends();
                handlechalleng();
                if (Profile_module.display == 'flex')
                    button_profile(ProfileUsername, ProfileUser_id);
            }
            else if (data.message === 'friend_request_suggest') {

                fetchSuggestions();
                leaderboard_requests();
                if (Profile_module.display == 'flex')
                    button_profile(ProfileUsername, ProfileUser_id);
            }
            else if (data.message === 'friend is online' || data.message === 'friend is offline') {
                // console.log('online friends====>' );
                fetchOnlineFriendInChat();
                handlechalleng();
                if (Profile_module.display == 'flex')
                    ProfileStutus(ProfileUsername);
            }
            else if (data.message === 'profile_change') {
                handlenotif();
                fetchSuggestions();
                leaderboard_requests();
                handlechalleng();
                fetchHistory();
                fetchdelette();
                fetchAndUpdateFriends();
           
                
            }
            else if (data.message === 'update_leaderboard') {
                leaderboard_requests();

            }
            else if (data.message === 'update_match_history') {
                fetchHistory();
                my_data();
            }
            else if (data.message === 'friend_delete') {
                fetchConversation(user_id.className, user_name.textContent)
                fetchdelette();
                fetchSuggestions();
                fetchAndUpdateFriends();
                handlechalleng();
                if (Profile_module.display == 'flex')
                    button_profile(ProfileUsername, ProfileUser_id);
            }
            else if (data.message == 'user_deleted')
            {
                fetchAndUpdateFriends();
            }
        }
});


       
