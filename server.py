from tornado import websocket, web, ioloop, httpserver
import tornado
import json

players = {}
incomingMessage = ""



#Extends the tornado websocket handler
class WSHandler(tornado.websocket.WebSocketHandler):
	def check_origin(self,origin):
		return True

	def open(self):
		print("Websocket opened")
		print('Client IP:' + self.request.remote_ip)

	def on_close(self):
		print("WebSocket closed")
		del players[self.request.remote_ip]
		
	def on_message(self, message):
		if len(players) < 1:
			players[self.request.remote_ip] = self
			print(len(players))#print the number of players
			self.handleMessage(message)

		elif len(players) == 1:
			m = json.loads(message)
			if m["type"] == "join":
				players[self.request.remote_ip] = self
				print(len(players))#print the number of players
				#self.sendGameStart(message)
				#send a game start message to both players
				for i in players:
					players[i].sendGameStart(message)

		elif len(players) >= 2:
			m = json.loads(message)
			
			#if the game is full and the message is of type join then send a game full message.
			if m['type'] == "join":
				self.sendGameFull(m)
			
			#if the android player moves
			elif m['type'] == "updateState":
				print("sending position update message")
				for i in players:
					if i is not self.request.remote_ip:
						players[i].write_message(message)
						
			#if the android player completes the level
			elif m["type"] == "level clear":
				print("sending level clear message")
				for i in players:
					if i is not self.request.remote_ip:
						players[i].write_message(message)
						
			#if the android player died			
			elif m["type"] == "death":
				print("Sending a death count update message")
				for i in players:
					if i is not self.request.remote_ip:
						players[i].write_message(message)
						
			elif m["type"] == "placeTrap":
				print("Sending trap position")
				for i in players:
					if i is not self.request.remote_ip:
						players[i].write_message(message)
						
			elif m["type"] == "trapHit":
				print("Sending killed message")
				for i in players:
					if i is not self.request.remote_ip:
						players[i].write_message(message)
						
		"""elif len(players) == 1:
			m=json.loads(message)
			if m["type"] == "updateState":
				print(m["data"])
			elif m["type"] == "level clear":
				print(m["type"] + "" + m["data"])
			elif m["type"] == "death":
				print(m["data"])
			"""

		
	def sendToAll(self):
		for i in players:
			players[i].write_message("Hello"+i)
			print("Hello"+i)
			
	#no longer works...
	def sendToAllButPlayer(self, m):
		for i in players:
			if i is not self.request.remote_ip:
				msg = dict()
				msg["type"] = "click"
				msg["Pos"] = {"X":m["Pos"]["X"], "Y":m["Pos"]["Y"]}
				msg=json.dumps(msg)
				players[i].write_message(msg)
				print("Heyo " + i)

	#for dealing with the first player to join
	def handleMessage(self, message):
		msg=dict()
		#load the incoming message
		incomingMessage = json.loads(message)
		print(incomingMessage)
		
		msg["type"]="waiting"#set your type here
		msg["data"]="waiting for other people" #set your message data here
		msg=json.dumps(msg)
		print(msg)

		for i in players:
			players[i].write_message(msg)
			#send msg back

	#when a second player has joined then send a game start message
	def sendGameStart(self, message):
		msg=dict()
		#load the incoming message
		incomingMessage = json.loads(message)
		print(incomingMessage)

		msg["type"]="gamestart"#set your type here
		msg["data"]="Game starting now" #set your message data here
		msg=json.dumps(msg)
		print(msg)

		for i in players:
			players[i].write_message(msg)

    #if the game is full and someone tries to join
	def sendGameFull(self,message):
		lateJoiners = {}
		lateJoiners[self.request.remote_ip] = self

		msg=dict()
		#load the incoming message
		#incomingMessage = json.loads(message)
		print(incomingMessage)

		msg["type"]="gamefull"#set your type here
		msg["data"]="Game is full. Try again later" #set your message data here
		msg=json.dumps(msg)

		print(msg)
		#keepa list of players that try to join after the game has started. Could probably do something with it in an actual game
		for i in lateJoiners:
			lateJoiners[i].write_message("Game is full. please wait")


app = tornado.web.Application([
	(r'/wstest', WSHandler,)
	])

if __name__ == '__main__':
	#what is 8080?a port
	app.listen(8080)
	tornado.ioloop.IOLoop.instance().start()