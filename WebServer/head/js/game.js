var game_socket;
var main_socket;
var elem;
var ctx;
var width;
var height;
//////////////
var hh = 80
var ww = 5
var racket_speed = 2
var score_to_win = 3
var local_game_starting = false;
var local_game_Interval;
var local_game_Interval_starting = false;
var local_tournament_starting = false;
var four_game_starting = false;
var match = null;
//////////////
var game_starting = false;
var tournament_starting = false;

function    draw_ball(b)
{
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "white";
    ctx.fill();
}

function put_center()
{
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();
}

function put_score(score, x, y)
{
    ctx.beginPath();
    ctx.font = "60px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(score, x,y);
    ctx.stroke();
}

function draw_racket(racket)
{
    ctx.fillStyle = "white";
    ctx.fillRect(racket.x, racket.y, racket.w, racket.h);
}

function draw(data)
{
    ctx.clearRect(0, 0, width, height);
    draw_racket({'x':width / 2, 'y':0, 'w':1, 'h':height})
    for (let i = 0; i < data.players.length; i++)
        draw_racket(data.players[i].racket);
    draw_ball(data.ping);
    put_score(data.team1_score, width / 2 + (40), 20 / 100 * height);
    put_score(data.team2_score, width / 2 - (60 + 10), 20 / 100 * height);
}

async function get_url(socket_url) {
    try {
        const response = await fetch('/api/token/');
        const data = await response.json();
        const user_response = await fetch('/api/data/');
        const user = await user_response.json();
        return `wss://${window.location.host}${socket_url}?token=${data.token}&id=${user.id}`;
    }
    catch (error)
    {
        throw error;
    }
}

function border_home(pushState = true) {
    disactiv_sections();
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

(async function createWebSocket() {
    try {
        const socket_url = '/wss/main_socket/';
        const url = await get_url(socket_url);
        main_socket = new WebSocket(url);

        main_socket.onopen = function(event) {
            console.log("main WebSocket connection established.");
        };

        main_socket.onmessage = function(event) {
            var data = JSON.parse(event.data);
            if (data.type == 'game.challenge')
            {
                document.getElementById('game_notification_icon_id').src = '/' + data.vs.icon;
                document.getElementById('game_notification_username_id').innerHTML = data.vs.login;
                document.getElementById('game_notification_id').style.display = 'block';
            }
            else if (data.type == 'game.refuse')
            {
                document.getElementById('game_refuse_icon_id').src = '/'  + data.vs.icon;
                document.getElementById('game_refuse_username_id').innerHTML = data.vs.login;
                border_home();
                // window.history.back();
                put_section('refuse_game_id');
                document.getElementById('game_aside_id').style.display = 'none';
                setTimeout(() => {disactiv_section('refuse_game_id')}, 2500);
            }
            else if (data.type === 'update_leaderboard') 
                leaderboard_requests();
            else if (data.type === 'update_match_history')
                fetchHistory();
        };

        main_socket.onerror = function(event) {
            console.error("WebSocket error observed");
            location.reload();
        };

        main_socket.onclose = function(event) {
            console.log("WebSocket connection closed:", event);
        };
    } catch (error) {
        console.error("Error creating WebSocket:", error);
    }
})();

// function challenge_lastone()
// {
//     challenge_friend(lastone);
// }
function challenge_friend(username)
{
    main_socket.send(JSON.stringify({'type':'room.create', 'vs':username}));
    close_AI();
    game_asid();
    run('play', '/wss/game/', '2-canvas-id', {'type':'room', 'room_creater':document.getElementById('login').textContent});
}

var first_time = true;

function    disactiv_section(section_id)
{
    document.getElementById(section_id).classList.remove('active');
}

function disactiv_all_flexsection()
{
    document.getElementById('settings-modale').style.display = 'none';
    document.getElementById('local_tournamet_input_id').style.display = 'none';
    document.getElementById('local_game_input_id').style.display = 'none';
    document.getElementById('local_or_remote').style.display = 'none';
    document.querySelector('.conteudo').style.display = 'none';
    document.getElementById('tournament_input').style.display = 'none';
    document.getElementById("home").style.display = 'none';
    document.getElementById("rank").style.display = 'none';
    document.getElementById("profile").style.display = 'none';
    document.getElementById("chat").style.display = 'none';
    document.getElementById("localtournamentresultModal").style.display = 'none';
    document.getElementById('localresultModal').style.display = 'none';
    document.getElementById('resultModal').style.display = 'none';
}

function    active_flexsection(section_id)
{
    document.getElementById(section_id).style.display = 'flex';
}

function    disactiv_sections()
{
    disactiv_all_flexsection();
    document.querySelectorAll('section').forEach(section => {
        section.classList.remove('active');
    });
}

function    remove_all_event_listener(id)
{
    var element = document.getElementById(id);
    var newElement = element.cloneNode(true);
    element.parentNode.replaceChild(newElement, element);
}

function    local_or_remote_game(type)
{
    remove_all_event_listener('local_button_id');
    remove_all_event_listener('remote_button_id');
    if (type == 'game')
    {
        document.getElementById('local_button_id').addEventListener('click', ()=>{close_AI();flex_section('local_game_input_id')});
        document.getElementById('remote_button_id').addEventListener('click', function() {close_AI();navigate('play')});
    }
    else
    {
        document.getElementById('local_button_id').addEventListener('click', (e)=>{flex_section('local_tournamet_input_id')});
        //////////////////////
        // document.getElementById('local_button_id').addEventListener('click', ()=>{close_AI();run_local_tournament()});
        document.getElementById('remote_button_id').addEventListener('click', ()=> {close_AI();navigate('tournament_input')});
    }
    flex_section('local_or_remote');
}

function    flex_section(section_id)
{
    disactiv_sections();
    document.getElementById(section_id).style.display = 'flex';
}

function    put_section(section_id){
    document.getElementById(section_id).classList.add('active');
    if (section_id == 'tournament_list')
        document.querySelector('.conteudo').style.display = 'flex';
}

function    active_section(section_id)
{
    disactiv_sections();
    put_section(section_id);
}

function    display_ping_pong(data)
{
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < data.players.length; i++)
    {
        document.getElementById(data.players.length.toString() + "-canvas-display_name-id-" + i.toString()).innerHTML = data.players[i].login;
        document.getElementById(data.players.length.toString() + "-canvas-icon-id-" + i.toString()).src = '/' + data.players[i].icon;
        document.getElementById('fighter_icon_' + i.toString()).src = '/' + data.players[i].icon;
        document.getElementById('fighter_username_' + i.toString()).innerHTML = data.players[i].login;
        if (data.players[i].login != document.getElementById('login').textContent)
            lastone = data.players[i].login;
    }
    active_section('start_fight');
}

