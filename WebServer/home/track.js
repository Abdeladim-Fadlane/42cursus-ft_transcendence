
fetch('/api/token/')
    .then(response => response.json())
    .then(data => {
        token = data.token;
        id = data.id;
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
            /* here use switch case or of army of if conditions */
            const data = JSON.parse(event.data);
            console.log('------------');
            console.log(data.message);
            console.log('------------');

            if (data.message === 'friend_request_send') {

            }
            else if (data.message === 'friend_request_reject') {
                
            }
            else if (data.message === 'friend_request_accept') {
                // fetchAndUpdateFriends();

            }
            else if (data.message === 'friend_request_suggest') {
                
            }
            else if (data.message === 'friend is online' || data.message === 'friend is offline') {   
                // handlechalleng();
                console.log('online friends====>');
            }
            else if (data.message === 'profile_change') {
                
            }
            else if (data.message === 'update_leaderboard') {
            }
            else if (data.message === 'update_match_history') {
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
        
