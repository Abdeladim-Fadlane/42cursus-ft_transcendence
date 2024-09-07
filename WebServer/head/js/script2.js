// const disactiv_sections = require('./game.js');



function removeJS(file) {
    const scriptElement = document.querySelector(`script[src="${file}"]`);
    if (scriptElement) {
      scriptElement.remove();
        // scriptElement.parentNode.removeChild(scriptElement);
    }
}

function loadheadContent() {
  // console.log('hello00');
  document.getElementById('home-page').innerHTML = '';
  document.getElementById('home-page').style.display = 'none';
  document.getElementById('head-page').style.display = 'block';

  fetch("./landing/index.html")
      .then(response => response.text())
      .then(html => {
          
          document.getElementById("head-page").innerHTML = html;
      })
      .then(() => {
        removeEliments();
          loadCSS('./landing/index.css');
          // removeCSS('../home/style.css');
      })
      .then(() => {
          const script3 = loadScript('./js/script3.js');
              document.head.appendChild(script3);
      })
      .catch(error => console.error('Error loading head content:', error));
}

function removeEliments()
{
  removeCSS('./page-home/style.css');
  // removeCSS('./landing/index.css');
  removeJS('./js/script2.js');
  removeJS('./js/invite.js');
  removeJS('./js/leader.js');
  removeJS('./js/data.js');
  removeJS('./js/token.js');
  removeJS('./js/match.js');
  removeJS('./js/notif.js');
  removeJS('./js/suggest.js');
  removeJS('./js/msgfriend.js');
  removeJS('./js/track.js');
  removeJS('./js/chatScript.js');
  removeJS('./js/setting.js');
  removeJS('./js/game.js');
  removeJS('./js/search.js');
  removeJS('./js/userInformation.js');
  removeJS('./js/ProfileAction.js');
}