function showResult(result)
{
    game_starting = false;
    document.getElementById("game_aside_id").style.display = 'none';
    const message = document.getElementById('resultMessage');

    if (result == 'Winner')
    {
        message.textContent = 'Congration You Won!';
        message.style.color = 'goldenrod';
        document.getElementById('result-gif').src = '/home/resrc/game/win.gif';
    }
    else if (result == 'Loser')
    {
        message.textContent = 'Sorry You Lost!';
        message.style.color = 'red';
        document.getElementById('result-gif').src = "/home/resrc/game/lost.png";
        if (game_socket && game_socket.readyState)
            game_socket.close(1000, 'Normal Closure');
    }
    document.getElementById('waiting_id').innerHTML = '';
    active_flexsection('resultModal');
    if (tournament_starting)
        setTimeout(() => {tournament_asid();}, 2500);
    else
        setTimeout(() => {border_home();}, 2500);
}

function Continue_game(action)
{
    game_socket.send(JSON.stringify({'type':'action', 'action':action}));
    if (action == "Continue")
        game_asid();
    else
    {
        game_socket.close(1000, 'Normal Closure');
        disactiv_sections()
        document.getElementById("home").style.display = 'flex';
    }
}

function    accept_game()
{
    document.getElementById('game_notification_id').style.display = 'none';
    close_AI();
    run('play', '/wss/game/', '2-canvas-id', {'type':'room', 'room_creater':document.getElementById('game_notification_username_id').innerHTML});
}

function    refuse_game()
{
    document.getElementById('game_notification_id').style.display = 'none';
    main_socket.send(JSON.stringify({'type':'room.refuse', 'vs':document.getElementById('game_notification_username_id').innerHTML}));
}

function    clean_rounds()
{
    for (let i = 0; i < 8; i++)
    {
        document.getElementById('0' + i.toString()).innerHTML = '';
        if (i < 4)
            document.getElementById('1' + i.toString()).innerHTML = '';
        if (i < 2)
            document.getElementById('2' + i.toString()).innerHTML = '';
    }
}

var round = 0;
function    tournament_info(players, section_id)
{
    document.getElementById('waiting_id').innerHTML = '';
    active_section(section_id);
    for (let i = 0; i < players.length; i++)
    {
        var container = document.getElementById(round.toString() + i.toString());
        var icon = document.createElement("img");
        icon.className = "Match_icon";
        icon.id = players[i].username;
        // icon.addEventListener('click', view_profile);

        icon.src = '/' + players[i].icon;

        var display_name = document.createElement("h2");
        display_name.textContent = players[i].login;
        container.innerHTML = '';
        container.appendChild(icon);
        container.appendChild(display_name);
    }
    round++;
}

function    tournament_list(data)
{
    clean_rounds();
    document.getElementById('tournament_input').style.display = 'none';
    parent = document.getElementById('tournament_content');
    parent.innerHTML = '';
    if (8 - data.players.length == 1)
        document.getElementById('tournament_wait_id').innerHTML = 'waiting for one other...';
    else
    document.getElementById('tournament_wait_id').innerHTML = 'waiting for ' + (8 - data.players.length).toString() + ' others...';
    data.players.forEach((element) =>{
        var div = document.createElement("div");
        div.className = "student";

        var img = document.createElement("img");
        img.className = "student-icon"
        img.id = element.username;
        // img.addEventListener('click', view_profile);
        img.src = '/' + element.icon;

        var span = document.createElement("span");
        span.className = "student-name";
        span.innerHTML = element.login;

        div.appendChild(img);
        div.appendChild(span);
        parent.appendChild(div);
        });
    tst('tournament_list');
}

