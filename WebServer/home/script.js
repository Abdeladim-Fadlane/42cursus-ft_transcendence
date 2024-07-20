

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById('Home').style.borderBottom = '2px solid #bbb';

    const links = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll(".content-section");
    links.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const targetId = this.getAttribute("data-target");
        // console.log(targetId);
  
        sections.forEach((section) => {
          if (section.id === targetId) {
            section.style.display = "flex";
          } else {
            section.style.display = "none";
          }
        });
      });
    });
    // Initial state
    document.getElementById("home").style.display = "flex";
    document.getElementById("profile").style.display = "none";
    document.getElementById("chat").style.display = "none";
    document.getElementById("notifi").style.display = "none";
    // document.getElementById("setting").style.display = "none";
  });
  
  function border_home()
  {
    document.getElementById('Home').style.borderBottom = '2px solid #bbb';
    document.getElementById('Home').style.padding = '5px';
    document.getElementById('Pr').style.borderBottom = '0px solid #bbb';
    

  }
  function border_pr()
  {
    document.getElementById('Home').style.borderBottom = '0px solid #bbb';
    document.getElementById('Pr').style.padding = '5px';

    document.getElementById('Pr').style.borderBottom = '2px solid #bbb';
    

  }
  function click_chat()
  {
    document.getElementById('Home').style.borderBottom = '0px solid #bbb';
    document.getElementById('Pr').style.borderBottom = '0px solid #bbb';
    // document.getElementById('chat_icon').style.borderBottom = '2px solid #bbb';
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
