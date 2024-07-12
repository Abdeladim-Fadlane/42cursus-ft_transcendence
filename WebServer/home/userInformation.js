function ParceDate(date){
    let _date = date.substr(0, date.indexOf('T'));
    let _time = date.substr(date.indexOf('T') + 1 ,  date.indexOf('.') - (date.indexOf('T') + 1));
    return `${_date} ${_time}`;
}
function view_profile(e)
{
    const modal = document.getElementById('content-user');
    modal.style.display = 'flex';
    let username = document.querySelector('.profile-user-info-username');
    let score = document.querySelector('.profile-user-info-score');
    let rank = document.querySelector('.profile-user-info-rank');
    let img_profile = document.querySelector('.profile-user-photo_profile');
    let dateCreatiomAccount = document.querySelector('.profile-user-dateCreationAccount');
    let firstname = document.querySelector('.profile-user-firstname');
    let lastname = document.querySelector('.profile-user-lastname');
    let email = document.querySelector('.profile-user-email');
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
            
        })
    })
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