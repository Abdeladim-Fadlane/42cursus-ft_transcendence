

document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/suggest/')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch friend suggestions');
            }
            return response.json();
        })
        .then(data => {
            var reward = document.getElementById('achievements');
            data.forEach(item => {
                let container = document.createElement('div');
                container.style.display = 'flex';
                container.style.alignItems = 'center';
                container.style.marginBottom = '10px';

                let img = document.createElement('img');
                img.src = item.photo_profile;
                img.style.width = "40px";
                img.style.height = "40px";
                img.style.borderRadius = "50%";
                img.style.border = "2px solid black";

                let username = document.createElement('p');
                username.textContent = item.username;
                username.style.color = "black";
                username.style.fontWeight = "bold";
                username.style.fontSize = "15px";
                username.style.marginLeft = "10px";

                let addfriend = document.createElement('button');
                addfriend.textContent = "Add Friend";
                addfriend.id = item.username;
                addfriend.style.color = "cyan";
                addfriend.style.fontWeight = "bold";
                addfriend.style.fontSize = "10px";
                addfriend.style.marginLeft = "10px";
                addfriend.style.backgroundColor = "black";
                addfriend.style.border = "2px solid white";
                addfriend.style.borderRadius = "5px";
                addfriend.style.padding = "5px";
                addfriend.style.cursor = "pointer";

                // Event listener for the button inside the current container
                addfriend.addEventListener('click', function() {
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
                                    'receiver': addfriend.id
                                })
                            })
                            .then(response => response.json())
                            .then(data => {
                                if (data.status === true) {
                                    window.location.href = "/home/";
                                }
                            })
                            .catch(error => {
                                console.error('Error sending friend request:', error);
                            });
                        })
                        .catch(error => {
                            console.error('Error fetching CSRF token:', error);
                        });
                });

                container.appendChild(img);
                container.appendChild(username);
                container.appendChild(addfriend);
                reward.appendChild(container);
            });
        })
        .catch(error => {
            console.error('Error fetching friend suggestions:', error);
        });

    // Event delegation for all button clicks inside the reward section
    document.getElementById('achievements').addEventListener('click', function(event) {
        if (event.target.tagName === 'BUTTON') {
            // Logic to handle button click
            // console.log(event.target.id); // This will log the id of the clicked button
            // Optionally, you can access other elements related to the clicked button
            let container = event.target.closest('div'); // Find the parent container of the button
            let username = container.querySelector('p').textContent; // Get username from the container
            // console.log(username);
            
            // Perform other actions as needed
        }
    });
});





// document.addEventListener('DOMContentLoaded', function() {
//     fetch("/api/get_requests/")
//     .then(response => {
//         if (!response.ok) {
//             window.location.href = "/";
//         }
//         return response.json();
//     })
//     .then(data => {
//         var requests = document.getElementById('notify');
//         for (let i = 0; i < data.length; i++) {
//             let container = document.createElement('div');
//             container.style.display = 'flex';
//             container.style.alignItems = 'center';
        
//             let img = document.createElement('img');
//             img.src = data[i].photo_profile;
//             img.style.width = "40px";
//             img.style.height = "40px";
//             img.style.borderRadius = "50%";
//             img.style.border = "2px solid black";
        
//             let username = document.createElement('p');
//             username.textContent = data[i].username;
//             username.style.color = "black";
//             username.style.fontWeight = "bold";
//             username.style.fontSize = "15px";
//             username.style.marginLeft = "10px";
        
  
        
//             let accept = document.createElement('button');
//             accept.textContent = "Accept";
//             accept.id = data[i].username;
//             accept.style.color = "cyan";
//             accept.style.fontWeight = "bold";
//             accept.style.fontSize = "10px";
//             accept.style.marginLeft = "10px";
//             accept.style.backgroundColor = "black";
//             accept.style.border = "2px solid white";
//             accept.style.borderRadius = "5px";
//             accept.style.padding = "5px";
//             accept.style.cursor = "pointer";
        
