document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("pro").addEventListener('click', show);
    document.getElementById("playButton").addEventListener('click', playButton);
    document.getElementById("settingsButton").addEventListener('click', profile);
    document.getElementById('logoutButton').addEventListener('click', logout);
    document.getElementById('toggleFriends').addEventListener('click', toggleFriends);

    function playButton() {
        window.location.href = "http://127.0.0.1:8001/room/";
    }

    function show() {
        window.location.href = "/profile/";
    }

    function profile() {
        window.location.href = "/profile/";
    }

    function logout() {
        window.location.href = "/logout/";
    }

    function toggleFriends() {
        const friends = document.querySelector('.friends');
        friends.style.display = friends.style.display === 'none' ? 'block' : 'none';
    }

    const menuButton = document.getElementById('showMenu');
    const menu = document.getElementById('menu');

    if (menuButton && menu) {
        menuButton.addEventListener('click', function() {
            menu.classList.toggle('show');
        });
    }
});