async function run(section_id, socket_url, canvas_id, type)
{
    try
    {
        first_time = true;
        round = 0;
        if (game_socket)
            game_socket.close(1000, 'Normal Closure');
        elem = document.getElementById(canvas_id);
        ctx = elem.getContext("2d");
        width = elem.width
        height = elem.height
        URL = await get_url(socket_url) + '&type=' + type.type + '&room_creater=' + type.room_creater
        game_socket = new WebSocket(URL);

        game_socket.onopen = function(event) {
            console.log("game WebSocket connection established.");
        };

        game_socket.onmessage = function (e)
        {
            var data = JSON.parse(e.data)
            if (data.type == 'game_wait')
            {
                if (data.waiting == 1)
                    document.getElementById('waiting_id').innerHTML = 'waiting for one other ...';
                else
                    document.getElementById('waiting_id').innerHTML = 'waiting for '+ data.waiting + ' others ...';
            }
            else if (data.type == 'discard')
            {
                border_home();
                put_section('discard_game_id');
                setTimeout(() => {disactiv_section('discard_game_id')}, 8000);
            }
            else if (data.type == 'game.countdown')
            {
                var countdown = data.time;
                const interval = setInterval(() => {
                    ctx.clearRect(0, 0, width, height);
                    put_score(countdown, width / 2, height / 2);
                    if (countdown == 1)
                        clearInterval(interval);
                    countdown -= 1;
                }, 1000);
            }
            else if (data.type == 'game.info')
                display_ping_pong(data);
            else if (data.type == 'game.state')
            {
                if (first_time)
                {
                    ctx.clearRect(0, 0, width, height);
                    console.log('data', data);
                    for (let i = 0; i < data.players.length; i++)
                    {
                        document.getElementById(data.players.length.toString() + "-canvas-display_name-id-" + i.toString()).innerHTML = data.players[i].login;
                        document.getElementById(data.players.length.toString() + "-canvas-icon-id-" + i.toString()).src = '/' + data.players[i].icon;
                    }
                    first_time = false;
                    if (data.players.length == 2)
                        game_starting = true;
                    else if (data.players.length == 4)
                        four_game_starting = true;
                    game_asid();
                    document.addEventListener("keydown", (event) => {
                        if (game_socket.readyState === WebSocket.OPEN)
                        {
                            if (event.key == "ArrowUp")
                                game_socket.send(JSON.stringify({'type':'move', 'move':'Up'}));
                            else if (event.key == "ArrowDown")
                                game_socket.send(JSON.stringify({'type':'move', 'move':'Down'}));
                        }
                    });

                    document.addEventListener("keyup", (event) => {
                        if (game_socket.readyState === WebSocket.OPEN)
                        {
                            if (event.key == "ArrowUp" || event.key == "ArrowDown")
                                game_socket.send(JSON.stringify({'type':'move', 'move':'Stop'}));
                        }
                    });
                }
                draw(data);
            }
            else if (data.type == 'tournament.list')
                tournament_list(data);
            else if (data.type == 'tournament.info')
            {
                tournament_info(data.players, 'play_tournament');
                tournament_asid();
                tst('play_tournament');
                first_time = true;
            }
            else if (data.type == 'game.end')
                showResult(data.result);
            else if (data.type == 'tournament.end')
            {
                document.getElementById("tournament_aside_id").style.display = 'block';
                active_section('win-tournament-id');
            }
        }
    }
    catch (error)
    {
        console.error('Error fetching data:', error);
    }
}

function    close_game(return_to_home = true)
{
    document.getElementById("game_aside_id").style.display = 'none';
    document.getElementById('waiting_id').innerHTML = '';
    if (return_to_home)
        border_home();
    if (local_game_starting)
    {
        local_game_starting = false;
        clearInterval(local_game_Interval);
    }
    if (game_starting)
    {
        game_starting = false;
        game_socket.close(1000, 'Normal Closure');
    }
}

function new_game(){
    close_game(false);
    tournament_starting = false;
    if (tournament_starting)
        navigate('tournament_input');
    else
        navigate('play');
}

function    close_tournament()
{
    close_game();
    if (tournament_starting)
        game_socket.close(1000, 'Normal Closure');
    document.getElementById('tournament_wait_id').innerHTML = '';
    document.getElementById("tournament_aside_id").style.display = 'none';
    tournament_starting = false;
    clean_rounds();
}

function new_tournament()
{
    var n = game_starting;
    close_tournament();
    if (n)
        navigate('play');
    else
        navigate('tournament_input');
}

