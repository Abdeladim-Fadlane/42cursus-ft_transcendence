

function already_logged() {
    fetch('/api/already_logged/')
        .then(response => {
            if (response.ok) {
                return response.json();
            }
        })
        .then(data => {
            if (data.status === true)
                window.location.href = "/home/";
        })
}

document.addEventListener('DOMContentLoaded', function() {
    already_logged();
    fetch('/api/csrf-token/')
        .then(response => response.json())
        .then(data => {
            document.getElementById('csrfToken1').value = data.csrfToken;
        })
        .catch(error => console.error('Error fetching CSRF token:', error));
    });
    document.getElementById('login-form-id').addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(this);
        const csrfToken = document.getElementById('csrfToken1').value;
        fetch('/loginuser/', {
            method: 'POST',
            body: formData,
            headers: {'X-CSRFToken': csrfToken,}
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === true) {
                    window.location.href = "/home/";
            } else {
                document.getElementById('messages').innerHTML = 'Invalid username or password';
                document.getElementById('messages').style.color = 'red';
            }
        })

});

function ft_sign_up() {
    
    const modal1 = document.getElementById('login-form');
    modal1.style.display = 'none';
    const modal = document.getElementById('sign-up-form');
    modal.style.display = 'flex';
    
  }


function ft_sign_in() {
console.log('hello2');

const modal1 = document.getElementById('sign-up-form');
modal1.style.display = 'none';
const modal = document.getElementById('login-form');
modal.style.display = 'flex';
}
  function closeLogoutModal() {
    console.log('hello3');
    const modal1 = document.getElementById('sign-up-form');
    modal1.style.display = 'none';
    const modal = document.getElementById('login-form');
    modal.style.display = 'none';
  }
document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/csrf-token/')
        .then(response => response.json())
        .then(data => {
            document.getElementById('csrfToken').value = data.csrfToken;
        })
    document.getElementById('login-form-id2').addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(this);
        const csrfToken = document.getElementById('csrfToken').value;
        fetch('/registeruser/', {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': csrfToken,
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === true) {

                const modal1 = document.getElementById('sign-up-form');
                modal1.style.display = 'none';
                const modal = document.getElementById('login-form');
                modal.style.display = 'flex';
            } 
            else
            {
                if (data.error.email != undefined)
                {
                    console.log(data.error);
                    document.getElementById('messageemail').innerHTML = data.error.email;
                    document.getElementById('messageemail').style.color = 'red';
                }
                else
                    document.getElementById('messageemail').innerHTML = '';
                if (data.error.username != undefined)
                {
                    document.getElementById('messageusername').innerHTML = data.error.username;
                    document.getElementById('messageusername').style.color = 'red';
                }
                else
                    document.getElementById('messageusername').innerHTML = '';
                if (data.error.password1 != undefined)
                {
                    document.getElementById('messagepassword').innerHTML = data.error.password1;
                    document.getElementById('messagepassword').style.color = 'red';
                }
                else
                    document.getElementById('messagepassword').innerHTML = '';
                if (data.error.password2 != undefined)
                {
                    document.getElementById('messagepassword2').innerHTML = data.error.password2;
                    document.getElementById('messagepassword2').style.color = 'red';
                }
                else
                    document.getElementById('messagepassword2').innerHTML = '';
            }
        })
    });
});