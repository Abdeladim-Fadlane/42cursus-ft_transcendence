import {func_add_friend , to_chat ,remove_friend} from './ProfileAction.js';
function ParceDate(date){
    let _date = date.substr(0, date.indexOf('T'));
    let _time = date.substr(date.indexOf('T') + 1 ,  date.indexOf('.') - (date.indexOf('T') + 1));
    return `${_date + ' ' + _time}`;
}
let  interval;
// import {func_add_friend , to_chat ,remove_friend} from './ProfileAction.js'
function drawHistory(username)
{
    fetch(`/api/history/?username=${username}`)
        .then(response => {
            if (!response.ok) {
                console.error('Error:', response);
                return;
            }
            return response.json();
        })
        .then(data => {
            var historyContainer = document.querySelector('.history-player');
            // console.log(data);
            if (data.length == 0){
                document.querySelector('.no-history').style.display = 'flex';
                historyContainer.style.display = 'none'

            }
            else{
                document.querySelector('.no-history').style.display = 'none';
                historyContainer.style.display = 'flex';

                if (historyContainer) {
                    historyContainer.innerHTML = ''; // Clear previous content
                    data.forEach(item => {
                        let container = document.createElement('div');

                        let content = document.createElement('div');
                        content.classList.add('content');

                        let date = document.createElement('p');
                        date.textContent = item.date.split('T')[0] + ' ' + item.date.split('T')[1].split('.')[0];
                        date.classList.add('date');
                        date.style.textAlign = 'center';
                        date.style.fontSize = '10px';
                        date.style.fontWeight = 'bold';
                        date.style.color = 'white';

                        let div1 = document.createElement('div');
                        div1.classList.add('player1');
                        let img = document.createElement('img');
                        let winner = document.createElement('p');
                        div1.appendChild(img);
                        div1.appendChild(winner);

                        let div2 = document.createElement('div');
                        div2.classList.add('player2');
                        let img2 = document.createElement('img');
                        let loser = document.createElement('p');
                        div2.appendChild(img2);
                        div2.appendChild(loser);

                        let div3 = document.createElement('div');
                        div3.classList.add('result');
                        let text = document.createElement('p');
                        div3.appendChild(text);

                        content.appendChild(div1);
                        content.appendChild(div3);
                        content.appendChild(div2);

                        winner.textContent = item.winner.username;
                        loser.textContent = item.loser.username;

                        text.innerHTML = item.score1 + ' - ' + item.score2;
                        img.src = item.winner.photo_profile;
                        img2.src = item.loser.photo_profile;

                        container.appendChild(content);
                        container.appendChild(date);
                        historyContainer.appendChild(container);
                    });

                } 
            }
        })
        .catch(error => {
            console.error('Error fetching history:', error);
        });
}
function drawCircle(lose, win)
{
    let circle = document.querySelector('.circle');

    let value_win = win;
    let value_lose = lose;
    let totale = value_win + value_lose;
    let _win = value_win * 100 / totale;
    let _lose = value_lose * 100 / totale;
    let  div_white = document.createElement('div')
    let div_lose =  document.createElement('div');
    let number_win = document.querySelector('.number-win')
    let number_lose = document.querySelector('.number-lose')
    number_lose.textContent = `Losing ${lose}`;
    number_win.textContent = `Wining ${win}`;
    let text_lose  = document.querySelector('.lose-statistique');
    div_lose.classList.add('child');
    let div_win =  document.createElement('div');
    let text_win  = document.querySelector('.win-statistique');
    div_win.classList.add('child');
    // text_win.textContent = '';
    // text_lose.textContent = '';
    text_win.textContent = '0%'
    text_lose.textContent = '0%'
    circle.append(div_lose, div_win, div_white);
    div_white.classList.add('div-white')
    let i = 0;
    let j = 0;
    div_win.addEventListener('mouseover', ()=>{
        div_win.style.width = '230px';
        div_win.style.height = '230px';
        number_lose.style.display = 'flex';
        number_win.style.display = 'flex';

    });
    
    div_win.addEventListener('mouseleave', ()=>{
        div_win.style.width = '200px';
        div_win.style.height = '200px';
        number_lose.style.display = 'none';
        number_win.style.display = 'none';
    });
    div_win.style.background = `conic-gradient(#5cb85c ${value_win * 360 / totale}deg, #D8636F 0deg)`
    div_lose.style.background = `conic-gradient(#D8636F ${value_lose * 360 / totale}deg, #5cb85c 0deg)`
    interval = setInterval(()=>{
        if (i < _win)
        {
            i++;
            if (i > _win)
                i = _win.toFixed(2);
            text_win.textContent = `${i}%`
        }
        if (j < _lose)
        {
            j++;
            if (j > _lose)
                j = _lose.toFixed(2);
            text_lose.textContent = `${j}%`
        }
        if (Number(i) + Number(j) == 100)
            clearInterval(interval);
    },  80)
    circle.style.display = 'flex';
}
let closeInter;
let action = ''