function navigate(section_id) {
    if (section_id == 'play')
    {
        game_asid();
        document.getElementById("tournament_aside_id").style.display = 'none';
        run('play', '/wss/game/', '2-canvas-id', {'type':'random', 'vs':'undefined'});
    }
    else if (section_id == 'play_tournament')
    {
        tournament_starting = true;
        document.getElementById("tournament_aside_id").style.display = 'block';
        tournament_asid();
        run('play', '/wss/tournament/' , '2-canvas-id', {'type':'random', 'vs':'undefined'});
    }
    else if (section_id == 'ping-pong-4')
    {
        document.getElementById("game_aside_id").style.display = 'none';
        game_asid();
        run('play-4', '/wss/four_players/', '4-canvas-id', {'type':'random', 'vs':'undefined'});
    }
    else if (section_id == 'tournament_input')
    {
        document.getElementById('move_to_next_match_id').style.display = 'none';
        tournament_asid();
    }
    else
        active_section(section_id);
}

function toggleFullScreen() {
    if (!document.fullscreenElement)
        document.documentElement.requestFullscreen().catch((err) => {
            alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
    else
        document.exitFullscreen();
}

// document.addEventListener('DOMContentLoaded', function() {
        (function get_csrf_token(){
            fetch('/api/csrf-token/')
            .then(response => response.json())
            .then(data => {
                document.getElementById('display_name_csrfToken').value = data.csrfToken;
            })
        .catch(error => console.error('Error fetching CSRF token:', error));
        })();

        document.getElementById('display_name-form-id').addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(this);
            const csrfToken = document.getElementById('display_name_csrfToken').value;
            fetch('/display_name/', {
                method: 'POST',
                body: formData,
                headers: {
                'X-CSRFToken': csrfToken,
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === true)
                navigate('play_tournament');
            else
            {
                document.getElementById('display_name_err').innerHTML = data.message;
                document.getElementById('display_name_err').style.color = 'red';
            }
            })
            .catch(error => {
                document.getElementById('messages').innerHTML = error;
                document.getElementById('messages').style.color = 'red';
            });
        });
        // remove_all_event_listener('toggle-btn');
        document.getElementById('toggle-btn').addEventListener('click', toggleFullScreen);
        document.addEventListener('fullscreenchange', (event) => {
            if (document.fullscreenElement) {
                document.querySelector('.navbar').style.display = 'none';
                document.querySelector('.aside_content').style.display = 'none';
                document.querySelector('.game_nav').style.display = 'none';
                document.querySelector('#screen_img').src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAItJREFUSEvlVEEOgCAMW3+mL9ef1YRIAigwMJsxcoOMdV23QowPjPOLLwDJTUSWyApAKIAkU6aV9x3AWnYkY6BMJD3grJj0EgFiAq0+rX+3DMwAtBWPxLlPUZgWsxZ9X+RZBi3RfUUeGT/tgvou2qwGw1bRctOa0V1c9HTiskVdu34EYC7yfwFe3eQDRrV9Ga6+/8IAAAAASUVORK5CYII="
            } else {
                document.querySelector('.navbar').style.display = 'flex';
                document.querySelector('.aside_content').style.display = 'flex';
                document.querySelector('.game_nav').style.display = 'flex';
                document.querySelector('#screen_img').src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAGpJREFUSEvtVUEKACAIa/9/tNEhsDCYRUZg59k2dYVy+eDy/SWWQERk5QjAIIbFbhU1EUcEs1p2Tp1U15sOkuBdi9hhenCxQfMoY7GxDqygsEp1ut9tUTqgHztrsH/8B56VZLGxQWNVeXAV8rVwGd7+Wh0AAAAASUVORK5CYII="
            }
        });
        document.getElementById('local_game_input').addEventListener('submit', function(event)
        {
            event.preventDefault();
            run_local_game();
        });
// });

function    tst(section_id)
{
    document.getElementById('tournament_list').style.display = 'none';
    document.getElementById('play_tournament').style.display = 'none';
    document.querySelector('.conteudo').style.display = 'none';
    document.getElementById('tournament_nav_list_item_id').style.cssText = 'font-size: 36px; color: ##ffffffbc; ';
    document.getElementById('tournament_nav_making_item_id').style.cssText = 'font-size: 36px; color: ##ffffffbc; ';
    document.getElementById('tournament_nav_NMatch_item_id').style.cssText = 'font-size: 36px; color: ##ffffffbc; ';
    document.getElementById(section_id).style.display = 'flex';
    if (section_id == 'tournament_list')
    {
        document.getElementById('tournament_nav_list_item_id').style.cssText = 'font-size: 40px; color: #ff44e4; ';
        document.querySelector('.conteudo').style.display = 'flex';
    }
    else if (section_id == 'play_tournament')
        document.getElementById('tournament_nav_making_item_id').style.cssText = 'font-size: 40px; color: #ff44e4; ';
    else
        document.getElementById('tournament_nav_NMatch_item_id').style.cssText = 'font-size: 40px; color: #ff44e4; ';
}

