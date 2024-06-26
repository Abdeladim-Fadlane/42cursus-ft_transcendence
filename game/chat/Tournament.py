import asyncio, json, math, random
# from chat.game import serialize_pingpong
from datetime import datetime
from chat.cons import Match, serialize_Match, User, racket, height, hh, width, ww, score_to_win
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from . views import endpoint

N = 4
waiting = {}
tournaments = {}
tournament_name = 'tournament_' + datetime.now().time().strftime("%H_%M_%S_%f")

async def full_tournament(users):
    # random.shuffle(users)
    tournament_name = 'tournament_' + datetime.now().time().strftime("%H_%M_%S_%f")
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
            await users[i].channel_layer.group_add(tournament_name, users[i].channel_name)
            if i % 2 == 1:
                users[i].racket = racket((width - ww), (height - hh) / 2, 0, height)
                users[i - 1].racket = racket(0, (height - hh) / 2, 0, height)
                tournaments[tournament_name][users[i].group_name] = Match(2)
                tournaments[tournament_name][users[i].group_name].set_player(users[i - 1], 0)
                tournaments[tournament_name][users[i].group_name].set_player(users[i], 1)
        await tournaments[tournament_name][group_name].players[0].channel_layer.group_send(tournament_name,
        {
            'type': 'send_data',
            'data':json.dumps({'type':'tournament.info', 'players':[{'login':u.user.username, 'icon':u.user.photo_profile} for u in users]})
        })
        users.clear()
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
        global x
        print("------------Tournament---------------")
        await self.accept()
        self.tournament_name = "None"
        self.group_name = "None"
        self.avaible = True
        query_string = self.scope['query_string'].decode().split('=')[1]
        data = endpoint(query_string)
        self.user = User(data[0])
        self.user.x = x
        x += 1
        await self.channel_layer.group_add('global_group', self.channel_name)
        # if self.user.login in waiting:
            # waiting[self.user.login].send("you are already in another connection biiiiiitch")
        # waiting[self.user.login] = self
        waiting[str(x)] = self
        await tournaments[tournament_name][group_name].players[0].channel_layer.group_send(tournament_name,
        {
            'type': 'send_data',
            'data':json.dumps({'type':'tournament.info', 'players':[{'login':u.user.username, 'icon':u.user.photo_profile} for u in users]})
        })
        if len(waiting) == N:
            x = 1
            asyncio.create_task(full_tournament(list(waiting.values())))
            waiting.clear()

    async def receive(self, text_data):
        data = json.loads(text_data)
        self.racket.change_direction(data)

    async def send_data(self, event):
        if self.avaible:
            await self.send(event['data'])

    async def disconnect(self, code):
        if self.user.username in waiting:
            del waiting[self.user.login]
        else:
            if self.avaible:
                await self.channel_layer.group_discard(
                        self.tournament_name,
                        self.channel_name
                    )
                await self.channel_layer.group_discard(
                        self.group_name,
                        self.channel_name
                    )
        self.avaible = False