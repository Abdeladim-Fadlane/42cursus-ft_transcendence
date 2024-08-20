function loadHomeContent() {
    document.getElementById('head-page').style.display = 'none';
    document.getElementById('home-page').style.display = 'block';
    fetch("../home/index.html")
        .then(response => response.text())
        .then(html => {
            // Insert the loaded content into the home container
            document.getElementById("home-page").innerHTML = html;

            // Hide login container and show home container
            

            // Enable the home CSS
            // document.getElementById("home-style").disabled = false;
        })
        .then(() => {
            loadCSS('../home/style.css');
                removeCSS('./index.css');
                
        })
        .then(() => {
            const script = loadScript('./script2.js');
                document.head.appendChild(script);
                const invite = loadScriptnotmodul('./invite.js');
                document.head.appendChild(invite);
                const leadr = loadScriptnotmodul('./leader.js');
                document.head.appendChild(leadr);
                const data = loadScriptnotmodul('./data.js');
                document.head.appendChild(data);
                const match = loadScriptnotmodul('./match.js');
                document.head.appendChild(match);
                const notifi = loadScriptnotmodul('./notif.js');
                document.head.appendChild(notifi);
                const suggest = loadScriptnotmodul('./suggest.js');
                document.head.appendChild(suggest);
                const msgfriend = loadScriptnotmodul('./msgfriend.js');
                document.head.appendChild(msgfriend);
                const track = loadScriptnotmodul('./track.js');
                document.head.appendChild(track);
                const chatScript = loadScriptnotmodul('./chatScript.js');
                document.head.appendChild(chatScript);
                const setting = loadScript('./setting.js');
                document.head.appendChild(setting);
                const game = loadScript('./game.js');
                document.head.appendChild(game);
                const search = loadScriptnotmodul('./search.js');
                document.head.appendChild(search);
                const userInformation = loadScriptnotmodul('./userInformation.js');
                document.head.appendChild(userInformation);
                const ProfileAction = loadScriptnotmodul('./ProfileAction.js');
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


function already_logged() {
    fetch('/api/already_logged/')
        .then(response => {
            if (response.ok) {
                return response.json();
            }
        })
        .then(data => {
            // console.log(data);
            
            if (data.status === true){
                 loadHomeContent();
        }
            
        })
}

function loadScript (src){
    const script = document.createElement('script');
    script.src = src;
    script.defer = true;
    // script.type = 'module';
    return script;
};

function loadScriptnotmodul (src){
    const script = document.createElement('script');
    script.src = src;
    script.defer = true;
    script.type = 'module';
    return script;
};


document.addEventListener('DOMContentLoaded', () => {
   
    already_logged();
    fetch('/api/csrf-token/')
        .then(response => response.json())
        .then(data => {
            document.getElementById('csrfToken1').value = data.csrfToken;
        })
        .catch(error => console.error('Error fetching CSRF token:', error));
    });
    document.getElementById('login-form-id').addEventListener('submit', async function(event) {
        event.preventDefault();
        const formData = new FormData(this);
        const csrfToken = document.getElementById('csrfToken1').value;
    
        try {
            const response = await fetch('/loginuser/', {
                method: 'POST',
                body: formData,
                headers: {'X-CSRFToken': csrfToken}
            });
            
            const data = await response.json();
    
            if (data.status === true) {
                loadHomeContent(); // Assuming loadHomeContent is an async function
            } else {
                document.getElementById('messages').innerHTML = 'Invalid username or password';
                document.getElementById('messages').style.color = 'red';
            }
        } catch (error) {
            console.error('Error during login:', error);
            document.getElementById('messages').innerHTML = 'An error occurred';
            document.getElementById('messages').style.color = 'red';
        }
    });
    

function ft_sign_up() {
    
    const modal1 = document.getElementById('login-form');
    modal1.style.display = 'none';
    const modal = document.getElementById('sign-up-form');
    modal.style.display = 'flex';
    window.history.pushState({page: ''}, '', '?page=sign-up');
    
  }


function ft_sign_in() {
// console.log('hello2');

const modal1 = document.getElementById('sign-up-form');
modal1.style.display = 'none';
const modal = document.getElementById('login-form');
modal.style.display = 'flex';
window.history.pushState({page: ''}, '', '?page=login');
}
  function closeLogoutModal() {
    
    const modal1 = document.getElementById('sign-up-form');
    modal1.style.display = 'none';
    const modal = document.getElementById('login-form');
    modal.style.display = 'none';
  }
  document.getElementById('sign-up-form').addEventListener('click', function(event) {
    if (event.target === this) {
        closeLogoutModal();
    }
  });
  document.getElementById('login-form').addEventListener('click', function(event) {
    if (event.target === this) {
        closeLogoutModal();
    }
  });
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
});