function game_asid(pushState = true) {
    disactiv_sections();

    if (pushState)
        window.history.pushState({page: 'Game'}, 'Game', '?page=Game');

    document.getElementById('Home-aside').style.cssText = 'font-size: 36px; color: ##ffffffbc; ';
    document.getElementById('Pr-aside').style.cssText = 'font-size: 36px; color: ##ffffffbc; ';
    document.getElementById('game-aside').style.cssText = 'font-size: 40px; color: #ff44e4; ';
    document.getElementById('chat-aside').style.cssText = 'font-size: 36px; color: ##ffffffbc; ';
    document.getElementById('notif-aside').style.cssText = 'font-size: 36px; color: ##ffffffbc; ';
    document.getElementById('setting-aside').style.cssText = 'font-size: 36px; color: ##ffffffbc; ';
    document.getElementById('logout-aside').style.cssText = 'font-size: 36px; color: ##ffffffbc; ';
    document.getElementById('rank-aside').style.cssText = 'font-size: 36px; color: ##ffffffbc; ';
    ///////////////////
    document.getElementById('tournament-aside').style.cssText = 'font-size: 36px; color: ##ffffffbc; ';
    document.getElementById("game_aside_id").style.display = 'block';
    if (game_starting || local_game_starting)
        active_section('play');
    else if (four_game_starting)
        active_section('play-4');
    else
        active_section('loading-section-id');
}

function tournament_asid(pushState = true) {
    disactiv_sections();
    if (pushState)
        window.history.pushState({page: 'Tournament'}, 'Tournament', '?page=Tournament');
    document.getElementById('Home-aside').style.cssText = 'font-size: 36px; color: ##ffffffbc; ';
    document.getElementById('Pr-aside').style.cssText = 'font-size: 36px; color: ##ffffffbc; ';
    document.getElementById('tournament-aside').style.cssText = 'font-size: 40px; color: #ff44e4; ';
    document.getElementById('chat-aside').style.cssText = 'font-size: 36px; color: ##ffffffbc; ';
    document.getElementById('notif-aside').style.cssText = 'font-size: 36px; color: ##ffffffbc; ';
    document.getElementById('setting-aside').style.cssText = 'font-size: 36px; color: ##ffffffbc; ';
    document.getElementById('logout-aside').style.cssText = 'font-size: 36px; color: ##ffffffbc; ';
    document.getElementById('rank-aside').style.cssText = 'font-size: 36px; color: ##ffffffbc; ';
    ///////////////////
    document.getElementById('game-aside').style.cssText = 'font-size: 36px; color: ##ffffffbc; ';
    document.getElementById("tournament_aside_id").style.display = 'block';
    if (!game_starting && !local_game_starting)
        document.getElementById("game_aside_id").style.display = 'none';
    if (local_tournament_starting)
    {
        active_section('tournament_nav_id');
        tst('play_tournament');
    }
    else if (tournament_starting)
    {
        active_section('tournament_nav_id');
        tst('tournament_list');
    }
    else
        document.getElementById('tournament_input').style.display = 'flex';
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////

class racket
{
    constructor(x, y, min, max)
    {
        this.x = x;
        this.y = y;
        this.min = min;
        this.max = max;
        this.h = hh;
        this.w = ww;
        this.vy = 0;
        this.score = 0;
    }

    change_direction(data)
    {
        if (data == 'Up')
            this.vy = -racket_speed;
        else if (data == 'Down')
            this.vy = racket_speed;
        else if (data == 'Stop')
            this.vy = 0;
    }

    move()
    {
        if (this.vy < 0)
            if (this.y + this.vy > this.min)
                this.y += this.vy;
            else
                this.y = this.min;
        else
        {
            if (this.y + this.vy < this.max - this.h)
                this.y += this.vy;
            else
                this.y = this.max - this.h;
        }
    }

    serialize_racket()
    {
        return {
            'x': this.x,
            'y': this.y,
            'h': this.h,
            'w': this.w,
            'score':this.score,
        }
    }
}

class ball
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
        this.r = 10;
        this.angl = 0;
        this.speed = 2;
        this.vx = Math.cos(this.angl * Math.PI / 180) * this.speed;
        this.vy = Math.sin(this.angl * Math.PI / 180) * this.speed;
    }

    serialize_ball()
    {
        return{
            'x':this.x,
            'y':this.y,
            'r':this.r,
        }
    }
}

function serialize_Match(o)
{
    return{
        'type':'game.state',
        'players':o.players.map(p => ({ racket: p.racket.serialize_racket() })),
        'ping':o.b.serialize_ball(),
        'team1_score':o.team1_score,
        'team2_score':o.team2_score,
    }
}

class   player
{
    constructor(display_name, icon, x, y, min, max)
    {
        this.display_name = display_name;
        this.icon = icon;
        this.racket = new racket(x, y, min, max)
    }
}

class   Match
{
    constructor()
    {
        this.starting = false;
        this.players = [2 * null];
        this.b = new ball(width / 2, height / 2);
        this.team1_score = 0;
        this.team2_score = 0;
    }

    set_player(player, index)
    {
        this.players[index] = player
    }

