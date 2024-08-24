function loadHomeContent() {
    document.getElementById('home-page').innerHTML;

    document.getElementById('home-page').style.display = 'block';
    document.getElementById('head-page').style.display = 'none';
    document.getElementById('head-page').innerHTML = '';
    fetch("../home/index.html")
        .then(response => response.text())
        .then(html => {
            // Insert the loaded content into the home container
            document.getElementById("home-page").innerHTML = html;
        })
        .then(() => {
            loadCSS('../home/style.css');
                removeCSS('./landing/index.css');
                
        })
        .then(() => {
            const script = loadScript('./js/script2.js');
                document.head.appendChild(script);
                const invite = loadScriptnotmodul('./js/invite.js');
                document.head.appendChild(invite);
                const leadr = loadScriptnotmodul('./js/leader.js');
                document.head.appendChild(leadr);
                const token = loadScriptnotmodul('./js/token.js');
                document.head.appendChild(token);
                const data = loadScriptnotmodul('./js/data.js');
                document.head.appendChild(data);
                const match = loadScriptnotmodul('./js/match.js');
                document.head.appendChild(match);
                const notifi = loadScriptnotmodul('./js/notif.js');
                document.head.appendChild(notifi);
                const suggest = loadScriptnotmodul('./js/suggest.js');
                document.head.appendChild(suggest);
                const msgfriend = loadScriptnotmodul('./js/msgfriend.js');
                document.head.appendChild(msgfriend);
                const track = loadScriptnotmodul('./js/track.js');
                document.head.appendChild(track);
                const chatScript = loadScriptnotmodul('./js/chatScript.js');
                document.head.appendChild(chatScript);
                const setting = loadScript('./js/setting.js');
                document.head.appendChild(setting);
                const game = loadScript('./js/game.js');
                document.head.appendChild(game);
                const search = loadScriptnotmodul('./js/search.js');
                document.head.appendChild(search);
                const userInformation = loadScriptnotmodul('./js/userInformation.js');
                document.head.appendChild(userInformation);
                const ProfileAction = loadScriptnotmodul('./js/ProfileAction.js');
                document.head.appendChild(ProfileAction);
                
        })
        .catch(error => console.error('Error loading home content:', error));
}
function loadCSS(file) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = file;
    document.head.appendChild(link);
}
function removeCSS(file) {
    const linkElement = document.querySelector(`link[href="${file}"]`);
    if (linkElement) {
        linkElement.parentNode.removeChild(linkElement);
    }
}


function loginUser(e){
   e.preventDefault();
    console.log('hello akatfi');
}
// document.addEventListener('DOMContentLoaded', () => {
//    console.log('hello akatfi');

// loginUser();
    

// });

console.log("script");
document.querySelector('#form-login').addEventListener('submit', async(e)=>
{
    e.preventDefault();
    let csrfToken = e.target.querySelector('#csrfToken13')
    await fetch('/api/csrf-token/')
    .then(response => {
        if (response.ok) {
            return response.json();
        }
    })
    .then(data =>{
        csrfToken.value = data.csrfToken;
    })
    console.log(csrfToken.value)
    console.log(e.target)
    const form = new FormData(e.target);
    await fetch('/loginuser/', {
        method: 'POST',
        headers: {
            'CSRF-Token': csrfToken.value
        },
        body: form
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
    })
    .then(data => {
        console.log(data);
        if (data.status === true){
            loadHomeContent();
        }
        else {
            document.getElementById('messages').innerHTML = 'Invalid username or password';
            document.getElementById('messages').style.color = 'red';
        }
    })
});

document.querySelector('#login-form-id2').addEventListener('submit', async(e)=>
{
    e.preventDefault();
    let csrfToken = e.target.querySelector('#csrfToken')
    await fetch('/api/csrf-token/')
    .then(response => {
        if (response.ok) {
            return response.json();
        }
    })
    .then(data =>{
        csrfToken.value = data.csrfToken;
    })
    console.log(csrfToken.value)
    console.log(e.target)
    const form = new FormData(e.target);
    await fetch('/registeruser/', {
        method: 'POST',
        headers: {
            'CSRF-Token': csrfToken.value
        },
        body: form
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
    })
    .then(data => {
        console.log(data);
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
                // console.log(data.error);
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
    
    

function ft_sign_up() {
    
    const modal1 = document.getElementById('login-form');
    modal1.style.display = 'none';
    const modal = document.getElementById('sign-up-form');
    modal.style.display = 'flex';
    // window.history.pushState({page: ''}, '', '?page=sign-up');
    
  }


function ft_sign_in() {
// console.log('hello2');

const modal1 = document.getElementById('sign-up-form');
modal1.style.display = 'none';
const modal = document.getElementById('login-form');
modal.style.display = 'flex';
// window.history.pushState({page: ''}, '', '?page=login');
}
  function closeLogoutModal() {
    
    const modal1 = document.getElementById('sign-up-form');
    modal1.style.display = 'none';
    const modal = document.getElementById('login-form');
    modal.style.display = 'none';
  }
  const sign_up = document.getElementById('sign-up-form');
  if (sign_up) {

  sign_up.addEventListener('click', function(event) {
    if (event.target === this) {
        closeLogoutModal();
    }
  });
}
const login_form = document.getElementById('login-form');
if (login_form) {
    login_form.addEventListener('click', function(event) {
    if (event.target === this) {
        closeLogoutModal();
    }
  });
}