//             let reject = document.createElement('button');
//             reject.textContent = "Reject";
//             reject.id = data[i].username;
//             reject.style.color = "cyan";
//             reject.style.fontWeight = "bold";
//             reject.style.fontSize = "10px";
//             reject.style.marginLeft = "10px";
//             reject.style.backgroundColor = "black";
//             reject.style.border = "2px solid white";
//             reject.style.borderRadius = "5px";
//             reject.style.padding = "5px";
//             reject.style.cursor = "pointer";
    
//             /* add a space before container  */
//             space = document.createElement('div');
//             space.style.height = "90px";
//             space.style.width = "80px";

//             container.appendChild(space);
            
    

//             container.appendChild(img);
//             container.appendChild(username);

//             container.appendChild(accept);
//             container.appendChild(reject);
//             requests.appendChild(container);
//             requests.appendChild(document.createElement('br'));
//         }
        

//     }
// )
// })


document.addEventListener('DOMContentLoaded', function() {
    fetch("/api/get_requests/")
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch friend requests');
            }
            return response.json();
        })
        .then(data => {
            var requests = document.getElementById('notify');
            // console.log(data);
            data.forEach(item => {
                let container = document.createElement('div');
                container.style.display = 'flex';
                container.style.alignItems = 'center';
        
                let img = document.createElement('img');
                img.src = item.photo_profile;
                img.style.width = "40px";
                img.style.height = "40px";
                img.style.borderRadius = "50%";
                img.style.border = "2px solid black";
        
                let username = document.createElement('p');
                username.textContent = item.sender_username;
                username.style.color = "black";
                username.style.fontWeight = "bold";
                username.style.fontSize = "15px";
                username.style.marginLeft = "10px";
        
                let accept = document.createElement('button');
                accept.textContent = "Accept";
                accept.id = item.id; // Assuming item.id uniquely identifies the request
                accept.style.color = "cyan";
                accept.style.fontWeight = "bold";
                accept.style.fontSize = "10px";
                accept.style.marginLeft = "10px";
                accept.style.backgroundColor = "black";
                accept.style.border = "2px solid white";
                accept.style.borderRadius = "5px";
                accept.style.padding = "5px";
                accept.style.cursor = "pointer";
        
                let reject = document.createElement('button');
                reject.textContent = "Reject";
                reject.id = item.id; // Assuming item.id uniquely identifies the request
                reject.style.color = "cyan";
                reject.style.fontWeight = "bold";
                reject.style.fontSize = "10px";
                reject.style.marginLeft = "10px";
                reject.style.backgroundColor = "black";
                reject.style.border = "2px solid white";
                reject.style.borderRadius = "5px";
                reject.style.padding = "5px";
                reject.style.cursor = "pointer";
    
                container.appendChild(img);
                container.appendChild(username);
                container.appendChild(accept);
                container.appendChild(reject);
                requests.appendChild(container);
                requests.appendChild(document.createElement('br'));

                // Event listener for 'Accept' button
                accept.addEventListener('click', function() {
                    handleRequestAction(item.id, 'accept', item.sender_username); // Pass item.username
                });

                // Event listener for 'Reject' button
                reject.addEventListener('click', function() {
                    handleRequestAction(item.id, 'reject', item.sender_username); // Pass item.username
                });
            });
        })
        .catch(error => {
            console.error('Error fetching friend requests:', error);
        });

    // Function to handle 'Accept' or 'Reject' action
    function handleRequestAction(requestId, action, senderUsername) {
        // console.log(senderUsername); // Log the sender username (optional
        fetch('/api/csrf-token/')
            .then(response => response.json())
            .then(data => {
                let token = data.csrfToken;
                fetch('/api/accept_request/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': token,
                    },
                    body: JSON.stringify({
                        'request_id': requestId,
                        'action': action,
                        'sender': senderUsername // Use senderUsername parameter
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.status === true) {
                        // Optionally, update UI or redirect to another page
                        console.log(`${action} request successful`);
                        // Example: Refresh notifications or update UI
                        // window.location.reload();
                    } else {
                        console.error(`${action} request failed`);
                    }
                })
                .catch(error => {
                    console.error(`Error ${action}ing request:`, error);
                });
            })
            .catch(error => {
                console.error('Error fetching CSRF token:', error);
            });
    }
});

