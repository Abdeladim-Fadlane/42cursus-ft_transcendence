// document.addEventListener('DOMContentLoaded', () => {
//     const signUpButton = document.getElementById('signup-button');
//     const targetElement = document.getElementById('ball');
//     const parentElement = document.getElementById('container');
//     const lineElement = document.getElementById('line');


//     signUpButton.addEventListener('click', () => {
//         // Pause the animation

//         targetElement.className = "centered";
//         targetElement.style.animationPlayState = 'none';
//         lineElement.className = "nline";

//         // Get the dimensions of the parent container and the ball
//         const parentWidth = parentElement.offsetWidth;
//         const parentHeight = parentElement.offsetHeight;
//         const ballWidth = targetElement.offsetWidth;
//         const ballHeight = targetElement.offsetHeight;

//         // Calculate the position to center the ball
//         const leftPosition = (parentWidth - ballWidth) / 2;
//         const topPosition = (parentHeight - ballHeight) / 2;

//         // Set the new position of the ball
//         targetElement.style.left = `${leftPosition}px`;
//         targetElement.style.top = `${topPosition}px`;


//         targetElement.style.animationPlayState = 'paused';
//         // Print information about the target element
//         console.log(`Element resized to ${ballWidth}px by ${ballHeight}px and centered at (${leftPosition}px, ${topPosition}px)`);
//     });
// });

// document.addEventListener('DOMContentLoaded', function() {
//     already_logged();
//     const links = document.querySelectorAll('.nav-link');
//     const sections = document.querySelectorAll('.content-section');

//     links.forEach(link => {
//         link.addEventListener('click', function(e) {
//             e.preventDefault();
//             const targetId = this.getAttribute('data-target');

//             sections.forEach(section => {
//                 if (section.id === targetId) {
//                     section.style.display = 'flex';
//                 } else {
//                     section.style.display = 'none';
//                 }
//             });
//         });
//     });

//     // Show the home section by default
//     // document.getElementById('home').style.display = 'flex';
//     // document.getElementById('chat').style.display = 'none';

//     // document.getElementById('profile').style.display = 'none';

// });


  
function already_logged() {
    fetch('/api/already_logged/')
        .then(response => {
            if (response.ok) {
                return response.json();
            }
        })
        .then(data => {
            if (data.logged)
                window.location.href = "/home/";
        })
}

document.addEventListener('DOMContentLoaded', function() {
    // already_logged();
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
            if (data.alert === 'ok') {
                    window.location.href = "/home/";
            } else {
                document.getElementById('messages').innerHTML =  data.alert;
                document.getElementById('messages').style.color = 'red';
            }
        })
        .catch(error => {
            document.getElementById('messages').innerHTML = error;
            document.getElementById('messages').style.color = 'red';
        });
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
        .catch(error => console.error('Error fetching CSRF token:', error));
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

                // window.location.href = "/";
                const modal1 = document.getElementById('sign-up-form');
                modal1.style.display = 'none';
                const modal = document.getElementById('login-form');
                modal.style.display = 'flex';
            } 
            else
            {
                if (data.error.username != undefined)
                {
                    document.getElementById('messageusername').innerHTML = data.error.username;
                    document.getElementById('messageusername').style.color = 'red';
                }
                else
                    document.getElementById('messageusername').innerHTML = '';
                if (data.error.password2 != undefined)
                {
                    document.getElementById('messagepassword2').innerHTML = data.error.password2;
                    document.getElementById('messagepassword2').style.color = 'red';
                }
                else
                    document.getElementById('messagepassword2').innerHTML = '';
            }
        })
        .catch(error => {
            document.getElementById('messages').innerHTML = error;
            document.getElementById('messages').style.color = 'red';
            
        });
    });
});