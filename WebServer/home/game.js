var url;

var game_socket = NaN;
var main_socket = NaN;
var elem = NaN;
var ctx = NaN;
var width = NaN;
var height = NaN;
var lastone = "undefinded"

function draw_ball(b)
{
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "white";
    ctx.fill();
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

(async function createWebSocket() {
    try {
        const socket_url = '/wss/main_socket/';
        const url = await get_url(socket_url);
        // const url = `wss://${window.location.host}${socket_url}`;
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
                active_section('refuse_game_id');
            }
        };

        main_socket.onerror = function(event) {
            console.error("WebSocket error observed");
        };

        main_socket.onclose = function(event) {
            console.log("WebSocket connection closed:", event);
        };
    } catch (error) {
        console.error("Error creating WebSocket:", error);
    }
})();

function challenge_lastone()
{
    main_socket.send(JSON.stringify({'type':'room.create', 'vs':lastone}));
    active_section('loading-section-id');
    run('play', '/wss/game/', '2-canvas-id', {'type':'room', 'room_creater':document.getElementById('login').textContent});
}

function challenge_friend(username)
{
    main_socket.send(JSON.stringify({'type':'room.create', 'vs':username}));
    active_section('loading-section-id');
    run('play', '/wss/game/', '2-canvas-id', {'type':'room', 'room_creater':document.getElementById('login').textContent});
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

var first_time = true;

function    disactiv_sections()
{
    document.getElementById("home").style.display = 'none';
    document.getElementById("profile").style.display = 'none';
    document.querySelector('.conteudo').style.display = 'none';
    document.querySelectorAll('section').forEach(section => {
        section.classList.remove('active');
    });
}

function    active_section(section_id)
{
    disactiv_sections();
    document.getElementById(section_id).classList.add('active');
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
    const message = document.getElementById('resultMessage');

    if (result == 'Winner')
    {
        message.textContent = 'Congration You Won!';
        document.getElementById('result-gif').src = '/home/resrc/game/win.gif';
    }
    else if (result == 'Loser')
    {
        message.textContent = 'Sorry You Lost!';
        message.style.color = 'red';
        document.getElementById('result-gif').src = "/home/resrc/game/lost.png";
    }
    active_section('resultModal');
}

function Continue_game(action)
{
    game_socket.send(JSON.stringify({'type':'action', 'action':action}));
    if (action == "Continue")
        active_section('loading-section-id');
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
    run('play', '/wss/game/', '2-canvas-id', {'type':'room', 'room_creater':document.getElementById('game_notification_username_id').innerHTML});
}

function    refuse_game()
{
    document.getElementById('game_notification_id').style.display = 'none';
    main_socket.send(JSON.stringify({'type':'room.refuse', 'vs':document.getElementById('game_notification_username_id').innerHTML}));
}

function closeModal(id) {
    // document.getElementById(id).classList.remove('active');
    disactiv_sections();
    document.getElementById("home").style.display = 'flex';
}

var round = 0;
function    tournament_info(players, section_id)
{
    active_section(section_id);
    for (let i = 0; i < players.length; i++)
    {
        var container = document.getElementById(round.toString() + i.toString());
        var icon = document.createElement("img");
        icon.className = "icon";
        icon.src = '/' + players[i].icon;

        // icon.src = players[i].icon
        var display_name = document.createElement("h2");
        display_name.id = "user-display-name"
        display_name.textContent = players[i].login;
        // display_name.textContent = i;
        container.appendChild(icon);
        container.appendChild(display_name);
    }
    round++;
}

document.addEventListener("keydown", (event) => {
    if (event.key == "ArrowUp")
        game_socket.send(JSON.stringify({'type':'move', 'move':'Up'}));
    else if (event.key == "ArrowDown")
        game_socket.send(JSON.stringify({'type':'move', 'move':'Down'}));
});

document.addEventListener("keyup", (event) => {
    if (event.key == "ArrowUp" || event.key == "ArrowDown")
        game_socket.send(JSON.stringify({'type':'move', 'move':'Stop'}));
});

function    tournament_list(data)
{
    // history.pushState(null, '', '/tournamet/');
    document.getElementById('tournament_input').style.display = 'none';
    parent = document.getElementById('tournament_content');
    parent.innerHTML = '';
    data.players.forEach((element) =>{
        var div = document.createElement("div");
        div.className = "student";

        var img = document.createElement("img");
        img.className = "student-icon"
        img.src = '/' + element.icon;

        var span = document.createElement("span");
        span.className = "student-name";
        span.innerHTML = element.login;

        div.appendChild(img);
        div.appendChild(span);
        parent.appendChild(div);
        });
    active_section('tournament_list');
    document.querySelector('.conteudo').style.display = 'flex';
}

async function run(section_id, socket_url, canvas_id, type)
{
    try
    {
        // history.pushState(null, '', '/game/');
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
            if (data.type == 'game.info')
                display_ping_pong(data);
            else if (data.type == 'game.state')
            {
                if (first_time)
                {
                    active_section(section_id)
                    // var countdown = 3;
                    // const interval = setInterval(() => {
                    //     ctx.clearRect(0, 0, width, height);
                    //     put_score(countdown, width / 2, height / 2);
                    //     if (countdown == 1)
                    //         clearInterval(interval);
                    //     countdown -= 1;
                    // }, 1000);
                }
                draw(data);
            }
            else if (data.type == 'tournament.list')
                tournament_list(data);
            else if (data.type == 'tournament.info')
            {
                tournament_info(data.players, 'play_tournament');
                first_time = true;
            }
            else if (data.type == 'game.end')
                showResult(data.result);
            else if (data.type == 'tournament.end')
                active_section('win-tournament-id');
        }
    }
    catch (error)
    {
        console.error('Error fetching data:', error);
    }
}

function navigate(section_id) {
    if (section_id == 'play')
    {
        active_section('loading-section-id');
        run('play', '/wss/game/', '2-canvas-id', {'type':'random', 'vs':'undefined'});
    }
    else if (section_id == 'play_tournament')
    {
        active_section('tournament_list');
        run('play', '/wss/tournament/' , '2-canvas-id', {'type':'random', 'vs':'undefined'});
    }
    else if (section_id == 'ping-pong-4')
    {
        active_section('loading-section-id');
        run('play-4', '/wss/four_players/', '4-canvas-id', {'type':'random', 'vs':'undefined'});
    }
    else if (section_id == 'tournament_input')
    {
        disactiv_sections();
        document.getElementById('tournament_input').style.display = 'flex';
    }
    else
        active_section(section_id);
}

document.addEventListener('DOMContentLoaded', function() {
        // disactiv_sections();
        // document.getElementById('start_fight').style.display = 'block';
        // history.replaceState(null, '', '/');
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
});