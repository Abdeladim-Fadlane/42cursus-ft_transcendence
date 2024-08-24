// console.log('Script 2 loaded');


function delete_account() {
  fetch('/api/delete_account/')
  .then(response => response.json())
  .then(data => {
      window.location.href = '/';
      // console.log('Account deleted');
  })
  .catch(error => {
      console.error('Error deleting account:', error);
  });
};


function initializePageState() {


  
  const urlParams = new URLSearchParams(window.location.search);
  const page = urlParams.get('page');

  if (!isValidPage(page)) {
    redirectTo404();
    return;
  }

  // console.log(page);
  
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
    case 'rank':
      rank();
      break;
    default:
      border_home();
  }
}

function isValidPage(page) {
  // console.log(page);
  const validPages = ['home', 'profile', 'chat','rank','sign-up','login',null];
  return validPages.includes(page);
}

function redirectTo404() {
  window.location.href = '/404.html'; // Redirect to your 404 page
}

initializePageState();
// console.log('Script running');
// if (document.readyState === 'complete') {
//     console.log('complete');
// } else {
//      initializePageState();
//     console.log('onload set');
// }


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
      case 'rank':
        rank(false);
        break;
      case 'sign-up':
        border_home(false); 
        break;
      case 'login':
        border_home(false);
        break;
      default:
        border_home(false); 
    }
  }
};

function rank(pushState = true) {
  if (pushState) {
    window.history.pushState({page: 'rank'}, 'Rank', '?page=rank');
  }
  const home = document.getElementById("home");
  const profile = document.getElementById("profile");
  const chat = document.getElementById("chat");
  const ranking = document.getElementById("rank");
  const Home_aside = document.getElementById('Home-aside');
  const rank_aside = document.getElementById('rank-aside');
  const Pr_aside = document.getElementById('Pr-aside'); 
  const chat_aside = document.getElementById('chat-aside');
  const notif_aside = document.getElementById('notif-aside');
  const setting_aside = document.getElementById('setting-aside');
  const logout_aside = document.getElementById('logout-aside');

  if (home) {
    home.style.display = "none";
  }

  if (profile) {
    profile.style.display = "none";
  }
  if (chat) {
    chat.style.display = "none";
  }
  if (ranking) {
    ranking.style.display = "flex";
  }

  if (Home_aside) {
    Home_aside.style.cssText = 'font-size: 36px; color: #ffffffbc; ';
  }
  if (rank_aside) {
    rank_aside.style.cssText = 'font-size: 40px; color: #ff44e4; ';
  }

  if (Pr_aside) {
    Pr_aside.style.cssText = 'font-size: 36px; color: #ffffffbc; ';
  }

  if (chat_aside) {
    chat_aside.style.cssText = 'font-size: 36px; color: #ffffffbc; ';
  }

  if (notif_aside) {
    notif_aside.style.cssText = 'font-size: 36px; color: #ffffffbc; ';
  }

  if (setting_aside) {
    setting_aside.style.cssText = 'font-size: 36px; color: #ffffffbc; ';
  }

  if (logout_aside) {
    logout_aside.style.cssText = 'font-size: 36px; color: #ffffffbc; ';
  }

  // document.getElementById("profile").style.display = "none";
  // document.getElementById("chat").style.display = "none";
  // document.getElementById("rank").style.display = "flex";

  // document.getElementById('Home-aside').style.cssText = 'font-size: 36px; color: #ffffffbc; ';
  // document.getElementById('rank-aside').style.cssText = 'font-size: 40px; color: #ff44e4; ';
  // document.getElementById('Pr-aside').style.cssText = 'font-size: 36px; color: #ffffffbc; ';
  // document.getElementById('chat-aside').style.cssText = 'font-size: 36px; color: #ffffffbc; ';
  // document.getElementById('notif-aside').style.cssText = 'font-size: 36px; color: #ffffffbc; ';
  // document.getElementById('setting-aside').style.cssText = 'font-size: 36px; color: #ffffffbc; ';
  // document.getElementById('logout-aside').style.cssText = 'font-size: 36px; color: #ffffffbc; ';
}