function button_profile(username, Profileid){

    let parent_button = document.querySelector('.profile-user-action');
    let add_friend = document.querySelector('.profile-user-action-add_friend')
    let chat_button = document.querySelector('.profile-user-action-go_to_chat')
    let delete_friend = document.querySelector('.profile-user-action-unfriend')
    let isdone = false;
    add_friend.addEventListener('click', func_add_friend );
    chat_button.addEventListener('click', to_chat);
    delete_friend.addEventListener('click', remove_friend);
    if (username == document.querySelector('#login').textContent)
        return ;
    fetch('/api/suggest/')
    .then(response=>{
        return response.json();
    })
    .then(data=>{
        let isdone = false;
        for(let i = 0; i < data.length; i++)
        {
            if (data[i].username == username)
            {     
                isdone = true;
                if (add_friend.style.display != 'none')
                    return;
                add_friend.style.display = 'flex';
                add_friend.id = username;
                delete_friend.style.display = 'none';
                parent_button.style.display = 'flex';
                chat_button.style.display = 'none';
                return ;
            }
                
        }
        if (!isdone)
        {
            fetch('/api/friends/')
            .then(response=>{
                return response.json();
            })
            .then(data=>{
                for (let i = 0; i < data.length; i++)
                {
                    if (data[i].username == username)
                    {
                        isdone = true;
                        if (delete_friend.style.display != 'none')
                            return ;
                        delete_friend.style.display = 'flex';
                        chat_button.style.display = 'flex';
                        parent_button.style.display = 'flex';
                        delete_friend.id = username;
                        chat_button.id = Profileid;
                        // console.log(Profileid)
                        return ;
                    }
                    
                }
                if (!isdone)
                {
                    parent_button.style.display = 'none';
                }
            })
           
        }
        
        // console.log('------------------------')
    })
    .catch(error=>{console.log(error);return ;})
}
let status = document.querySelector('.profile-user-status-string');
let status_color = document.querySelector('.profile-user-status-color');
function ProfileStutus(username)
{
    fetch('/api/csrf-token/')
    .then(response =>{
        if (response.ok == false){
            console.log('error when fetching data');
        }
        return response.json();
    })
    .then(data =>{
        fetch('/api/friend/', {
            method: 'POST',
            headers : {
                'Content-Type': 'application/json',
                'X-CSRFToken': data.csrfToken,
            },
            body :JSON.stringify({
                'username' : username,
            })
        })
        .then(response =>{
            if (response.ok != true)
                console.log('error when fetching data of user by `/api/friend/`');
            return response.json();
        })
        .then(data=>{
            if (String(data.available) == 'true'){
                status.textContent = 'online';
                status_color.style.backgroundColor = 'green'
            }
            else
            {
                status.textContent = 'offline';
                status_color.style.backgroundColor = 'red'

            }
        })
    })
}
let ProfileUsername = '';
let ProfileUser_id ;
export {ProfileUsername, ProfileUser_id , button_profile, ProfileStutus}
export function view_profile(e)
{
    
    document.querySelector('.history-player').style.border = 'none';
    document.querySelector('.history-header').style.border = 'none';
    document.querySelector('.profile-user-history-match').style.display = 'none';
    document.querySelector('.profile-user-statistique').style.display = 'flex';
    ProfileUsername = e.target.id;
    let button_friend = document.querySelector('.profile-user-action-add_friend');
    let delete_friend = document.querySelector('.profile-user-action-unfriend');
    let button_chat = document.querySelector('.profile-user-action-go_to_chat');
    button_chat.style.display = 'none';
    button_friend.style.display = 'none';
    delete_friend.style.display = 'none';
    const modal = document.getElementById('content-user');
    let _circle = document.querySelector('.circle');
    let username = document.querySelector('.profile-user-info-username');
    let score = document.querySelector('.profile-user-info-score');
    let rank = document.querySelector('.profile-user-info-rank');
    let img_profile = document.querySelector('.profile-user-photo_profile');
    let dateCreatiomAccount = document.querySelector('.profile-user-dateCreationAccount');
    let firstname = document.querySelector('.profile-user-firstname');
    let lastname = document.querySelector('.profile-user-lastname');
    let email = document.querySelector('.profile-user-email');
    
    let statistique = document.querySelector('.no-statistique');
    let win = document.querySelector('.win-statistique');
    let lose = document.querySelector('.lose-statistique');
    let usernameFriend ;
    if (e.target.id.length == 0)
        e.target.id = e.currentTarget.id
    console.log(e.target.id);
    fetch('/api/csrf-token/')
    .then(response =>{
        if (response.ok == false)
            console.log('error when fetching data');
        return response.json();
    })
    .then(data =>{
        fetch('/api/friend/', {
            method: 'POST',
            headers : {
                'Content-Type': 'application/json',
                'X-CSRFToken': data.csrfToken,
            },
            body :JSON.stringify({
                'username' : e.target.id,
            })
        })
        .then(response =>{
            if (response.ok != true)
            {
                console.log('error when fetching data of user by `/api/friend/`');
            }
            return response.json();
        })
        .then(data=>{
            ProfileUser_id = data.id;
            button_profile(e.target.id, ProfileUser_id);
            usernameFriend = data.username
            username.textContent = data.username;
            score.textContent = data.score;
            rank.textContent = data.ranking;
            img_profile.src = data.photo_profile;
            dateCreatiomAccount.textContent = ParceDate(data.date_joined);
            firstname.textContent = data.first_name;
            lastname.textContent = data.last_name;
            email.textContent = data.email;
            if (String(data.available) == 'true'){
                status.textContent = 'online';
                status_color.style.backgroundColor = 'green'
            }
            else
            {
                status.textContent = 'offline';
                status_color.style.backgroundColor = 'red';
            }
            if (data.win == '0' && data.lose == '0'){
                _circle.style.display = 'none';
                document.querySelector('.number-statistique').style.display = 'none'
                statistique.style.display = 'flex';
            }
            else{
                 
                drawCircle(Number(data.lose), Number(data.win))
                document.querySelector('.number-statistique').style.display = 'flex';
                statistique.style.display = 'none';
            }
            drawHistory(data.username);
            document.querySelector('.statistique-header').style.borderBottom = '2px solid white'
        })
    })
    ProfileStutus(e.target.id);
    modal.style.display = 'flex';
        
}

