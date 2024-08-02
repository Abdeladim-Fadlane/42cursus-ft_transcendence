import { handlenotif } from './notif.js';
import { fetchdelette } from './suggest.js';
import { fetchSuggestions } from './invite.js';
import { fetchHistory } from './match.js';
import { handlechalleng } from './challenge.js';
import { leaderboard_requests } from './leader.js';
import { fetchAndUpdateFriends } from './msgfriend.js';
import { fetchConversation, fetchAllMessage} from './chatScript.js';


import { ProfileUsername , ProfileUser_id, button_profile, ProfileStutus} from './userInformation.js';
let user_id = document.querySelector('#login');
let user_name = document.querySelector('#login');
let Profile_module = window.getComputedStyle(document.querySelector('#content-user'))
fetch('/api/token/')
    .then(response => response.json())
    .then(data => {
       let token = data.token;
        let id = data.id;
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
        socket.onmessage = (event) => {
            
            const data = JSON.parse(event.data);
            // console.log('------------');
            // console.log(data.message);
            // console.log('------------');
            // console.log('user_name -------> ' + ProfileUsername)
            if (data.message === "friend send message"){
                
                fetchConversation(user_id.className, user_name.textContent)
                fetchAllMessage(user_id.className, user_name.textContent)
                
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
                handlechalleng();
                console.log('online friends====>' );
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
                // data();
                
            }
            else if (data.message === 'update_leaderboard') {
                leaderboard_requests();

            }
            else if (data.message === 'update_match_history') {
                fetchHistory();
            }
            else if (data.message === 'friend_delete') {
                fetchdelette();
                fetchSuggestions();
                fetchAndUpdateFriends();
                handlechalleng();
                if (Profile_module.display == 'flex')
                    button_profile(ProfileUsername, ProfileUser_id);
            }
        }
});


       
