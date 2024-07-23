import asyncio, json, math
from datetime import datetime
from . views import endpoint
from channels.generic.websocket import AsyncWebsocketConsumer # type: ignore
from asgiref.sync import sync_to_async
# from auth_app.models import User
import requests
width = 600
height = 300
hh = 80
ww = 10
racket_speed = 1
score_to_win = 2
def add_padding(data):
    return data + '=' * (-len(data) % 4)
import os
from cryptography.fernet import Fernet
class racket:
    def __init__(self, x, y, min, max):
        self.x = x
        self.y = y
        self.min = min
        self.max = max
        self.h = hh
        self.w = ww
        self.vy = 0
        self.score = 0

    def change_direction(self, data):
        if (data == 'Up'):
            self.vy = -racket_speed
        elif (data == 'Down'):
            self.vy = racket_speed
        elif (data == 'Stop'):
            self.vy = 0

    def move(self):
        if self.vy < 0:
            if self.y + self.vy > self.min:
                self.y += self.vy
            else:
                self.y = self.min
        else:
            if self.y + self.vy < self.max - self.h:
                self.y += self.vy
            else:
                self.y = self.max - self.h

    def serialize_racket(self):
        return {
            'x': self.x,
            'y': self.y,
            'h': self.h,
            'w': self.w,
            'score':self.score,
        }

class ball:
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.r = 10
        self.angl = 0
        self.speed = 0.6
        self.vx = math.cos(self.angl * math.pi / 180) * self.speed
        self.vy = math.sin(self.angl * math.pi / 180) * self.speed
    def serialize_ball(self):
        return{
            'x':self.x,
            'y':self.y,
            'r':self.r,
        }

class   Match:
    def __init__(self, N):
        self.players = [None] * N
        self.b = ball(width / 2, height / 2)
        self.team1_score = 0
        self.team2_score = 0
        # self.match_begin = False

    def set_player(self, player, index):
        self.players[index] = player

    def move(self):
        if (self.b.x + self.b.r < ww):
            self.team1_score += 1
            self.b.x = width / 2
            self.b.y = height / 2
            # self.b.__init__(width / 2, height / 2)
            # await asyncio.sleep(1)
        if (self.b.x - self.b.r > width - ww):
            self.team2_score += 1
            self.b.x = width / 2
            self.b.y = height / 2
            # self.b.__init__(width / 2, height / 2)
            # await asyncio.sleep(1)
        if (self.b.vx > 0):
            if ((self.b.x + self.b.r) + self.b.vx < (width - ww)):
                self.b.x += self.b.vx
            else:
                if ((self.b.y) < self.players[1].racket.y or self.b.y >self.players[1].racket.y + hh):
                    self.b.x += self.b.vx
                else:
                    self.b.x += (width - ww) - (self.b.x + self.b.r)
                    self.b.vx = -self.b.vx
        else:
            if (self.b.y < self.players[0].racket.y or self.b.y >self.players[0].racket.y + hh or (self.b.x - self.b.r) + self.b.vx > ww):
                self.b.x += self.b.vx
            else:
                self.b.x = ww + self.b.r
                self.b.vx = -self.b.vx
        if (self.b.vy > 0):
            if (self.b.y + self.b.r + self.b.vy < (height - 0)):
                self.b.y += self.b.vy
            else:
                self.b.y = (height - 0) - self.b.r
                self.b.vy = -self.b.vy
        else:
            if ((self.b.y - self.b.r) + self.b.vy > 0):
                self.b.y += self.b.vy
            else:
                self.b.y = self.b.r + 0
                self.b.vy = -self.b.vy
        for player in self.players:
            player.racket.move()

    async def run_game(self):
        while self.players[0].avaible and self.players[1].avaible:
            self.move()
            await self.players[0].channel_layer.group_send(self.players[0].group_name,
            {
                'type': 'send_data',
                'data':json.dumps(self, default=serialize_Match)
            })
            await asyncio.sleep(0.001)
            if (self.team1_score == score_to_win):
                return 1
            if (self.team2_score == score_to_win):
                return 2
        if self.players[0].avaible:
            self.team1_score = score_to_win
            return 1
        self.team2_score = score_to_win
        return 2

