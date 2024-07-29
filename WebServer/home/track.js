
fetch('/api/token/')
    .then(response => response.json())
    .then(data => {
        token = data.token;
        id = data.id;
        const socket = new WebSocket(`wss://${window.location.host}/wss/track/?token=${token}&id=${id}`);
        socket.onopen = () => {
            // console.log('WebSocket connected');
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
            console.log(data);
            if (data.type === 'friend_request_send') {
                
            }
            else if (data.type === 'friend_request_reject') {
                
            }
            else if (data.type === 'friend_request_accept') {
                 
            }
            else if (data.type === 'friend_request_suggest') {
                
            }
            else if (data.type === 'friend is online' || data.type === 'friend is offline') {                
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
        
