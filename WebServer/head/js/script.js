function loadheadContent() {
    console.log('hello00');
    document.getElementById('home-page').innerHTML = '';
    document.getElementById('home-page').style.display = 'none';
    document.getElementById('head-page').style.display = 'block';

    fetch("./landing/index.html")
        .then(response => response.text())
        .then(html => {
            
            document.getElementById("head-page").innerHTML = html;
        })
        .then(() => {
            loadCSS('./landing/index.css');
            removeCSS('../home/style.css');
        })
        .then(() => {
            const script3 = loadScript('./js/script3.js');
                document.head.appendChild(script3);
        })
        .catch(error => console.error('Error loading head content:', error));
}

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
                removeCSS('../landing/index.css');
                
        })
        .then(() => {
            const script = loadScript('./js/script2.js');
                document.head.appendChild(script);
                const invite = loadScriptnotmodul('./js/invite.js');
                document.head.appendChild(invite);
                const leadr = loadScriptnotmodul('./js/leader.js');
                document.head.appendChild(leadr);
                const data = loadScriptnotmodul('./js/data.js');
                document.head.appendChild(data);
                const match = loadScriptnotmodul('./js/match.js');
                document.head.appendChild(match);
                const notifi = loadScriptnotmodul('./js/notif.js');
                document.head.appendChild(notifi);
                const token = loadScriptnotmodul('./js/token.js');
                document.head.appendChild(token);
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


function already_logged() {
    fetch('/api/already_logged/')
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
            else{
                loadheadContent();
            }
        })
}

function loadScript (src){
    const script = document.createElement('script');
    script.src = src;
    return script;
};

function loadScriptnotmodul (src){
    const script = document.createElement('script');
    script.src = src;
    script.defer = true;
    script.type = 'module';
    return script;
};

already_logged();