    move()
    {
        if (this.b.x + this.b.r < ww)
        {
            this.team1_score += 1;
            this.b.x = width / 2;
            this.b.y = height / 2;
            // setTimeout(() => {
            //     console.log('End after 2 seconds');
            //   }, 1000);
            //sleep 1 s;
        }
        if (this.b.x - this.b.r > width - ww)
        {
            this.team2_score += 1;
            this.b.x = width / 2;
            this.b.y = height / 2;
            // setTimeout(() => {
            //     console.log('End after 2 seconds');
            //   }, 1000);
        }
        if (this.b.vx > 0)
        {
            if ((this.b.x + this.b.r) + this.b.vx < (width - ww))
                this.b.x += this.b.vx;
            else
            {
                if ((this.b.y) < this.players[1].racket.y  || this.b.y >this.players[1].racket.y + hh)
                    this.b.x += this.b.vx;
                else
                {
                    this.b.x += (width - ww) - (this.b.x + this.b.r);
                    this.b.vx = -this.b.vx;
                }
            }
        }
        else
        {
            if (this.b.y < this.players[0].racket.y  || this.b.y >this.players[0].racket.y + hh  || (this.b.x - this.b.r) + this.b.vx > ww)
                this.b.x += this.b.vx;
            else
            {
                this.b.x = ww + this.b.r;
                this.b.vx = -this.b.vx;
            }
        }
        if (this.b.vy > 0)
        {
            if (this.b.y + this.b.r + this.b.vy < (height - 0))
                this.b.y += this.b.vy;
            else
            {
                this.b.y = (height - 0) - this.b.r;
                this.b.vy = -this.b.vy;
            }
        }
        else
        {
            if ((this.b.y - this.b.r) + this.b.vy > 0)
                this.b.y += this.b.vy;
            else
            {
                this.b.y = this.b.r + 0;
                this.b.vy = -this.b.vy;
            }
        }
        this.players.forEach(function(item) {
            item.racket.move();
          });
    }

    run_game()
    {
        // if (match.starting)
        match.move();
        draw(serialize_Match(match));
        if (match.team1_score == score_to_win)
            show_local_game_Result(0);
        else if (match.team2_score == score_to_win)
            show_local_game_Result(1);
    }
}

function    close_local_game(return_to_home = true)
{
    document.getElementById("local_display_names_msg_id").innerHTML = '';
    document.getElementById("game_aside_id").style.display = 'none';
    if (local_game_starting)
    {
        ctx.clearRect(0, 0, width, height);
        // if (match)
        //     delete match;
        local_game_starting = false;
    }
    clearInterval(local_game_Interval);
    local_game_Interval_starting = false;
    if (return_to_home)
        border_home();
    // window.history.back();
}

function    close_local_tournament()
{
    document.getElementById("tournament_aside_id").style.display = 'none';
    document.getElementById('tournament_wait_id').innerHTML = '';
    close_local_game();
    clean_rounds();
    local_tournament_starting = false;
    TOURNAMENT_LIST = [];
    Matchs = [];
    MATCH_INDEX = 0;
    ROUND = 0;
}

function    close_AI()
{
    if (tournament_starting)
        close_tournament();
    if (game_starting)
        close_game();
    if (local_tournament_starting)
        close_local_tournament();
    if (local_game_starting)
        close_local_game();
    if (four_game_starting)
        close_game();
}

function show_local_game_Result(idx){
    var winner;

    if (idx == 1)
    {
        winner = match.players[0];
        document.getElementById("local_game_winner_dname_id").innerHTML = document.getElementById("2-canvas-display_name-id-0").innerHTML;
        document.getElementById("local_game_winner_icon_id").src = document.getElementById("2-canvas-icon-id-0").src;
    }
    else
    {
        winner = match.players[1];
        document.getElementById("local_game_winner_dname_id").innerHTML = document.getElementById("2-canvas-display_name-id-1").innerHTML;
        document.getElementById("local_game_winner_icon_id").src = document.getElementById("2-canvas-icon-id-1").src;
    }
    //////////////////////
    if (local_tournament_starting)
    {
        close_local_game(false);
        if (ROUND < 2)
        {
            fill_Match(ROUND + 1, MATCH_INDEX, winner);
            TOURNAMENT_LIST.push({'icon':winner.icon, 'display_name':winner.display_name});
            MATCH_INDEX++;
            if ((MATCH_INDEX == 4 && ROUND == 0) || (MATCH_INDEX == 2 && ROUND == 1))
            {
                ROUND++;
                MATCH_INDEX = 0;
                Matchs = fill_round(ROUND, TOURNAMENT_LIST, false);
            }
            fill_Match_fight(Matchs[MATCH_INDEX]);
            active_flexsection('localresultModal');
        }
        else
        {
            document.getElementById("local_tournament_winner_dname_id").innerHTML = winner.display_name;
            document.getElementById("local_tournament_winner_icon_id").src = winner.icon;
            active_flexsection('localtournamentresultModal');
        }
        setTimeout(() => {tournament_asid()}, 3000);
    }
    //////////////////////
    else
    {
        close_local_game();
        active_flexsection('localresultModal');
        setTimeout(() => {border_home()}, 3000);
    }
}

