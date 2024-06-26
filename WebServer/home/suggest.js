

document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/suggest/')
        .then(response => {
            if (!response.ok) {
                window.location.href = "/";
            }
            return response.json();
        })
        .then(data => {
            var reward = document.getElementById('achievements');
            for (let i = 0; i < data.length; i++) {

                let container = document.createElement('div');
                container.style.display = 'flex';
                container.style.alignItems = 'center';

                let img = document.createElement('img');
                img.src = data[i].photo_profile;
                img.style.width = "40px";
                img.style.height = "40px";
                img.style.borderRadius = "50%";
                img.style.border = "2px solid black";

                let username = document.createElement('p');
                username.textContent = data[i].username;
                username.style.color = "black";
                username.style.fontWeight = "bold";
                username.style.fontSize = "15px";
                username.style.marginLeft = "10px";
                

                let addfriend = document.createElement('button');
                addfriend.textContent = "Add Friend";
                /* add a id to botton */
                addfriend.id = data[i].username;
                addfriend.style.color = "cyan";
                addfriend.style.fontWeight = "bold";
                addfriend.style.fontSize = "10px";
                addfriend.style.marginLeft = "10px";
                addfriend.style.backgroundColor = "black";
                addfriend.style.border = "2px solid white";
                addfriend.style.borderRadius = "5px";
                addfriend.style.padding = "5px";
                addfriend.style.cursor = "pointer";

                


                container.appendChild(img);
                container.appendChild(addfriend);
                reward.appendChild(container);
                reward.appendChild(username);
                reward.appendChild(document.createElement('br'));
            }
        })

});

document.addEventListener('DOMContentLoaded', function() {
    this.documentElement.addEventListener('click', function(event) {
        if (event.target.tagName === 'BUTTON') {
            console.log(event.target.id,"----------");
            fetch('/api/csrf-token/')
                .then(response => response.json())
                .then(data => {
                    token = data.csrfToken;
                    console.log(token);
                    fetch('/api/send_request/', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-CSRFToken': token,
                                },
                            body: JSON.stringify({
                                'receiver': event.target.id
                            })
                        })
                        .then(response => response.json())
                        .then(data => {
                            if (data.status === true) {
                                window.location.href = "/home/";
                            }
                        })
                })  
        }
    })
})


document.addEventListener('DOMContentLoaded', function() {
    fetch("/api/get_requests/")
    .then(response => {
        if (!response.ok) {
            window.location.href = "/";
        }
        return response.json();
    })
    .then(data => {
        var requests = document.getElementById('notify');
        for (let i = 0; i < data.length; i++) {
            let container = document.createElement('div');
            container.style.display = 'flex';
            container.style.alignItems = 'center';
        
            let img = document.createElement('img');
            img.src = data[i].photo_profile;
            img.style.width = "40px";
            img.style.height = "40px";
            img.style.borderRadius = "50%";
            img.style.border = "2px solid black";
        
            let username = document.createElement('p');
            username.textContent = data[i].sender_username;
            username.style.color = "black";
            username.style.fontWeight = "bold";
            username.style.fontSize = "15px";
            username.style.marginLeft = "10px";
        
  
        
            let accept = document.createElement('button');
            accept.textContent = "Accept";
            accept.id = data[i].username;
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
            reject.id = data[i].username;
            reject.style.color = "cyan";
            reject.style.fontWeight = "bold";
            reject.style.fontSize = "10px";
            reject.style.marginLeft = "10px";
            reject.style.backgroundColor = "black";
            reject.style.border = "2px solid white";
            reject.style.borderRadius = "5px";
            reject.style.padding = "5px";
            reject.style.cursor = "pointer";
    
            /* add a space before container  */
            space = document.createElement('div');
            space.style.height = "90px";
            space.style.width = "80px";

            container.appendChild(space);
            
    

            container.appendChild(img);
            container.appendChild(username);

            container.appendChild(accept);
            container.appendChild(reject);
            requests.appendChild(container);
            requests.appendChild(document.createElement('br'));
        }
        

    }
)
})