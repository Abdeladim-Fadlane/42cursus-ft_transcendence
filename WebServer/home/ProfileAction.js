
let button_friend = document.querySelector('.profile-user-action-add_friend');
let button_unfriend = document.querySelector('.profile-user-action-unfriend');
let button_chat = document.querySelector('.profile-user-action-go_to_chat');
let parent = document.querySelector('.profile-user-action')
function to_chat(e)
{
    let username = e.target.id;
    document.querySelector('.close_profile').click()
    document.querySelector('.chat-aside').click()
    let friends = document.querySelectorAll('.friend-list-room');
    for (let j = 0; j < friends.length; j++)
        if (friends[j].id == username)
            friends[j].click();
}

function Animation_elemeny(element)
{
    let text = element.textContent;
    element.textContent = '';
    
    let inter = setInterval(()=>{
        if (element.textContent == '...')
        {
            clearInterval(inter);
            element.textContent = text;
        }
        else
            element.textContent += '.';
    }, 300)


}


async function func_add_friend(e)
{
    // console.log('=====>' + e.target.id)
    Animation_elemeny(e.target);
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
            }
        })
    })
    .catch(error => {
        console.log('Error sending friend request:', error);
    });
}



function remove_friend(e)
{
    console.log(e.target.id);
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
            console.log(data.error);
            if (data.status === true)
            {
                parent.style.display = 'flex';
                button_unfriend.style.display = 'none';
                button_friend.style.display = 'flex';
                button_friend.id = e.target.id;
                button_chat.id = e.target.id;
                button_chat.style.display = 'none';
            }
        });
    });
}