def save_Match(group_name, idx):
    losee_token = rooms[group_name].players[abs(idx-1)].scope['query_string'].decode().split('=')[1]
    key = os.environ.get('encrypt_key')
    f = Fernet(key)
    losee_token = f.decrypt(add_padding(losee_token).encode()).decode()
    headers = {'Authorization': f'Token {losee_token}'}
    body = {
        'lose': rooms[group_name].players[abs(idx-1)].user.lose + 1,
    }
    idloser = rooms[group_name].players[abs(idx-1)].user.id
    url = f'http://auth:8000/api/tasks/{idloser}/'
    requests.patch(url=url, headers=headers, data=body)

    """ update winner score"""
    win_token = rooms[group_name].players[idx].scope['query_string'].decode().split('=')[1]
    win_token = f.decrypt(add_padding(win_token).encode()).decode()
    headers = {'Authorization': f'Token {win_token}'}
    body = {
        'score': rooms[group_name].players[idx].user.score + 10,
        'win': rooms[group_name].players[idx].user.win + 1,
    }
    idwinner = rooms[group_name].players[idx].user.id
    url = f'http://auth:8000/api/tasks/{idwinner}/'
    requests.patch(url=url, headers=headers, data=body)

    """ save match to database"""
    data = {
        'winner': idwinner,
        'loser': idloser,
        'score1': rooms[group_name].team1_score if rooms[group_name].team1_score > rooms[group_name].team2_score else rooms[group_name].team2_score,
        'score2': rooms[group_name].team1_score if rooms[group_name].team1_score < rooms[group_name].team2_score else rooms[group_name].team2_score,}
    url = f'http://auth:8000/api/match/'
    requests.post(url=url, headers=headers, data=data)

async def start_game(group_name):
    winner = await rooms[group_name].run_game()
    result = ['Winner', 'Winner']
    idx = 0
    if winner == 1:
        idx = 1
        result[0] = 'Loser'
    else:
        result[1] = 'Loser'
    for i in range(2):
        if rooms[group_name].players[i].avaible:
            await rooms[group_name].players[i].send(json.dumps({'type':'game.end', 'result':result[i % 2]}))
            rooms[group_name].players[i].avaible = False
            await rooms[group_name].players[i].close()
    save_Match(group_name, idx)
    del rooms[group_name]

def serialize_Match(o):
    return{
        'type':'game.state',
        'players':[{'user': {'login':p.user.username, 'icon':p.user.photo_profile}, 'racket':p.racket.serialize_racket()} for p in o.players],
        'ping':o.b.serialize_ball(),
        'team1_score':o.team1_score,
        'team2_score':o.team2_score,
    }

rooms = {}
group_name = 'Match_' + datetime.now().time().strftime("%H_%M_%S_%f")

class   User:
    def __init__(self, dict):
        for key, value in dict.items():
            setattr(self, key, value)


class RacetCunsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print("----------------connect----------------")
        global group_name
        await self.accept()
        self.avaible = True
        query_string = self.scope['query_string'].decode().split('=')[1]
        key = os.environ.get('encrypt_key')
        f = Fernet(key)
        query_string = f.decrypt(add_padding(query_string).encode()).decode()

        data = endpoint(query_string)        
        self.user = User(data[0])
        self.group_name = group_name
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        if self.group_name in rooms:
            if rooms[self.group_name].players[0].user.username != self.user.username:
                self.racket = racket(width - ww, (height - hh) / 2, 0, height)
                group_name = 'Match_' + datetime.now().time().strftime("%H_%M_%S_%f")
                rooms[self.group_name].set_player(self, 1)
                asyncio.create_task(start_game(self.group_name))
            else:
                await self.close()
        else:
            self.racket = racket(0, (height - hh) / 2, 0, height)
            rooms[self.group_name] = Match(2)
            rooms[self.group_name].set_player(self, 0)

    async def receive(self, text_data):
        global rooms
        data = json.loads(text_data)
        self.racket.change_direction(data)

    async def send_data(self, event):
        if self.avaible:
            await self.send(event['data'])

    async def disconnect(self, event):
        print("----------disconnect-----------")
        self.avaible = False
        if (self.group_name in rooms):
            del rooms[self.group_name]
        await self.channel_layer.group_send(self.group_name,
        {
            'type': 'send_data',
            'data': json.dumps({'type':'game.end', 'result':'Winner'})
        })