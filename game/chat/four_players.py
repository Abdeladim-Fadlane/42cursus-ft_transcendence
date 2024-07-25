import asyncio, json
from chat.cons import Match, racket, height, width, ww, User, send_to_group, serialize_Users
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from datetime import datetime
from . views import endpoint

rooms = {}
waiting = {}
N = 4
index = 0

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

async def four_players_game(users):
    group_name = 'Match_' + datetime.now().time().strftime("%H_%M_%S_%f")
    rooms[group_name] = Match_4_players(N)
    i = 0
    for u in users:
        u.group_name = group_name
        await u.channel_layer.group_add(group_name, u.channel_name)
        u.racket = racket(int(i / 2) * (width - ww), (i % 2) * int(height / 2) + int(height / 4), (i % 2) * int(height / 2), int(height / 2) + (i % 2) * int(height / 2))
        rooms[group_name].set_player(u, i)
        i += 1
    print("-------------------------task start-------------------------")
    await send_to_group(rooms[group_name].players, {'data':json.dumps(rooms[group_name], default=serialize_Users)});
    await asyncio.sleep(5)
    winners = await rooms[group_name].run_game()
    result = [None] * 2
    result[0] = 'Winner' if winners == 1 else 'Loser'
    result[1] = 'Winner' if winners == 2 else 'Loser'
    for i in range(N):
        if rooms[group_name].players[i].avaible:
            await rooms[group_name].players[i].send(json.dumps({'type':'game.end', 'result':result[int(i / 2)]}))
            rooms[group_name].players[i].avaible = False
            await rooms[group_name].players[i].channel_layer.group_discard(
                group_name,
                rooms[group_name].players[i].channel_name,
            )
            await rooms[group_name].players[i].close()
    del rooms[group_name]

x = 0
class   four_players(AsyncWebsocketConsumer):
    async def connect(self):
        global x
        print("--------------four_players---------------")
        await self.accept()
        self.avaible = True
        query_string = self.scope['query_string'].decode().split('=')[1]
        data = endpoint(query_string)
        self.user = User(data[0])
        # waiting[self.user.username] = self
        waiting[str(x)] = self
        x += 1
        if len(waiting) == N:
            x = 0
            asyncio.create_task(four_players_game(list(waiting.values())))
            waiting.clear()

    async def receive(self, text_data):
        data = json.loads(text_data)
        self.racket.change_direction(data)

    async def send_data(self, event):
        if self.avaible:
            await self.send(event['data'])

    async def disconnect(self, code):
        self.avaible = False
        if self.user.username in waiting:
            del waiting[self.user.username]