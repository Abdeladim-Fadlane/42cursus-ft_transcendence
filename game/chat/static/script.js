var v = document.getElementById("canvas");
var h = v.getContext("2d");

function clear_rec()
{
    h.clearRect(0, 0, v.width, v.height);
}

function draw_rec(x, y)
{
    clear_rec();
    h.beginPath();
    h.arc(x, y, 5, 0, Math.PI * 2);
    h.stroke();
    h.fillStyle = "black";
    h.fill();
}

const url = `ws://${window.location.host}/ws/socket-server/`
const chatsocket = new WebSocket(url);

chatsocket.onmessage = function (e)
{
    let data = JSON.parse(e.data)
    draw_rec(data.x, data.y);
    // console.log(data);
}