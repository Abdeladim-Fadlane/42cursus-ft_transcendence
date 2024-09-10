import { view_profile } from './userInformation.js';

function ParceDate(date){
    let _date = date.substr(0, date.indexOf('T'));
    let _time = date.substr(date.indexOf('T') + 1 ,  date.indexOf('.') - (date.indexOf('T') + 1));
    return `${_date} ${_time}`;
}

function send_request(room_name, user_sender, user_id)
{
    fetch('/chatCsrftoken/')
    .then(response => response.json())
    .then(data => {
        fetch('/readMessage/',{
            method: 'POST',
            headers :{
                'Content-Type': 'application/json',
                'X-CSRFToken': data.csrfToken,
            },
            body : JSON.stringify({ 
                'username' : user_sender,
                'room_name' : room_name,
             })
        })
        .then(response =>{
            return response.json();
        })
        .then(data=>{
            fetchConversation(user_id, user_sender);
            fetchAllMessage(user_id, user_sender);
        })
    })
}

function fetchAllMessage(userid, username)
{
    fetch('/chatCsrftoken/')
    .then(response => response.json())
    .then(data => {
        fetch('/MessageUsers/',{
            method: 'POST',
            headers :{
                'Content-Type': 'application/json',
                'X-CSRFToken': data.csrfToken,
            },
            body : JSON.stringify({ 
                'id_user' : userid,
                'username' : username,
             })
        })
        .then(response =>{
            return response.json();
        })
        .then(data=>{
            if (data.status == 'success')
            {
                let friend = document.querySelector('#list_friend_chat').querySelectorAll('button'); 

                if (data.values.length == 0)
                    friend.forEach(f =>{
                        f.querySelector('.user-count-message').textContent = '';
                        f.querySelector('.user-count-message').style.display = 'none'
                    })
                for (let j = 0; j < friend.length ; j++)
                {
                    let check = true;
                    for (let i = 0; i < data.values.length ; i++)
                    {  
                        if (data.values[i].sender_name == friend[j].querySelector('p').textContent)
                        {
                            friend[j].querySelector('.user-count-message').textContent = data.values[i].count_message;
                            friend[j].querySelector('.user-count-message').style.display = 'flex'
                            check = false;
                            break ;
                        }
                        
                    }
                    if (check)
                    {
                        friend[j].querySelector('.user-count-message').textContent = '';
                        friend[j].querySelector('.user-count-message').style.display = 'none'
                        break ;
                    }
                }
            }
            
        })
    })
}

function fetchConversation(userid, username)
{
    fetch('/chatCsrftoken/')
    .then(response => response.json())
    .then(data => {
        fetch('/NotReaded/',{
            method: 'POST',
            headers :{
                'Content-Type': 'application/json',
                'X-CSRFToken': data.csrfToken,
            },
            body : JSON.stringify({ 
                'id_user' : String(userid),
                'username' : username,
             })
        })
        .then(response =>{
            return response.json();
        })
        .then(data=>{
            if (data.status == 'success')
            {
                let div_notif = document.querySelector('.chat-aside-numberMessage');
                if (data.not_read == 0)
                {
                    div_notif.textContent = '';
                    div_notif.style.display = 'none'
                }
                else{

                    div_notif.style.display = 'flex';
                    div_notif.textContent = data.not_read;
                }
            }
        })
    })
}
export {fetchConversation, fetchAllMessage, send_request}
function generateRoomName(user1, user2)
{
    let tab = [user1, user2]; 
    tab.sort();
    return `room_${tab[0]}_${tab[1]}`;
}

function hasNonPrintableChars(inputString) {
    for (var i = 0; i < inputString.length; i++) {
        var code = inputString.charCodeAt(i);
        if (code > 32 && code < 126) 
        {
            return true;
        }
    }
    return false;
}