function    start_pause_game()
{
    if (local_game_starting)
    {
        if (local_game_Interval_starting)
        {
            local_game_Interval_starting = false;
            clearInterval(local_game_Interval);
            document.getElementById("start_pause_game_id").className = 'fa-solid fa-play';
        }
        else
        {
            local_game_Interval = setInterval(match.run_game);
            local_game_Interval_starting = true;
            document.getElementById("start_pause_game_id").className = 'fa-solid fa-pause';
        }
    }
}

function    move_down(event)
{
    if (local_game_starting)
    {
        if (event.key == "ArrowUp")
            match.players[1].racket.change_direction('Up');
        else if (event.key == "ArrowDown")
            match.players[1].racket.change_direction('Down');
        else if (event.key == "w")
            match.players[0].racket.change_direction('Up');
        else if (event.key == "s")
            match.players[0].racket.change_direction('Down');
    }
}

function    move_up(event)
{
    if (local_game_starting)
    {
        if (event.key == "ArrowUp" || event.key == "ArrowDown")
            match.players[1].racket.change_direction('Stop');
        else if (event.key == "w" || event.key == "s")
            match.players[0].racket.change_direction('Stop');
    }
}

function    start_local_game()
{
    ///////////////
    clearInterval(local_game_Interval);
    local_game_Interval_starting = false;
    local_game_starting = true;
    game_asid();
    var countdown = 3;
    const interval = setInterval(() => {
        ctx.clearRect(0, 0, width, height);
        put_score(countdown, width / 2 - 30, height / 2);
        if (countdown == 1)
            clearInterval(interval);
        countdown -= 1;
    }, 1000);
    setTimeout(() => {
        local_game_Interval = setInterval(match.run_game);
        document.getElementById("start_pause_game_id").className = 'fa-solid fa-pause';
        match.starting = true;
        local_game_Interval_starting = true;
        document.removeEventListener("keydown", move_down);
        document.removeEventListener("keyup", move_up);
        document.addEventListener("keydown", move_down);
        document.addEventListener("keyup", move_up);
    }, 4000);
}

function    run_local_game() {
    close_AI();
    var player1_display_name = document.getElementById("local_game_player1_display_name_id").value;
    var player2_display_name = document.getElementById("local_game_player2_display_name_id").value;
    if (player1_display_name.length > 10)
        document.getElementById("local_display_names_msg_id").innerHTML = "player1 name must be less than 10 characters";
    else if (player2_display_name.length > 10)
        document.getElementById("local_display_names_msg_id").innerHTML = "player2 name must be less than 10 characters";
    else if (player1_display_name === player2_display_name)
        document.getElementById("local_display_names_msg_id").innerHTML = "you can't have the same name";
    else
    {
        document.getElementById("2-canvas-display_name-id-0").innerHTML = player1_display_name;
        document.getElementById("2-canvas-icon-id-0").src = '/home/resrc/game/ice.png';
        document.getElementById("2-canvas-display_name-id-1").innerHTML = player2_display_name;
        document.getElementById("2-canvas-icon-id-1").src = '/home/resrc/game/fire.png';
        ////////////////
        elem = document.getElementById('2-canvas-id');
        document.getElementById("local_game_input_id").style.display = 'none';
        ctx = elem.getContext("2d");
        width = elem.width
        height = elem.height
        ////////////////
        match = new Match();
        match.set_player(new player(player1_display_name, '/home/resrc/game/ice.png', 0, (height - hh) / 2, 0, height), 0);
        match.set_player(new player(player2_display_name, '/home/resrc/game/fire.png', width - ww, (height - hh) / 2, 0, height), 1);
        start_local_game();
    }
}

//########################################################################################
//########################################################################################
//########################################################################################
//########################################################################################
//########################################################################################
//########################################################################################
//########################################################################################
//########################################################################################
//########################################################################################
//########################################################################################
//########################################################################################
//########################################################################################
//########################################################################################
//########################################################################################
//########################################################################################
//########################################################################################
//########################################################################################
//########################################################################################
//########################################################################################
//########################################################################################
//########################################################################################
//########################################################################################

function    aside_hover(aside_id)
{
    document.getElementById('Home-aside').style.cssText = 'font-size: 36px; color: ##ffffffbc; ';
    document.getElementById('Pr-aside').style.cssText = 'font-size: 36px; color: ##ffffffbc; ';
    document.getElementById('tournament-aside').style.cssText = 'font-size: 36px; color: ##ffffffbc; ';
    document.getElementById('chat-aside').style.cssText = 'font-size: 36px; color: ##ffffffbc; ';
    document.getElementById('notif-aside').style.cssText = 'font-size: 36px; color: ##ffffffbc; ';
    document.getElementById('setting-aside').style.cssText = 'font-size: 36px; color: ##ffffffbc; ';
    document.getElementById('logout-aside').style.cssText = 'font-size: 36px; color: ##ffffffbc; ';
    document.getElementById('game-aside').style.cssText = 'font-size: 36px; color: ##ffffffbc; ';

    document.getElementById(aside_id).style.cssText = 'font-size: 40px; color: #ff44e4; ';
}