function delete_account() {
  fetch('/api/delete_account/')
  .then(response => response.json())
  .then(data => {
    loadheadContent();
    // window.location.href = '/';
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
    case 'profile':
      game_asid();
      break;
    case 'chat':
      click_chat();
      break;
    case 'rank':
      rank();
      break;
    case 'setting':
      showSettingsModal();
      break;
    default:
      border_home();
  }
}

function isValidPage(page) {
  // console.log(page);
  const validPages = ['home', 'profile', 'chat', 'rank','sign-up','login','setting', 'Game', 'Tournament',null];
  return validPages.includes(page);
}

function redirectTo404() {
  window.location.href = '/404.html'; // Redirect to your 404 page
}

initializePageState();



window.onpopstate = function(event) {
  
  if (event.state) {
    switch (event.state.page) {
      case 'home':
        border_home(false);
        break;
      case 'profile':
        border_pr(false);
        break;
      case 'Game':
        game_asid(false);
        break;
      case 'Tournament':
        tournament_asid(false);
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
      case 'setting':
        showSettingsModal(false);
        break;
      default:
        border_home(false); 
    }
  }
};

function    disactiv_sectionss()
{
    document.getElementById('settings-modale').style.display = 'none';
    document.getElementById('local_tournamet_input_id').style.display = 'none';
    document.getElementById('local_game_input_id').style.display = 'none';
    document.getElementById('local_or_remote').style.display = 'none';
    document.querySelector('.conteudo').style.display = 'none';
    document.getElementById('tournament_input').style.display = 'none';
    document.getElementById("home").style.display = 'none';
    document.getElementById("profile").style.display = 'none';
    document.getElementById("chat").style.display = 'none';
    document.getElementById("localtournamentresultModal").style.display = 'none';
    document.getElementById('localresultModal').style.display = 'none';
    document.getElementById('resultModal').style.display = 'none';
    document.getElementById('win-tournament-id').style.display = 'none';
    document.querySelectorAll('section').forEach(section => {
        section.classList.remove('active');
    });
}

function rank(pushState = true) {
  disactiv_sectionss();
  if (pushState) {
    window.history.pushState({page: 'rank'}, 'Rank', '?page=rank');
  }
  document.getElementById('settings-modale').style.display = 'none';

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

    ///////////////////
    document.getElementById('tournament-aside').style.cssText = 'font-size: 36px; color: ##ffffffbc; ';
    document.getElementById('game-aside').style.cssText = 'font-size: 36px; color: ##ffffffbc; ';
    ///////////////////

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

// import { disactiv_sections} from "./game.js";
function border_home(pushState = true) {
  // console.log("home");
  disactiv_sectionss();

  if (pushState) {
    window.history.pushState({page: 'home'}, 'Home', '?page=home');
  }
  document.getElementById('settings-modale').style.display = 'none';


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

      ///////////////////
      document.getElementById('tournament-aside').style.cssText = 'font-size: 36px; color: ##ffffffbc; ';
      document.getElementById('game-aside').style.cssText = 'font-size: 36px; color: ##ffffffbc; ';
      ///////////////////

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
  disactiv_sectionss();

  // disactiv_sections();
    document.getElementById('Pr-aside').style.borderBottom = '2px solid #bbb';
    if (pushState) {
      window.history.pushState({page: 'profile'}, 'Profile', '?page=profile');
    }
  document.getElementById('settings-modale').style.display = 'none';

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

      ///////////////////
      document.getElementById('tournament-aside').style.cssText = 'font-size: 36px; color: ##ffffffbc; ';
      document.getElementById('game-aside').style.cssText = 'font-size: 36px; color: ##ffffffbc; ';
      ///////////////////

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
  disactiv_sectionss();

  if (pushState) {
    window.history.pushState({page: 'chat'}, 'Chat', '?page=chat');
  }
  document.getElementById('settings-modale').style.display = 'none';
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

    ///////////////////
    document.getElementById('tournament-aside').style.cssText = 'font-size: 36px; color: ##ffffffbc; ';
    document.getElementById('game-aside').style.cssText = 'font-size: 36px; color: ##ffffffbc; ';
    ///////////////////

}

if ( typeof currentFriend === 'undefined') {
  let currentFriend = null;
  
  function openChat(friendName) {
      currentFriend = friendName;
      document.getElementById('chat-friend-name').textContent = `Chat with ${friendName}`;
      document.getElementById('chat-messages').innerHTML = ''; // Clear previous messages

  }
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

  // fetch('/logout/')
  // .then(response => {
  //   if (!response.ok) {
  //     throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
  //   }
  //   sessionStorage.removeItem('username');
  //   loadheadContent();
    window.location.href = '/logout/';
  // })
 




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
  function showSettingsModal(pushState = true) {
    disactiv_sectionss();
    if (pushState) {
      window.history.pushState({page: 'setting'}, 'setting', '?page=setting');
    }
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
    // const modal = document.getElementById('settings-modal');
    // modal.style.display = 'flex';
    // if (pushState) {
      // window.history.pushState({page: 'setting'}, 'setting', '?page=setting');
    // }
    const sett = document.getElementById('settings-modale');
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
      ranking.style.display = "none";
    }
    if (sett) {
      sett.style.display = 'flex';
    }
    if (Home_aside) {
      Home_aside.style.cssText = 'font-size: 36px; color: #ffffffbc; ';
    }
  
    if (Home_aside) {
      Home_aside.style.cssText = 'font-size: 36px; color: #ffffffbc; ';
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
      setting_aside.style.cssText = 'font-size: 40px; color: #ff44e4; ';
    }
  
    if (logout_aside) {
      logout_aside.style.cssText = 'font-size: 36px; color: #ffffffbc; ';
    }
    ///////////////////
    document.getElementById('tournament-aside').style.cssText = 'font-size: 36px; color: ##ffffffbc; ';
    document.getElementById('game-aside').style.cssText = 'font-size: 36px; color: ##ffffffbc; ';
    ///////////////////

  }
  
  // function closeSettingsModal() {
  //   const modal = document.getElementById('settings-modal');
  //   modal.style.display = 'none';
  // }
  
  
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
if ( typeof logoutt === 'undefined') {
const logoutt = document.getElementById('logout-modal');
if (logoutt) {
  logoutt.addEventListener('click', function(event) {
    event.preventDefault();
    if (event.target === this) {
      closeLogoutModal();
    }
  });
} 
}

// if ( typeof settings === 'undefined') {
// const settings = document.getElementById('settings-modal');
// if (settings) {
//   settings.addEventListener('click', function(event) {
//     event.preventDefault();
//     if (event.target === this) {
//       closeSettingsModal();
//     }
//   });
// }
// }

if ( typeof settings === 'undefined') {
const notifi = document.getElementById('notifi');
if (notifi) {
  notifi.addEventListener('click', function(event) {
    event.preventDefault();
    if (event.target === this) {
      closeNotificationsModal();
    }
  });
}
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
  document.querySelectorAll('.dark-mode').forEach((element) => {
    element.style.backgroundColor = '#000000c7';
  });
  document.querySelectorAll('.light-mode').forEach((element) => {
    element.style.backgroundColor = '#bbb';
  });
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
  document.querySelectorAll('.light-mode').forEach((element) => {
    element.style.backgroundColor = '#000000c7';
  });
  document.querySelectorAll('.dark-mode').forEach((element) => {
    element.style.backgroundColor = '#bbb';
  });
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