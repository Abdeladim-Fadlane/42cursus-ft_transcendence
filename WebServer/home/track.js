
fetch('https://ping-pong.com/api/token/')
    .then(response => response.json())
    .then(data => {
        token = data.token;
        id = data.id;
        const socket = new WebSocket(`wss://ping-pong.com/wss/track/?token=${token}&id=${id}`);
        socket.onopen = () => {
            console.log('WebSocket connected');
        };
        socket.onclose = () => {
            console.log('WebSocket closed');
        };

        socket.onerror = (error) => {
            console.error('WebSocket error: ', error);
        };
    })
.catch(error => {
    console.error('Error fetching token:', error);
});