function border_home(pushState = true) {
  // console.log("home");
  if (pushState) {
    window.history.pushState({page: 'home'}, 'Home', '?page=home');
  }

  const home = document.getElementById("home");
  const profile = document.getElementById("profile");
  const chat = document.getElementById("chat");
  const ranking = document.getElementById("rank");
  const Home_aside = document.getElementById('Home-aside');
  const rank_aside = document.getElementById('rank-aside');
  const Pr_aside = document.getElementById('Pr-aside'); 
  const chat_aside = document.getElementById('chat-aside');
  const notif_aside = document.getElementById('notif-aside');
  const setting_aside = document.getElementById('setting-aside');
  const logout_aside = document.getElementById('logout-aside');

  if (home) {
    home.style.display = "flex";
  }

  if (profile) {
    profile.style.display = "none";
  }
  if (chat) {
    chat.style.display = "none";
  }
  if (ranking) {
    ranking.style.display = "none";
  }

  if (Home_aside) {
    Home_aside.style.cssText = 'font-size: 40px; color: #ff44e4; ';
  }
  if (rank_aside) {
    rank_aside.style.cssText = 'font-size: 36px; color: #ffffffbc; ';
  }

  if (Pr_aside) {
    Pr_aside.style.cssText = 'font-size: 36px; color: #ffffffbc; ';
  }

  if (chat_aside) {
    chat_aside.style.cssText = 'font-size: 36px; color: #ffffffbc; ';
  }

  if (notif_aside) {
    notif_aside.style.cssText = 'font-size: 36px; color: #ffffffbc; ';
  }

  if (setting_aside) {
    setting_aside.style.cssText = 'font-size: 36px; color: #ffffffbc; ';

  }

  if (logout_aside) {
    logout_aside.style.cssText = 'font-size: 36px; color: #ffffffbc; ';
  }


  // document.getElementById("home").style.display = "flex";
  // document.getElementById("profile").style.display = "none";
  // document.getElementById("chat").style.display = "none";
  // document.getElementById("rank").style.display = "none";
  // document.getElementById('rank-aside').style.cssText = 'font-size: 36px; color: ffffffbc; ';
  // document.getElementById('Home-aside').style.cssText = 'font-size: 40px; color: #ff44e4; ';
  // document.getElementById('Pr-aside').style.cssText = 'font-size: 36px; color: #ffffffbc; ';
  // document.getElementById('chat-aside').style.cssText = 'font-size: 36px; color: ffffffbc; ';
  // document.getElementById('notif-aside').style.cssText = 'font-size: 36px; color: ffffffbc; ';
  // document.getElementById('setting-aside').style.cssText = 'font-size: 36px; color: ffffffbc; ';
  // document.getElementById('logout-aside').style.cssText = 'font-size: 36px; color: ffffffbc; ';

}

function border_pr(pushState = true) {
    document.getElementById('Pr-aside').style.borderBottom = '2px solid #bbb';

    if (pushState) {
      window.history.pushState({page: 'profile'}, 'Profile', '?page=profile');
    }

    const home = document.getElementById("home");
  const profile = document.getElementById("profile");
  const chat = document.getElementById("chat");
  const ranking = document.getElementById("rank");
  const Home_aside = document.getElementById('Home-aside');
  const rank_aside = document.getElementById('rank-aside');
  const Pr_aside = document.getElementById('Pr-aside'); 
  const chat_aside = document.getElementById('chat-aside');
  const notif_aside = document.getElementById('notif-aside');
  const setting_aside = document.getElementById('setting-aside');
  const logout_aside = document.getElementById('logout-aside');

  if (home) {
    home.style.display = "none";
  }

  if (profile) {
    profile.style.display = "flex";
  }
  if (chat) {
    chat.style.display = "none";
  }
  if (ranking) {
    ranking.style.display = "none";
  }

  if (Home_aside) {
    Home_aside.style.cssText = 'font-size: 40px; color: #ffffffbc; ';
  }
  if (rank_aside) {
    rank_aside.style.cssText = 'font-size: 36px; color: #ffffffbc; ';
  }

  if (Pr_aside) {
    Pr_aside.style.cssText = 'font-size: 36px; color: #ff44e4; ';
  }

  if (chat_aside) {
    chat_aside.style.cssText = 'font-size: 36px; color: #ffffffbc; ';
  }

  if (notif_aside) {
    notif_aside.style.cssText = 'font-size: 36px; color: #ffffffbc; ';
  }

  if (setting_aside) {
    setting_aside.style.cssText = 'font-size: 36px; color: #ffffffbc; ';

  }

  if (logout_aside) {
    logout_aside.style.cssText = 'font-size: 36px; color: #ffffffbc; ';
  }

    // document.getElementById("home").style.display = "none";
    // document.getElementById("profile").style.display = "flex";
    // document.getElementById("chat").style.display = "none";
    // document.getElementById("rank").style.display = "none";
    // document.getElementById('rank-aside').style.cssText = 'font-size: 36px; color: #ffffffbc; ';
    // document.getElementById('Home-aside').style.cssText = 'font-size: 36px; color: #ffffffbc; ';
    // document.getElementById('Pr-aside').style.cssText = 'font-size: 40px; color: #ff44e4; ';
    // document.getElementById('chat-aside').style.cssText = 'font-size: 36px; color: #ffffffbc; ';

    // document.getElementById('notif-aside').style.cssText = 'font-size: 36px; color: #ffffffbc; ';
    // document.getElementById('setting-aside').style.cssText = 'font-size: 36px; color: #ffffffbc; ';
    // document.getElementById('logout-aside').style.cssText = 'font-size: 36px; color: #ffffffbc; ';
}

