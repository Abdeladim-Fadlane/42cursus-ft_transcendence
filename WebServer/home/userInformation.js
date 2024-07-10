function view_profile()
{
    const modal = document.getElementById('content-user');
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