function    fill_Match(round, idx, obj)
{
    if (round <= 2)
    {
        var container = document.getElementById(round.toString() + idx.toString());
        var icon = document.createElement("img");
        icon.className = "Match_icon";
        icon.src = '/' + obj.icon;

        var display_name = document.createElement("h2");
        display_name.id = "user-display-name"
        display_name.textContent = obj.display_name;
        // display_name.textContent = i;
        container.appendChild(icon);
        container.appendChild(display_name);
        // document.getElementsByClassName('tournament_nav').appendChild(container);
    }
}

function    fill_round(round, list, fill = true)
{
    var Matchs = [];
    for (let i = 0; i < list.length; i++)
    {
        if (fill)
            fill_Match(round, i, list[i]);
        if (i % 2 == 0)
        {
            Matchs.push(new Match());
            Matchs[(i / 2) | 0].set_player(new player(list[i].display_name, list[i].icon, 0, (height - hh) / 2, 0, height), 0);
        }
        else
        {
            Matchs[(i / 2) | 0].set_player(new player(list[i].display_name, list[i].icon, width - ww, (height - hh) / 2, 0, height), 1);
        }
    }
    return (Matchs);
}

var ROUND = 0;
var MATCH_INDEX = 0;
var Matchs;

function    fill_Match_fight(match)
{
    document.getElementById("tournament_fighter_username_0").innerHTML = match.players[0].display_name;
    document.getElementById("tournament_fighter_icon_0").src = '/' + match.players[0].icon;
    document.getElementById("tournament_fighter_username_1").innerHTML = match.players[1].display_name;
    document.getElementById("tournament_fighter_icon_1").src = '/' + match.players[1].icon;

    if (ROUND == 0)
        document.getElementById('Match_round_id').innerHTML = 'Quarter Final';
    else if (ROUND == 1)
        document.getElementById('Match_round_id').innerHTML = 'Semi Final';
    else
        document.getElementById('Match_round_id').innerHTML = 'Final';

    document.getElementById('move_to_next_match_id').style.display = 'block';
}

function    start_match()
{
    match = Matchs[MATCH_INDEX];
    document.getElementById("2-canvas-display_name-id-0").innerHTML = match.players[0].display_name;
    document.getElementById("2-canvas-icon-id-0").src = '/' + match.players[0].icon;
    document.getElementById("2-canvas-display_name-id-1").innerHTML = match.players[1].display_name;
    document.getElementById("2-canvas-icon-id-1").src = '/' + match.players[1].icon;
    
    document.getElementById('move_to_next_match_id').style.display = 'none';
    start_local_game();
    document.getElementById('tournament_nav_NMatch_item_id').style.display = 'none';
}

var TOURNAMENT_LIST = [];

function    run_local_tournament()
{
    clean_rounds();
    close_AI();
    local_tournament_starting = true;
    var valid = true;
    //////////////////////////////////
    elem = document.getElementById('2-canvas-id');
    ctx = elem.getContext("2d");
    width = elem.width
    height = elem.height
    //////////////////////////////////
    parent = document.getElementById('tournament_content');
    parent.innerHTML = '';
    var display_name;
    let displayNamesSet = new Set();
    for (let i = 0; i < 8; i++)
    {
        var div = document.createElement("div");
        div.className = "student";

        var img = document.createElement("img");
        img.className = "student-icon"
        img.src = '/home/resrc/game/minion' + (i + 1).toString() + '.png';

        var span = document.createElement("span");
        span.className = "student-name";
        display_name = document.getElementById("local_tournament_player" + (i + 1).toString() + "_display_name_id").value;
        // display_name = 'd_name_' + (i + 1).toString();
        if (display_name.length == 0)
        {
            document.getElementById("local_tournament_display_names_msg_id").innerHTML = "display name must not be empty";
            valid = false;
            break;
        }
        if (displayNamesSet.has(display_name))
        {
            document.getElementById("local_tournament_display_names_msg_id").innerHTML = "you can't have the same display name";
            valid = false;
            break;
        }
        displayNamesSet.add(display_name);
        if (display_name.length > 10)
            display_name = display_name.slice(0, 10);
        span.innerHTML = display_name;

        div.appendChild(img);
        div.appendChild(span);
        parent.appendChild(div);
        TOURNAMENT_LIST[i] = {'icon':'home/resrc/game/minion' + (i + 1).toString() + '.png', 'display_name':display_name};
    }
    if (valid)
    {
        Matchs = fill_round(ROUND, shuffle(TOURNAMENT_LIST));
        fill_Match_fight(Matchs[MATCH_INDEX]);
        tournament_asid();
    }
    TOURNAMENT_LIST = [];
    displayNamesSet.clear();
}

const handleUnload = function (e) {
    e.preventDefault();
    e.returnValue = '';
    // return 'Are you sure you want to refresh the page? Any unsaved changes may be lost.';
};

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
// window.addEventListener('beforeunload', handleUnload);

// window.onbeforeunload = function() {
//     return "Dude, are you sure you want to leave? Think of the kittens!";
// }