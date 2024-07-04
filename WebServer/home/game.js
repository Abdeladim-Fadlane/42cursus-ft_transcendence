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
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();
}

function put_score(score, x, y)
{
    ctx.font = "60px Arial";
    ctx.fillText(score, x,y);
}

function draw_racket(racket)
{
    ctx.fillStyle = "white";
    ctx.fillRect(racket.x, racket.y, racket.w, racket.h);
}

function draw(data)
{
    ctx.clearRect(0, 0, width, height);
    put_center();
    for (let i = 0; i < data.players.length; i++)
        draw_racket(data.players[i].racket);
    draw_ball(data.ping);
    put_score(data.team1_score, width / 2 + (40), 20 / 100 * height);
    put_score(data.team2_score, width / 2 - (60 + 10), 20 / 100 * height);
}

var firs_time = true;

function    disactiv_sections()
{
    document.querySelectorAll('section').forEach(section => {
        section.classList.remove('active');
    });
}

function    active_section(section_id)
{
    disactiv_sections();
    // if (section_id == 'play')
    //     elem.classList.add('active');
    // else
        document.getElementById(section_id).classList.add('active');
}

function    display_ping_pong(data, section_id)
{
    if (firs_time)
    {
        for (let i = 0; i < data.players.length; i++)
        {
            document.getElementById(data.players.length.toString() + "-canvas-display_name-id-" + i.toString()).innerHTML = data.players[i].user.login;
            document.getElementById(data.players.length.toString() + "-canvas-icon-id-" + i.toString()).src = "https://127.0.0.1/" + data.players[i].user.icon;
        }
        active_section(section_id);
        firs_time = false
    }
}

function showResult(result)
{
    const message = document.getElementById('resultMessage');

    var id = 'resultModal';
    if (result == 'Winner')
    {
        message.textContent = 'You Win!';
        message.style.color = 'green';
        // document.getElementById('result-gif').src = "https://cdn.dribbble.com/users/7421625/screenshots/18722898/media/9dc2ccd128c89b19dddd55447ba5e1d0.gif"
        document.getElementById('result-gif').src = "https://mir-s3-cdn-cf.behance.net/project_modules/disp/e70bcc65284623.5aef51b58b0c9.gif";
    }
    else if (result == 'Loser')
    {
        message.textContent = 'You Lose!';
        message.style.color = 'red';
        document.getElementById('resultModal').style.backgroundColor = 'white';
        document.getElementById('result-gif').src = "https://www.shutterstock.com/shutterstock/photos/449380606/display_1500/stock-vector-you-lose-comic-speech-bubble-cartoon-game-assets-449380606.jpg"
    }
    active_section(id);
    // document.getElementById('resultModal').classList.add('active');
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

async function get_url(socket_url)
{
    const response = await fetch('/api/token/');
    if (!response.ok)
        throw new Error('Network response was not ok ' + response.statusText);
    data =  await response.json();
    return `wss://${window.location.host}${socket_url}?token=${data.token}`;
}

async function run(section_id, socket_url, canvas_id)
{
    try
    {
        firs_time = true;
        round = 0;
        if (main_socket)
            main_socket.close(1000, 'Normal Closure');
        elem = document.getElementById(canvas_id);
        ctx = elem.getContext("2d");
        width = elem.width
        height = elem.height
        main_socket = new WebSocket(await get_url(socket_url));

        active_section('loading-section-id');
        // active_section(section_id);
        main_socket.onopen = function(event) {
            console.log("game WebSocket connection established.");
        };

        main_socket.onmessage = function (e)
        {
            var data = JSON.parse(e.data)
            // console.log(data);
            if (data.type == 'game.state')
            {
                display_ping_pong(data, section_id);
                draw(data);
            }
            else if (data.type == 'tournament.info')
            {
                tournament_info(data.players, 'play_tournament');
                firs_time = true;
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
    document.getElementById("home").style.display = 'none';
    if (section_id == 'play')
        run('play', '/wss/game/', '2-canvas-id');
    else if (section_id == 'play_tournament')
        run('play', '/wss/tournament/', '2-canvas-id');
    else if (section_id == 'ping-pong-4')
        run('play-4', '/wss/four_players/', '4-canvas-id');
    else
        active_section(section_id);
}