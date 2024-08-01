import { handlenotif } from './notif.js';
import { fetchdelette } from './suggest.js';
import { fetchSuggestions } from './invite.js';
import { fetchHistory } from './match.js';
import { handlechalleng } from './challenge.js';
import { leaderboard_requests } from './leader.js';
import { fetchAndUpdateFriends } from './msgfriend.js';
import { fetchConversation, fetchAllMessage} from './chatScript.js';
let user_id = document.querySelector('#login');
let user_name = document.querySelector('#login');
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
            if (data.message === "friend send message"){
                console.log('-----------------------')
                fetchConversation(user_id.className, user_name.textContent)
                // console.log('user id=============> ' )
                // console.log()
                console.log('-----------------------')
                // fetchAllMessage(user_id, user_name)
                
            }
            else if (data.message === 'friend_request_send') {
                handlenotif();
                
            }
            else if (data.message === 'friend_request_reject') {
                fetchSuggestions();
            }
            else if (data.message === 'friend_request_accept') {
                fetchdelette();
                fetchAndUpdateFriends();
                handlechalleng();
                
            }
            else if (data.message === 'friend_request_suggest') {

                fetchSuggestions();
                leaderboard_requests();
            }
            else if (data.message === 'friend is online' || data.message === 'friend is offline') { // console.log("************************");
                // console.log(data)
                // console.log("************************");
                handlechalleng();
                
                console.log('online friends====>');
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
            }
            else if (data.message === 'friend_delete') {
                    fetchdelette();
                    fetchSuggestions();
                    fetchAndUpdateFriends();
                    handlechalleng();
            }
        }
});


function delete_account() {
    fetch('/api/delete_account/')
    .then(response => response.json())
    .then(data => {
        window.location.href = '/';
        // console.log('Account deleted');
    })
    .catch(error => {
        console.error('Error deleting account:', error);
    });
};
        
