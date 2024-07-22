function initializePageState() {
  const urlParams = new URLSearchParams(window.location.search);
  const page = urlParams.get('page');

  if (!isValidPage(page)) {
    redirectTo404();
    return;
  }

  switch (page) {
    case 'home':
      border_home();
      break;
    case 'profile':
      border_pr();
      break;
    case 'chat':
      click_chat();
      break;
    default:
      border_home();
  }
}

function isValidPage(page) {
  console.log(page);
  const validPages = ['home', 'profile', 'chat',null];
  return validPages.includes(page);
}

function redirectTo404() {
  window.location.href = '/404.html'; // Redirect to your 404 page
}

window.onload = function() {
  initializePageState();
};

window.onpopstate = function(event) {
  if (event.state) {
    switch (event.state.page) {
      case 'home':
        border_home(false);
        break;
      case 'profile':
        border_pr(false);
        break;
      case 'chat':
        click_chat(false);
        break;
      default:
        border_home(false); 
    }
  }
};

function border_home(pushState = true) {
  document.getElementById('Home').style.borderBottom = '2px solid #bbb';
  document.getElementById('Home').style.padding = '5px';
  document.getElementById('Pr').style.borderBottom = '0px solid #bbb';

  if (pushState) {
    window.history.pushState({page: 'home'}, 'Home', '?page=home');
  }

  document.getElementById("home").style.display = "flex";
  document.getElementById("profile").style.display = "none";
  document.getElementById("chat").style.display = "none";
}

function border_pr(pushState = true) {
  document.getElementById('Home').style.borderBottom = '0px solid #bbb';
  document.getElementById('Pr').style.padding = '5px';
  document.getElementById('Pr').style.borderBottom = '2px solid #bbb';

  if (pushState) {
    window.history.pushState({page: 'profile'}, 'Profile', '?page=profile');
  }

  document.getElementById("home").style.display = "none";
  document.getElementById("profile").style.display = "flex";
  document.getElementById("chat").style.display = "none";
}

function click_chat(pushState = true) {
  console.log("chat");
  document.getElementById('Home').style.borderBottom = '0px solid #bbb';
  document.getElementById('Pr').style.borderBottom = '0px solid #bbb';

  if (pushState) {
    window.history.pushState({page: 'chat'}, 'Chat', '?page=chat');
  }

  document.getElementById("home").style.display = "none";
  document.getElementById("profile").style.display = "none";
  document.getElementById("chat").style.display = "flex";
}







  let currentFriend = null;
  
  function openChat(friendName) {
      currentFriend = friendName;
      document.getElementById('chat-friend-name').textContent = `Chat with ${friendName}`;
      document.getElementById('chat-messages').innerHTML = ''; // Clear previous messages
  }
  
  function sendMessage() {
      const messageInput = document.getElementById('message-input');
      const message = messageInput.value.trim();
      
      if (message && currentFriend) {
          const chatMessages = document.getElementById('chat-messages');
          
          const messageElement = document.createElement('div');
          messageElement.className = 'chat-message sent';
          messageElement.innerHTML = `<p class=\"message\">${message}</p>`;
          
          chatMessages.appendChild(messageElement);
          messageInput.value = '';
          
          // Simulate receiving a reply
          setTimeout(() => {
              const replyElement = document.createElement('div');
              replyElement.className = 'chat-message received';
              replyElement.innerHTML = `<p>Reply from ${currentFriend}</p>`;
              chatMessages.appendChild(replyElement);
              chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to bottom
          }, 1000);
      }
  }

    function showLogoutModal() {
    const modal = document.getElementById('logout-modal');
    modal.style.display = 'flex';
  }
  
  function closeLogoutModal() {
    const modal = document.getElementById('logout-modal');
    modal.style.display = 'none';
  }
  
  function logout() {
    // Clear any stored session or user data
    localStorage.clear();
    sessionStorage.clear();
    
    // Redirect to the login page (assuming login.html is your login page)
    window.location.href = '/logout/';
  }

  function showSettingsModal() {
    fetch('/api/data/')
    .then(response => { return response.json()})
    .then(data =>{
      console.log(data);
      document.querySelector('#username').value = data.username;
      document.querySelector('#email').value = data.email;
      document.querySelector('#first_name').value = data.first_name;
      document.querySelector('#last_name').value = data.last_name;
    })
    const modal = document.getElementById('settings-modal');
    modal.style.display = 'flex';
    
  }
  
  function closeSettingsModal() {
    const modal = document.getElementById('settings-modal');
    modal.style.display = 'none';
  }
  
  
  function showNotificationsModal() {
    
    const modal = document.getElementById('notifi');
    modal.style.display = 'flex';
  }
  function closeNotificationsModal() {
    const modal = document.getElementById('notifi');
    modal.style.display = 'none';
  }
