document.getElementById('profil').addEventListener('click', function() {
    document.getElementById('image').click();
});
function closedelete() {
    document.getElementById('modal_delete').style.display = 'none';
}
function delete_funcyion()
{
    document.getElementById('modal_delete').style.display = 'flex';
    // document.getElementById('settings-modal').style.display = 'none';
}

document.getElementById('modal_delete').addEventListener('click', function(event) {
    if (event.target === this) {
        closedelete();
    }
  });
function openTab(event, tabName) {
    if (tabName === 'profile-data') {
        document.querySelector('.personil-data').style.display = 'flex';
        document.querySelector('.form-container-pass').style.display = 'none';
        document.querySelector('.menu-item1').style = 'background-color: #ffffff9b; color: #000000; font-size: 22px;';
        document.querySelector('.menu-item2').style = 'font-size: 20px; color: ##66657700;';
    }
    else if (tabName === 'profile-password') {
        document.querySelector('.personil-data').style.display = 'none';
        document.querySelector('.form-container-pass').style.display = 'flex';
        document.querySelector('.menu-item2').style = 'background-color: #ffffff9b; color: #000000; font-size: 22px;';
        document.querySelector('.menu-item1').style = 'font-size: 20px; color: ##66657700;';
    }
}