function click_chat(pushState = true) {
  // console.log("chat");
  if (pushState) {
    window.history.pushState({page: 'chat'}, 'Chat', '?page=chat');
  }

  const home = document.getElementById("home");
  const profile = document.getElementById("profile");
  const chat = document.getElementById("chat");
  const ranking = document.getElementById("rank");
  const Home_aside = document.getElementById('Home-aside');
  const rank_aside = document.getElementById('rank-aside');
  const Pr_aside = document.getElementById('Pr-aside'); 
  const chat_aside = document.getElementById('chat-aside');
  const notif_aside = document.getElementById('notif-aside');
  const setting_aside = document.getElementById('setting-aside');
  const logout_aside = document.getElementById('logout-aside');

  if (home) {
    home.style.display = "none";
  }

  if (profile) {
    profile.style.display = "none";
  }
  if (chat) {
    chat.style.display = "flex";
  }
  if (ranking) {
    ranking.style.display = "none";
  }

  if (Home_aside) {
    Home_aside.style.cssText = 'font-size: 40px; color: #ffffffbc; ';
  }
  if (rank_aside) {
    rank_aside.style.cssText = 'font-size: 36px; color: #ffffffbc; ';
  }

  if (Pr_aside) {
    Pr_aside.style.cssText = 'font-size: 36px; color: #ffffffbc; ';
  }

  if (chat_aside) {
    chat_aside.style.cssText = 'font-size: 36px; color: #ff44e4; ';
  }

  if (notif_aside) {
    notif_aside.style.cssText = 'font-size: 36px; color: #ffffffbc; ';
  }

  if (setting_aside) {
    setting_aside.style.cssText = 'font-size: 36px; color: #ffffffbc; ';

  }

  if (logout_aside) {
    logout_aside.style.cssText = 'font-size: 36px; color: #ffffffbc; ';
  }

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
  //   document.getElementById('Home-aside').style.cssText = 'font-size: 36px; color: ##ffffffbc; ';
  // document.getElementById('Pr-aside').style.cssText = 'font-size: 36px; color: ##ffffffbc; ';
  // document.getElementById('chat-aside').style.cssText = 'font-size: 36px; color: ##ffffffbc; ';
  // document.getElementById('notif-aside').style.cssText = 'font-size: 36px; color: ##ffffffbc; ';
  // document.getElementById('setting-aside').style.cssText = 'font-size: 36px; color: ##ffffffbc; ';
  // document.getElementById('logout-aside').style.cssText = 'font-size: 40px; color: #ff44e4 ';
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

  // Debugging: Check if session and local storage are cleared
  // console.log("Local storage after clear:", localStorage);
  // console.log("Session storage after clear:", sessionStorage);

  // // Reset page layout
  // const headPage = document.getElementById('head-page');
  // const homePage = document.getElementById('home-page');

  // if (headPage && homePage) {
  //     headPage.style.display = 'flex';
  //     homePage.innerHTML = '';
  //     homePage.style.display = 'none';
  // } else {
  //     console.error("Element 'head-page' or 'home-page' not found.");
  // }

  // Remove old CSS and load new CSS
  // if (typeof removeCSS === "function" && typeof loadCSS === "function") {
  //     removeCSS('../home/style.css');
  //     loadCSS('./index.css');
  // } else {
  //     console.error("removeCSS or loadCSS function not defined.");
  // }

  // // Scripts to remove
  // const scriptsToRemove = [
  //     './game.js',
  //     './invite.js',
  //     './leader.js',
  //     './data.js',
  //     './match.js',
  //     './notif.js',
  //     './suggest.js',
  //     './msgfriend.js',
  //     './track.js',
  //     './chatScript.js',
  //     './setting.js',
  //     './search.js',
  //     './userInformation.js',
  //     './ProfileAction.js',
  //     './script2.js'
  // ];

  
  // scriptsToRemove.forEach((src) => {
  //     const script = document.querySelector(`script[src="${src}"]`);
  //     if (script) {
  //         script.remove();
          
  //     } else {
  //         console.error(`Script not found: ${src}`);
  //     }
  // });

  
  // console.log("Remaining scripts in head:", document.querySelectorAll('script'));

  // Optionally, redirect to the login page
  window.location.href = '/logout/';
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
  function showSettingsModal() {
    fetch('/api/data/')
    .then(response => { return response.json()})
    .then(data =>{
      // console.log(data);
      document.querySelector('#username').value = data.username;
      document.querySelector('#email').value = data.email;
      document.querySelector('#first_name').value = data.first_name;
      document.querySelector('#last_name').value = data.last_name;
      if (data.unigue_id != 0) {
        document.querySelector('#old_password').readOnly = true;
        document.querySelector('#new_password').readOnly = true;
        document.querySelector('#confirm_password').readOnly = true;
        document.querySelector('.isintra').style.display = 'none';
      }
    })
    const modal = document.getElementById('settings-modal');
    modal.style.display = 'flex';

  //   document.getElementById('Home-aside').style.cssText = 'font-size: 36px; color: ##ffffffbc; ';
  // document.getElementById('Pr-aside').style.cssText = 'font-size: 36px; color: ##ffffffbc; ';
  // document.getElementById('chat-aside').style.cssText = 'font-size: 36px; color: ##ffffffbc; ';
  // document.getElementById('notif-aside').style.cssText = 'font-size: 36px; color: ##ffffffbc;  ';
  // document.getElementById('setting-aside').style.cssText = 'font-size: 40px; color: #ff44e4 ';
  // document.getElementById('logout-aside').style.cssText = 'font-size: 36px; color: ##ffffffbc; ';
  }
  
  function closeSettingsModal() {
    const modal = document.getElementById('settings-modal');
    modal.style.display = 'none';
  }
  
  
  function showNotificationsModal() {
    
    const modal = document.getElementById('notifi');
    modal.style.display = 'flex';
  //   document.getElementById('Home-aside').style.cssText = 'font-size: 36px; color: ##ffffffbc; ';
  // document.getElementById('Pr-aside').style.cssText = 'font-size: 36px; color: ##ffffffbc; ';
  // document.getElementById('chat-aside').style.cssText = 'font-size: 36px; color: ##ffffffbc; ';
  // document.getElementById('notif-aside').style.cssText = 'font-size: 40px; color: #ff44e4  ';
  // document.getElementById('setting-aside').style.cssText = 'font-size: 36px; color: ##ffffffbc; ';
  // document.getElementById('logout-aside').style.cssText = 'font-size: 36px; color: ##ffffffbc; ';
  }

  

  function closeNotificationsModal() {
    document.getElementById('notifi').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
  // Get the element by ID
  var notificationElement = document.getElementById('notifi');

  // Check if the element exists before adding an event listener
  if (notificationElement) {
    notificationElement.addEventListener('click', function(event) {
      event.preventDefault();
      if (event.target === this) {
        closeNotificationsModal();
      }
    });
  } 
});
const logoutt = document.getElementById('logout-modal');
if (logoutt) {
  logoutt.addEventListener('click', function(event) {
    event.preventDefault();
    if (event.target === this) {
      closeLogoutModal();
    }
  });
} 

