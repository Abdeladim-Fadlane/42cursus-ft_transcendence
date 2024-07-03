var url;

var main_socket = NaN;
var elem = NaN;
var ctx = NaN;
var width = NaN;
var height = NaN;

function draw_ball(b)
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

var first_time = true;

function    disactiv_sections()
{
    document.getElementById("home").style.display = 'none';
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

function    display_ping_pong(data, section_id)
{
    if (first_time)
    {
        first_time = false        
        for (let i = 0; i < data.players.length; i++)
        {
            document.getElementById(data.players.length.toString() + "-canvas-display_name-id-" + i.toString()).innerHTML = data.players[i].login;
            document.getElementById(data.players.length.toString() + "-canvas-icon-id-" + i.toString()).src = "https://127.0.0.1/" + data.players[i].icon;
        }
        active_section(section_id);
        console.log('-----------display_ping_pong--------');
        var countdown = 3;
        const interval = setInterval(() => {
            ctx.clearRect(0, 0, width, height);
            put_score(countdown, width / 2, height / 2);
            if (countdown == 1)
                clearInterval(interval);
            countdown -= 1;
        }, 1000);
    }
}

function showResult(result)
{
    const message = document.getElementById('resultMessage');

    var id = 'resultModal';
    if (result == 'Winner')
    {
        message.textContent = 'You Won!';
        message.style.color = 'green';
        document.getElementById('result-gif').src = "https://mir-s3-cdn-cf.behance.net/project_modules/disp/e70bcc65284623.5aef51b58b0c9.gif";
    }
    else if (result == 'Loser')
    {
        message.textContent = 'You Lost!';
        message.style.color = 'red';
        document.getElementById('resultModal').style.backgroundColor = 'white';
        document.getElementById('result-gif').src = "https://www.shutterstock.com/shutterstock/photos/449380606/display_1500/stock-vector-you-lose-comic-speech-bubble-cartoon-game-assets-449380606.jpg"
    }
    active_section(id);
}

function closeModal() {
    document.getElementById('resultModal').classList.remove('active');
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
        console.log(players[i].icon);
        icon.src = "https://127.0.0.1/" + players[i].icon;

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
        main_socket.send(JSON.stringify('Up'));
    else if (event.key == "ArrowDown")
        main_socket.send(JSON.stringify('Down'));
});

document.addEventListener("keyup", (event) => {
    if (event.key == "ArrowUp" || event.key == "ArrowDown")
        main_socket.send(JSON.stringify('Stop'));
});

async function get_url(socket_url, parameters)
{
    const response = await fetch('/api/token/');
    if (!response.ok)
        throw new Error('Network response was not ok ' + response.statusText);
    data =  await response.json();
    return `wss://${window.location.host}${socket_url}?token=${data.token}`;
}

function    tournament_list(data)
{
    document.getElementById('tournament_input').style.display = 'none';
    parent = document.getElementById('tournament_content');
    parent.innerHTML = '';
    data.players.forEach((element) =>{
        var div = document.createElement("div");
        div.className = "student";

        var img = document.createElement("img");
        img.className = "student-icon"
        img.src = "https://127.0.0.1/" + element.icon;

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

async function run(section_id, socket_url, canvas_id)
{
    try
    {
        first_time = true;
        round = 0;
        if (main_socket)
            main_socket.close(1000, 'Normal Closure');
        elem = document.getElementById(canvas_id);
        ctx = elem.getContext("2d");
        width = elem.width
        height = elem.height
        main_socket = new WebSocket(await get_url(socket_url));

        main_socket.onopen = function(event) {
            console.log("game WebSocket connection established.");
        };

        main_socket.onmessage = function (e)
        {
            var data = JSON.parse(e.data)
            // console.log(data);
            if (data.type == 'game.info')
                display_ping_pong(data, section_id);
            else if (data.type == 'game.state')
            {
                draw(data);
                // console.log("iej")
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
    console.log(section_id);
    if (section_id == 'play')
    {
        active_section('loading-section-id');
        run('play', '/wss/game/', '2-canvas-id');
    }
    else if (section_id == 'play_tournament')
    {
        active_section('tournament_list');
        run('play', '/wss/tournament/' , '2-canvas-id');
    }
    else if (section_id == 'ping-pong-4')
    {
        active_section('loading-section-id');
        run('play-4', '/wss/four_players/', '4-canvas-id');
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
            {
                console.log('hello');
                navigate('play_tournament');
            }
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
    (function get_csrf_token(){
        fetch('/api/csrf-token/')
        .then(response => response.json())
        .then(data => {
            document.getElementById('display_name_csrfToken').value = data.csrfToken;
        })
        .catch(error => console.error('Error fetching CSRF token:', error));
    })();
    console.log(document.getElementById('home').style.display);
    document.getElementById('home').style.display = 'none';
});