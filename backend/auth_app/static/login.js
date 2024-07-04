// backend/auth_app/static/login.js

document.addEventListener("DOMContentLoaded", function() {

    document.getElementById("loginButton").addEventListener('click', login);

    function login() {
        window.location.href = "/redirect/"
    }
    
});    