const settings = document.getElementById('settings-modal');
if (settings) {
  settings.addEventListener('click', function(event) {
    event.preventDefault();
    if (event.target === this) {
      closeSettingsModal();
    }
  });
}

const notifi = document.getElementById('notifi');
if (notifi) {
  notifi.addEventListener('click', function(event) {
    event.preventDefault();
    if (event.target === this) {
      closeNotificationsModal();
    }
  });
}


function dark() {
  // console.log('dark');
  let darkElements = document.querySelectorAll('.dark');
  let lightElements = document.querySelectorAll('.light');
  let body = document.querySelector('.brull'); // Use querySelector for a single element
  // let rank = document.querySelectorAll('.rank');
  if (body ) {
    // console.log('dark');
    darkElements.forEach(element => element.style.display = 'none');
    lightElements.forEach(element => element.style.display = 'flex');
    body.style.backgroundColor = '#00000000';
    // rank.style.backgroundColor = '#000000c7';
  }
}

function light() {
  // console.log('light'); 
  let darkElements = document.querySelectorAll('.dark');
  let lightElements = document.querySelectorAll('.light');
  let body = document.querySelector('.brull'); // Use querySelector for a single element
  
  if (body ) {
    // console.log('light');
    darkElements.forEach(element => element.style.display = 'flex');
    lightElements.forEach(element => element.style.display = 'none');
    body.style.backgroundColor = '#000000c7';
    // rank.style.backgroundColor = '#000000';
  }
}

function close_user() {

  const modal = document.getElementById('content-user');
  modal.style.display = 'none';

  // // Hide all profile user actions
  document.querySelector('.profile-user-action').style.display = 'none';
  document.querySelector('.profile-user-action-add_friend').style.display = 'none';
  document.querySelector('.profile-user-action-go_to_chat').style.display = 'none';
  document.querySelector('.profile-user-action-unfriend').style.display = 'none';
}