let last_button = null;
var Web_socket = null;
export function setLastButton(){
    last_button = null;
    if (Web_socket !== null){
        if (Web_socket.readyState === WebSocket.OPEN)
            Web_socket.close();
        Web_socket = null;
    }
}
import { cleaning_chat } from './msgfriend.js';
function create_chatRoom(map)
{
    let map_action = new Map(map)
    let div_chat_tools = document.querySelector(".chat-input")
    var chat_div = document.querySelector("#chat-messages" );;
    var chat_input = document.querySelector("#message-input");
  

    var button_chat = document.querySelector('#button-chat');
    var buttons_friends = document.querySelectorAll('.friend-list-room');
    var chat_header = document.querySelector(".chat-header");
  
    var chat_container = document.querySelector('.chat-container')
    let user_image = document.createElement('img');
    let div_info = document.createElement('div');
    let div_menu = document.createElement('div');
    let button_block = document.createElement('p');
    div_menu.className = 'user-info-menu';
    button_block.className = 'menu-block-button';
    let button_info = document.createElement('p');
    button_info.className = 'menu-info-button'
    let div_menu_child1 = document.createElement('div');
    div_menu_child1.addEventListener('click', view_profile);
    let button_game = document.createElement('p');
    button_game.classList.add('menu-game-button');
    
    let icon_div = document.createElement('i')
    icon_div.classList.add("fa-solid" ,"fa-user") 
    div_menu_child1.append(
        icon_div,
        button_info);
        div_menu_child1.style.marginBottom = '4px'
        let div_menu_child2 = document.createElement('div');
        icon_div = document.createElement('i')
        icon_div.classList.add("fa-solid" ,"fa-lock")
    div_menu_child2.append(
        icon_div,
        button_block
    )
    div_menu_child2.style.marginTop = '4px'
    let div_menu_child3 = document.createElement('div')
    icon_div = document.createElement('i');
    icon_div.classList.add('fa-solid', 'fa-table-tennis-paddle-ball');
    div_menu_child3.append(
        icon_div,
        button_game
    )
    div_menu.append(div_menu_child1,
        document.createElement('hr'),
        div_menu_child3
    );
    let hrElement = document.createElement('hr');
    div_menu.append(
        hrElement,
        div_menu_child2
    );
    var check = true;
    let username2;
    let username1;
    let room_name;
    let div_bolck_msg = document.createElement('div');
    div_bolck_msg.className = 'div-block-user'
    let index = 0;
    var user_status = document.createElement('p');
    user_status.classList.add('header-chat-status');
    
    buttons_friends.forEach(button => {
        button.addEventListener('click', (e) =>
        {
            if (button == last_button)
                return ;
            console.log(button)
            document.querySelector('.empty-chat-body').style.display  = 'none'
            chat_header.append(user_status)
            user_status.textContent = '';
            
            chat_input.value = '';
            chat_div.style.display = 'flex';
            div_chat_tools.style.display = 'flex';
            if (chat_container.contains(div_menu))
            {
                check = true;
                chat_container.removeChild(div_menu);
            }
            index = 0;
            last_button = button;
            let header_username = document.querySelector("#chat-friend-name");
            chat_div.innerHTML = "";
        
            username1 = document.querySelector('#login').textContent;
            let usernameid = document.querySelector('#login').className;
            let usernameid1 = button.id;
            username2 = button.querySelector('p').textContent;
            // console.log(usernameid , '======' , usernameid1);
            room_name = generateRoomName( usernameid ,button.id);
            let icon = document.createElement('i');
            icon.style.color = 'white';
            icon.classList.add('fa-solid', 'fa-ellipsis-vertical');
            let url = `/DisplayMsg/${room_name}`
            fetch(url)
            .then(response => {
                if (!response.ok) {
                    console.log("Error when fetching data from server" + ` url == ${url}`);
                }
                return response.json();
            })
            .then(data => {
                for (let i = 0; i < data.length; i++)
                {
                    let div_parent = document.createElement("div");
                    let div_message = document.createElement('div');
                    let div_time = document.createElement('div');
                    div_time.innerHTML = ParceDate(data[i].time_added)
                    div_message.innerHTML = data[i].content;
                    if (data[i].sender_name == username1)
                    {
                            div_message.style.cssText = `
                            background-color : #5B73EF;
                            color : white;
                            right : 0;
                            top : ${index}px;
                            border-radius: 10px 10px 0px 10px;

                        `
                        div_time.style.cssText = `right : 10px;`
                    }
                    else{
                        div_message.style.cssText = `
                            background-color : #C1C5DB;
                            left : 0;
                            top : ${index}px;
                            border-radius: 10px 10px 10px 0px;
                        `
                        div_time.style.cssText = `left : 10px;`
                    }
                    div_time.className = 'Message-time';
                    div_parent.className = 'Message-Div';
                    div_message.className = 'Message-content'

                    div_parent.append(div_message, div_time);
                    chat_div.append(div_parent);
                    index += div_message.clientHeight;
                    index += 8;
                    div_time.style.top = `${index}px`
                    index += 10;
                    chat_div.scrollTop = chat_div.scrollHeight - chat_div.clientHeight;
                    
                }

            })
            .catch(error =>{ 
                console.log(error);
            })
            let div_image = document.getElementById('image-chat');
            div_image.append(user_image);
            header_username.innerHTML = button.querySelector('p').textContent;
            if (button.querySelector('.chat-friend-status').style.backgroundColor == 'green')
               user_status.textContent = 'online';
            else
                user_status.textContent = 'offline';

            
            div_info.textContent = '';
            div_info.className = 'chat-option-user';
            div_info.append(icon);
            chat_header.append(div_info);
            user_image.src = button.querySelector("img").src;
            user_image.alt = "user_photo";
            user_image.className = 'header-chat-photouser'
            header_username.style.cssText = `
                font-size : 20px;
            `
            chat_header.style.cssText = `border: 2px solid #bbbbbb7b;
            border-radius: 10px;`;
            if (Web_socket !== null)
            {
                if (Web_socket.readyState === WebSocket.OPEN)
                    Web_socket.close();
                Web_socket = null;
                console.log('the web socket has been closed');
            }
            if (Web_socket == null)
                Web_socket = new WebSocket(`wss://${window.location.host}/wss/chat/${room_name}/`);
            
             Web_socket.onopen = () =>{
                send_request(room_name, username1, usernameid);
                button.style.backgroundColor = '#764081';
                button.style.border = '1px #c683d3 solid';
                button.style.boxShadow = '6px 6px 15px #c683d3';
                console.log(`WebSocket server is running on wss://${window.location.host}/${room_name}/`);
                
                url = `/Converstaion/${room_name}/`;
                fetch(url)
                .then(response => {
                    if (!response.ok) {
                        console.log("Error when fetching data from server" + ` url == Converstaion/${room_name}/}`);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.block_conversation == true)
                    {
                        map_action[username2] ="unblock";
                        if (data.user_bloking == username1)
                        {
                            div_bolck_msg.textContent = `you are blocked ${username2} try to unblock`;
                            if (div_menu.contains(div_menu_child2) == false)
                                div_menu.append(div_menu_child2);
                        }
                        else {
                            div_bolck_msg.textContent = `${username2} block you`;
                            if (div_menu.contains(div_menu_child2) == true)
                                div_menu.removeChild(div_menu_child2);
                        }
                        div_chat_tools.append(div_bolck_msg);
                        chat_input.hidden = true;
                        button_chat.hidden = true;
                    }
                    else
                    {
                        map_action[username2] = "block";
                        chat_input.hidden = false;
                        button_chat.hidden = false;
                        if (div_chat_tools.contains(div_bolck_msg) == true)
                            div_chat_tools.removeChild(div_bolck_msg);
                        if (div_menu.contains(div_menu_child2) == false)
                            div_menu.append(div_menu_child2);
                        button_block.textContent = `${map_action[username2]} ${username2}`;
                    }
                })
                .catch(error =>{
                    console.log(error);
                })
                
            }
            Web_socket.onerror = ()=>{
                location.reload();
            }
            let div_animate;
            Web_socket.onmessage =  (e) =>{
                send_request(room_name, username1, usernameid);
                let data_message = JSON.parse(e.data);

                if (data_message.task == 'send_message')
                {   
                    let div_time = document.createElement('div')
                    div_time.innerHTML = ParceDate(data_message.time);
                    if (data_message.status == "success")
                    {
                        
                        let div_message = document.createElement('div');
                        div_message.innerHTML = data_message.message;
                        let div_parent = document.createElement("div");
                        
                        if (data_message.sender == username1)
                        {
                            div_message.style.cssText = `
                                background-color : #5B73EF;
                                color : white;
                                right : 0;
                                top : ${index}px;
                                border-radius: 10px 10px 0px 10px;
                            `
                            div_time.style.cssText = `right : 10px;`
                        }
                        else
                        {
                            div_message.style.cssText = `
                                background-color : #C1C5DB;
                                left : 0;
                                top : ${index}px;
                                border-radius: 10px 10px 10px 0px;

                            `
                            div_time.style.cssText = `left : 10px;`
                        }
                        div_parent.className = 'Message-Div';
                        div_time.className = 'Message-time';
                        div_message.className = 'Message-content'
                        div_parent.append(div_message, div_time)
                        chat_div.append(div_parent);
                        index += div_message.clientHeight;
                        index += 8;
                        div_time.style.top = `${index}px`;
                        index += 10;
                    }
                }
                else if (data_message.task == 'send_block')
                {
                    if (data_message.action == 'unblock')
                    {
                        map_action[username2] = 'block';
                        chat_input.hidden = false;
                        button_chat.hidden = false;
                        if (div_chat_tools.contains(div_bolck_msg) == true)
                            div_chat_tools.removeChild(div_bolck_msg);
                        if (div_menu.contains(div_menu_child2) == false)
                            div_menu.append(hrElement,div_menu_child2);
                        button_block.textContent = `${map_action[username2]} ${username2}`;
                    }
                    else if (data_message.action == 'block')
                    {
                        map_action[username2] = 'unblock';
                        if (data_message.sender == username1)
                            div_bolck_msg.textContent = `you are blocked ${username2} try to unblock`;
                        else {
                            div_bolck_msg.textContent = `${username2} block you`
                            if (div_menu.contains(div_menu_child2) == true)
                            {
                                div_menu.removeChild(div_menu_child2);
                                div_menu.removeChild(hrElement);
                            }
                        }
                        div_chat_tools.append(div_bolck_msg);
                        chat_input.hidden = true;
                        button_chat.hidden = true;
                        div_chat_tools.style.color = 'white'; 
                        button_block.textContent = `${map_action[username2]} ${username2}`;
                    }
                }
                else if (data_message.task == 'is_typing' && data_message.sender != username1){
                    if (data_message.action == 'up'){
                        user_status.textContent = `${username2} is typing ...`;
                    }
                    else if (data_message.action == 'down'){
                        if (button.querySelector('.chat-friend-status').style.backgroundColor == 'green')
                            user_status.textContent = 'online';
                        else
                            user_status.textContent = 'offline';
                    }
                }
                chat_div.scrollTop = chat_div.scrollHeight - chat_div.clientHeight;
            }
            
            button_chat.addEventListener('click', () => {
                if (String(chat_input.value).length && hasNonPrintableChars(chat_input.value) == true)
                {
                    Web_socket.send(JSON.stringify({
                        'task' : 'send_message',
                        'sender' : username1,
                        'message': chat_input.value,
                        'room_name' : room_name,
                        'action' : "",
                        'user_id' : button.id,
                    }));
                    chat_input.value = "";
                }
            })
            chat_input.addEventListener('input', ()=>{
                Web_socket.send(JSON.stringify({
                    'task' : 'is_typing',
                    'action' : 'up',
                    'sender' : username1,
                }))
            })
            chat_input.addEventListener('blur', ()=>{
                Web_socket.send(JSON.stringify({
                    'task' : 'is_typing',
                    'action' : 'down',
                    'sender' : username1
                }))
            })
            chat_input.addEventListener('keyup', (e) => {
                if (String(chat_input.value).length && e.key == 'Enter' && hasNonPrintableChars(chat_input.value) == true)
                {   
                    Web_socket.send(JSON.stringify({
                        'task' : 'send_message',
                        'sender' : username1,
                        'message': chat_input.value,
                        'room_name' : room_name,
                        'action' : '',
                        'user_id' : button.id,
                    }));
                    chat_input.value = "";
                    // chat_input.blur();
                }
            })
            Web_socket.onclose = () =>{
                button.style.backgroundColor = '#ffffff00'
                button.style.border = 'none';
                button.style.boxShadow = 'none';
                console.log('the connection has been closed')
            }

        })
    });
    // document.addEventListener('click', function(event) {
    //     // let div_search = document.querySelector('.nav-search');
    //     if (div_menu && !div_menu.contains(event.target) && check == false) {
    //         // isdone = false;
    //         check = true
    //         div_menu.remove();
    //         // chat_container.removeChild(div_menu)
    //         // search.value = '';
    //         // search.style.transform = 'rotateY(90deg)'; 
    //         // div_user.textContent = '';
    //     }
    // });
    chat_container.addEventListener('click', (e) =>{
        if (check == false)
        {
            let div = div_menu.getBoundingClientRect();
            let div2 = div_info.getBoundingClientRect();
            if (e.clientX >= div2.left && e.clientX <= div2.right  && div2.top <= e.clientY && div2.bottom >= e.clientY)
                return ;
          
            if (!(e.clientX >= div.left && e.clientX <= div.right && div.top <= e.clientY && div.bottom >= e.clientY))
            {
                check = true;
                // chat_container.removeChild(div_menu);
                div_menu.remove();
            }
        }
    })
    div_info.addEventListener('click', () =>{
        if (check == true){
            button_block.textContent = `${map_action[username2]} ${username2}`;
            button_info.textContent = `${username2}'s profile`;
            button_game.textContent = `play with ${username2}`;
            button_game.addEventListener('click', ()=>{
                cleaning_chat();
                challenge_friend(username2);
            });
            div_menu_child1.id = username2;
            chat_container.append(div_menu);
            check = false;
        }
        else{
            check = true;
            chat_container.removeChild(div_menu);
        }
    });
    function do_action(e)
    {
        fetch('/chatCsrftoken/')
            .then(response => response.json())
            .then(data => {
                fetch(`/blockFriend/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': data.csrfToken,
                    },
                    body: JSON.stringify({ 
                        'username' : username1,
                        'room_name' : room_name,
                        'action' : map_action[username2],
                     })
                })
                    .then(response => {
                        if (response.ok) {
                            return (response.json());
                        } else {
                        console.error('Error blocking friend:', response.status);
                        }
                    })
                    .then(data =>{
                        Web_socket.send(JSON.stringify({
                            'task' : 'send_block',
                            'sender' : username1,
                            'message': "",
                            'room_name' : room_name,
                            'action' : data.action,
                            'user_id' : '',
                        }));
                    })
                    .catch(error => {
                        console.error('Error when fetch csrf token :', error);
                    });
            })
            .catch(error =>{ 
                console.error('Error fetching CSRF token:', error);
            })     
    }
    div_menu_child2.addEventListener('click', do_action);
}


export { create_chatRoom , last_button};
