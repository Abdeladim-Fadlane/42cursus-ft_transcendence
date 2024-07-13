function ParceDate(date){
    let _date = date.substr(0, date.indexOf('T'));
    let _time = date.substr(date.indexOf('T') + 1 ,  date.indexOf('.') - (date.indexOf('T') + 1));
    return `${_date + ' ' + _time}`;
}
// function drawCircle(lose, win)
// {
//     let circle = document.querySelector('.circle');

//     let value_win = win;
//     let value_lose = lose;
//     let totale = value_win +value_lose;
//     let win = value_win * 100 / totale;
//     let lose = value_lose * 100 / totale;

//     let div_lose =  document.createElement('div');
//     let text_lose  = document.createElement('span');
//     text_lose.classList.add('text_lose' , 'text')

//     div_lose.classList.add('child');
//     let div_win =  document.createElement('div');
//     let text_win  = document.createElement('span');
//     text_win.classList.add('text_win' , 'text')
//     div_win.classList.add('child');

//     circle.append(div_lose, div_win);
//     circle.append(text_lose, text_win);
//     let circle_value = 0;
//     let i = 0;
//     let j = 0;
//     div_win.style.opacity =  '0.1';
//     div_lose.style.opacity  = '0.1'


//     setInterval(()=>{
//         if (i < win)
//         {
//             i++;
//             text_lose.textContent = `${i}%`
//             if (circle_value + 3.6 > 360)
//                 circle_value = 360;
//             else
//                 circle_value += 3.6;
//             div_win.style.background = `conic-gradient(blue ${circle_value}deg, white 0deg)`
//         }
//         else if (j < lose)
//         {
//             j++;
//             text_win.textContent = `${j}%`
//             if (circle_value + 3.6 > 360)
//                 circle_value = 360;
//             else
//                 circle_value += 3.6;
//             div_lose.style.background = `conic-gradient(red ${circle_value}deg, white 0deg)`
//         }
//     }, circle_value + 20)
// }
function view_profile(e)
{
    const modal = document.getElementById('content-user');
    let username = document.querySelector('.profile-user-info-username');
    let score = document.querySelector('.profile-user-info-score');
    let rank = document.querySelector('.profile-user-info-rank');
    let img_profile = document.querySelector('.profile-user-photo_profile');
    let dateCreatiomAccount = document.querySelector('.profile-user-dateCreationAccount');
    let firstname = document.querySelector('.profile-user-firstname');
    let lastname = document.querySelector('.profile-user-lastname');
    let email = document.querySelector('.profile-user-email');
    let status = document.querySelector('.profile-user-status-string');
    let status_color = document.querySelector('.profile-user-status-color');
    let statistique = document.querySelector('.circle');
    let win = document.querySelector('.win-statistique');
    let lose = document.querySelector('.lose-statistique');
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
            console.log(data);
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
                status_color.style.backgroundColor = 'red'
            }
            if (data.lose == '0' && data.lose == '0'){
                statistique.textContent = 'this player has no statistiques yet';
                statistique.className = 'no-statistique';
                lose.textContent = '0%';
                win.textContent = '0%'
            }
            else{
                console.log('has a statistique')
            }
        })
    })
    setInterval(()=>{
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
                    'username' : e.target.id,
                })
            })
            .then(response =>{
                if (response.ok != true)
                    console.log('error when fetching data of user by `/api/friend/`');
                return response.json();
            })
            .then(data=>{
                console.log(data.available);
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
    }, 2000);
    modal.style.display = 'flex';
}
function close_user_profile()
{
    const modal = document.getElementById('content-user');
    modal.style.display = 'none';
}
function view_friends()
{
    console.log("view_friends");
    const modal = document.getElementById('view-friends');
    modal.style.display = 'flex';
    document.getElementById('view-matchs').style.display = 'none';
    document.getElementById('profile-user-friend').style.borderBottom = '2px solid #ffffff';
    document.getElementById('profile-user-match').style.borderBottom = '0px solid #ffffff';
}
function view_matchs()
{
    console.log("view_matchs");
    const modal = document.getElementById('view-matchs');
    modal.style.display = 'flex';
    document.getElementById('view-friends').style.display = 'none';
    document.getElementById('profile-user-match').style.borderBottom = '2px solid #ffffff';
    document.getElementById('profile-user-friend').style.borderBottom = '0px solid #ffffff';
    
}