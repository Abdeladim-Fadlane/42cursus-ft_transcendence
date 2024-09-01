import asyncio, json, math, random
from datetime import datetime
from chat.cons import Match, User, send_to_group, racket, height, hh, width, ww, score_to_win, serialize_Users
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from . views import endpoint
import os
from . cons import add_padding
from cryptography.fernet import Fernet
N = 8
waiting = {}
tournaments = {}
tournament_name = 'tournament_' + datetime.now().time().strftime("%H_%M_%S_%f")

def serialize_Match(o):
    return{
        'type':'game.state',
        'players':[{'login':p.user.username, 'icon':p.user.photo_profile, 'racket':p.racket.serialize_racket()} for p in o.players],
        'ping':o.b.serialize_ball(),
        'team1_score':o.team1_score,
        'team2_score':o.team2_score,
    }

async def full_tournament(users, tournament_name):
    # await asyncio.sleep(3)
    random.shuffle(users)
    tournaments[tournament_name] = {}
    while len(users) > 1:
        group_name = None
        for i in range(len(users)):
            if i % 2 == 0:
                group_name = 'Match_' + datetime.now().time().strftime("%H_%M_%S_%f")
            users[i].tournament_name = tournament_name
            users[i].group_name = group_name
            users[i].next_index = int(i / 2)
            await users[i].channel_layer.group_add(users[i].group_name, users[i].channel_name)
            # await users[i].channel_layer.group_add(tournament_name, users[i].channel_name)
            if i % 2 == 1:
                users[i].racket = racket((width - ww), (height - hh) / 2, 0, height)
                users[i - 1].racket = racket(0, (height - hh) / 2, 0, height)
                tournaments[tournament_name][users[i].group_name] = Match(2)
                tournaments[tournament_name][users[i].group_name].set_player(users[i - 1], 0)
                tournaments[tournament_name][users[i].group_name].set_player(users[i], 1)
        await tournaments[tournament_name][group_name].players[0].channel_layer.group_send(tournament_name,
        {
            'type': 'send_data',
            'data':json.dumps({'type':'tournament.info', 'players':[{'login':u.user.display_name, 'icon':u.user.photo_profile} for u in users]})
        })
        users.clear()
        await asyncio.sleep(3)
        # for m in tournaments[tournament_name].values():
        #     await send_to_group(m.players, {'data':json.dumps(m, default=serialize_Users)})
        await asyncio.sleep(3)
        tasks = [asyncio.create_task(run_game(m)) for m in tournaments[tournament_name].values()]
        users = await asyncio.gather(*tasks)
        tasks.clear()
        tournaments[tournament_name].clear()
        users = sorted(users, key=lambda item: item.next_index)
        await asyncio.sleep(3)
    if len(users) > 0:
        await users[0].send(json.dumps({'type':'tournament.end', 'result':'Booyah'}))
    users.clear()

async def run_game(match):
    while match.players[0].avaible and match.players[1].avaible:
        match.move()
        await match.players[0].channel_layer.group_send(match.players[0].group_name, #await
        {
            'type': 'send_data',
            'data':json.dumps(match, default=serialize_Match)
        })
        await asyncio.sleep(0.001)
        if (match.team2_score == score_to_win):
            await match.players[0].send(json.dumps({'type':'game.end', 'result':'Winner'}))
            await match.players[1].send(json.dumps({'type':'game.end', 'result':'Loser'}))
            await match.players[1].channel_layer.group_discard(
                match.players[1].group_name,
                match.players[1].channel_name
            )
            await match.players[1].channel_layer.group_discard(
                match.players[1].tournament_name,
                match.players[1].channel_name
            )
            match.players[1].avaible = False
            await match.players[1].close()
            return match.players[0]
        elif (match.team1_score == score_to_win):
            await match.players[1].send(json.dumps({'type':'game.end', 'result':'Winner'}))
            await match.players[0].send(json.dumps({'type':'game.end', 'result':'Loser'}))
            await match.players[0].channel_layer.group_discard(
                match.players[0].group_name,
                match.players[0].channel_name
            )
            await match.players[0].channel_layer.group_discard(
                match.players[0].tournament_name,
                match.players[0].channel_name
            )
            match.players[0].avaible = False
            await match.players[0].close()
            return match.players[1]
    if match.players[0].avaible:
        await match.players[0].send(json.dumps({'type':'game.end', 'result':'Winner'}))
        return (match.players[0])
    elif match.players[1].avaible:
        await match.players[1].send(json.dumps({'type':'game.end', 'result':'Winner'}))
        return (match.players[1])

x = 1
class   Tournament(AsyncWebsocketConsumer):
    async def connect(self):
        # global x
        global tournament_name
        print("------------Tournament---------------")
        await self.accept()
        self.group_name = "None"
        self.avaible = True
        query_parameters = self.scope['query_string'].decode().split('&')
        token = query_parameters[0].split('=')[1]
        key = os.environ.get('encrypt_key')
        f = Fernet(key)
        token = f.decrypt(add_padding(token).encode()).decode()
        id = query_parameters[1].split('=')[1]
        game_typ = query_parameters[2].split('=')[1]
        data = endpoint(token, id)
        self.user = User(data)
        self.tournament_name = tournament_name
        await self.channel_layer.group_add(self.tournament_name, self.channel_name)
        ########################
        # if self.user.username in waiting:
        #     waiting[self.user.username].send("you are already in another connection biiiiiitch")
        #     self.close()
        # waiting[self.user.login] = self
        ########################
        #***********************#
        global x
        # self.user.x = x
        waiting[str(x)] = self
        self.x = str(x)
        x += 1
        #***********************#
        await self.channel_layer.group_send(self.tournament_name,
        {
            'type': 'send_data',
            'data':json.dumps({'type':'tournament.list', 'players':[{'login':u.user.display_name, 'icon':u.user.photo_profile} for u in waiting.values()]})
        })
        if len(waiting) == N:
            # x = 1
            asyncio.create_task(full_tournament(list(waiting.values()), tournament_name))
            tournament_name = 'tournament_' + datetime.now().time().strftime("%H_%M_%S_%f")
            waiting.clear()

    async def receive(self, text_data):
        data = json.loads(text_data)
        if data.get('type') == 'move':
            self.racket.change_direction(data.get('move'))

    async def send_data(self, event):
        if self.avaible:
            await self.send(event['data'])

    async def disconnect(self, code):
        print("---------------disconnect---------------------------", code)
        #################################################################
        if (self.x in waiting):
            del waiting[self.x]
            await self.channel_layer.group_send(self.tournament_name,
            {
                'type': 'send_data',
                'data':json.dumps({'type':'tournament.list', 'players':[{'login':u.user.display_name, 'icon':u.user.photo_profile} for u in waiting.values()]})
            })
        #################################################################
        if self.user.username in waiting:
            del waiting[self.user.login]
            await self.channel_layer.group_send(self.tournament_name,
            {
                'type': 'send_data',
                'data':json.dumps({'type':'tournament.list', 'players':[{'login':u.user.display_name, 'icon':u.user.photo_profile} for u in waiting.values()]})
            })
        await self.channel_layer.group_discard(
            self.tournament_name,
            self.channel_name
        )
        await self.channel_layer.group_discard(
                self.group_name,
                self.channel_name
            )
        self.avaible = False