document.addEventListener('DOMContentLoaded', function() {
    // Select all elements with the class 'close_profile'
    const closeButtons = document.querySelectorAll('.close_profile');
    
    // Add a click event listener to each button
    closeButtons.forEach(function(button) {
        button.addEventListener('click', close_user);
    });
});
const content_user = document.getElementById('content-user');
if (content_user)
    content_user.addEventListener('click', function(event) {
        if (event.target === this) {
            close_user();
        }
    });
// document.getElementById('content-user').addEventListener('click', function(event) {

   
    
//     if (event.target === this) {
//         // console.log('close_user');
//         close_user(); // Close modal only if clicking on #content-user directly
//     }
// });
function view_friends()
{
    // console.log("view_friends");
    const modal = document.getElementById('view-friends');
    modal.style.display = 'flex';
    document.getElementById('view-matchs').style.display = 'none';
    document.getElementById('profile-user-friend').style.borderBottom = '2px solid #ffffff';
    document.getElementById('profile-user-match').style.borderBottom = '0px solid #ffffff';
}
function view_matchs()
{
    // console.log("view_matchs");
    const modal = document.getElementById('view-matchs');
    modal.style.display = 'flex';
    document.getElementById('view-friends').style.display = 'none';
    document.getElementById('profile-user-match').style.borderBottom = '2px solid #ffffff';
    document.getElementById('profile-user-friend').style.borderBottom = '0px solid #ffffff';
    
}


