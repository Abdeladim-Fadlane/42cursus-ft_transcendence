
let button_friend = document.querySelector('.profile-user-action-add_friend');
let button_unfriend = document.querySelector('.profile-user-action-unfriend');
let button_chat = document.querySelector('.profile-user-action-go_to_chat');
let parent = document.querySelector('.profile-user-action');
let message = document.querySelector('.profile-user-action-message');

function to_chat(e)
{
    let username = e.target.id;
    let text = e.target.textContent;
    Animation_elemeny(e.target, 70, 20);
    setTimeout(()=>{

        document.querySelector('.close_profile').click()
        document.querySelector('.chat-aside').click()
        e.target.textContent = text;
        let friends = document.querySelectorAll('.friend-list-room');
        for (let j = 0; j < friends.length; j++)
            if (friends[j].id == username)
                friends[j].click();
    },3000)
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
    Animation_elemeny(e.target, 70, 18);

    setTimeout(()=>{
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
                }
            })
        })
        .catch(error => {
            console.log('Error sending friend request:', error);
        });
    }, 3000)
}



function remove_friend(e)
{
    let text = e.target.textContent;
    Animation_elemeny(e.target, 65, 20);
    // message.textContent = `${e.target.id} successfully removed.`;
    // message.style.color = 'white';
    setTimeout(()=>{
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
                // await (setTimeout(()=>{}, 5000));
                // message.style.display = 'none';
                button_friend.style.display = 'flex';
                button_friend.id = e.target.id;
                e.target.textContent = text; 
            }
        });
    });
    }, 3000)
    
}

export {func_add_friend , to_chat ,remove_friend}