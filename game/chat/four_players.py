import asyncio, json
from chat.cons import Match, racket, height, width, ww, User, send_to_group, score_to_win, serialize_Match
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from datetime import datetime
from . views import endpoint
import os

rooms = {}
waiting = {}
N = 4

class   Match_4_players(Match):
    def __init__(self, n):
        super().__init__(n)

    def move(self):
        if (self.b.x + self.b.r < ww):
            self.team2_score += 1
            # self.b.__init__(width / 2, height / 2, 1)
            self.b.x = width / 2
            self.b.y = height / 2
            # await asyncio.sleep(1)
        if (self.b.x - self.b.r > width - ww):
            self.team1_score += 1
            self.b.x = width / 2
            self.b.y = height / 2
            # self.b.__init__(width / 2, height / 2, 0)
            # await asyncio.sleep(1)
        if (self.b.vx > 0):
            if (self.b.x + self.b.r) + self.b.vx < (width - ww):
                self.b.x += self.b.vx
            else:
                if self.b.y < self.players[2].racket.y:
                    self.b.x += self.b.vx
                elif self.b.y > self.players[3].racket.y + self.players[3].racket.h:
                    self.b.x += self.b.vx
                elif self.b.y > self.players[2].racket.y + self.players[2].racket.h and self.b.y < self.players[3].racket.y:
                    self.b.x += self.b.vx
                else:
                    self.b.x = (width - ww) - self.b.r
                    self.b.vx = -self.b.vx
        else:
            if (self.b.x - self.b.r) + self.b.vx > ww:
                self.b.x += self.b.vx
            else:
                if self.b.y < self.players[0].racket.y:
                    self.b.x += self.b.vx
                elif self.b.y > self.players[1].racket.y + self.players[1].racket.h:
                    self.b.x += self.b.vx
                elif self.b.y < self.players[1].racket.y and self.b.y > self.players[0].racket.y + self.players[0].racket.h:
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
        await send_to_group(self.players, {'data':json.dumps(self, default=serialize_Match)})
        for channel in self.players:
            await channel.send(json.dumps({'type':'game.countdown', 'time':3}))
        await asyncio.sleep(4)
        while self.players[0].avaible and self.players[1].avaible and self.players[2].avaible and self.players[3].avaible:
            self.move()
            await send_to_group(self.players, {'data':json.dumps(self, default=serialize_Match)})
            if (self.team1_score == score_to_win):
                return 1
            if (self.team2_score == score_to_win):
                return 2
            await asyncio.sleep(0.001)
        if self.players[0].avaible and self.players[1].avaible:
            return 1
        else:
            return 2

async def four_players_game(users):
    group_name = 'Match_' + datetime.now().time().strftime("%H_%M_%S_%f")
    rooms[group_name] = Match_4_players(N)
    i = 0
    for u in users:
        u.group_name = group_name
        await u.channel_layer.group_add(group_name, u.channel_name)
        u.racket = racket(int(i / 2) * (width - ww), (i % 2) * int(height / 2) + int(height / 4), (i % 2) * int(height / 2), int(height / 2) + (i % 2) * int(height / 2))
        rooms[group_name].set_player(u, i)
        u.index = i
        i += 1
    winners = await rooms[group_name].run_game()
    result = [None] * 2
    result[0] = 'Winner' if winners == 1 else 'Loser'
    result[1] = 'Winner' if winners == 2 else 'Loser'
    for i in range(N):
        if rooms[group_name].players[i].avaible:
            await rooms[group_name].players[i].send(json.dumps({'type':'game.end', 'result':result[int(i / 2)]}))
            print("username", rooms[group_name].players[i].user.username, "result---------->", result[int(i / 2)])
            # await rooms[group_name].players[i].channel_layer.group_discard(
            #     group_name, 
            #     rooms[group_name].players[i].channel_name,
            # )
            rooms[group_name].players[i].avaible = False
            await rooms[group_name].players[i].close()
    del rooms[group_name]

class   four_players(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        self.index = -1
        self.avaible = True
        self.group_name = None
        query_parameters = self.scope['query_string'].decode().split('&')
        token = query_parameters[0].split('=')[1]
        id = query_parameters[1].split('=')[1]
        data = endpoint(token, id)
        self.user = User(data)
        print("four_player_connect:::::::::::", self.user.username)
        if self.user.username in waiting:
            await waiting[self.user.username].send(json.dumps({'type':'discard', 'game_type':'four_players_game'}))
            waiting[self.user.username].avaible = False
            await waiting[self.user.username].close()
        waiting[self.user.username] = self
        for u in waiting.values():
            await u.send(json.dumps({'type':'game_wait', 'waiting':N - len(waiting)}))
        if len(waiting) == N:
            asyncio.create_task(four_players_game(list(waiting.values())))
            waiting.clear()

    async def receive(self, text_data):
        data = json.loads(text_data)
        if data.get('type') == 'move':
            self.racket.change_direction(data.get('move'))

    async def send_data(self, event):
        if self.avaible:
            await self.send(event['data'])

    async def disconnect(self, code):
        if self.user.username in waiting:
            if self.avaible:
                del waiting[self.user.username]
            for u in waiting.values():
                await u.send(json.dumps({'type':'game_wait', 'waiting':N - len(waiting)}))
        if self.group_name:
            r = int(self.index / 2)
            for i in range(N):
                if self.group_name in rooms and rooms[self.group_name].players[i].avaible:
                    if int(rooms[self.group_name].players[i].index / 2) == r:
                        await rooms[self.group_name].players[i].send(json.dumps({'type':'game.end', 'result':'Loser'}))
                    else:
                        await rooms[self.group_name].players[i].send(json.dumps({'type':'game.end', 'result':'Winner'}))
                    rooms[self.group_name].players[i].avaible = False
                    await rooms[self.group_name].players[i].close()
            if self.group_name in rooms:
                del rooms[self.group_name]
        self.avaible = False