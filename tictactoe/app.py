from flask import Flask, render_template, session, request
from flask.ext.redis import FlaskRedis
from tictactoe import TicTacToe
import uuid, random, json

app = Flask(__name__)
app.secret_key = "Thisismysecret"
store = FlaskRedis(app) # storing all the games

def is_gameOver(ttt):
	'''
		Check to see if the game is over
	'''
	if ttt.complete():
		winner = ttt.winner()
		if winner:
			return winner
		else:
			return "TIE"

	return None

def difference(current_session_board, player_board):
	'''
		Get the number of differences between the state that is saved and the state that is sent by the player
	'''
	differences = 0
	for i in range(len(player_board)):
		if current_session_board[i] != player_board[i]:
			differences += 1

	return differences

def enemy(player):
	'''
		Return the enemy player
	'''
	if player == 'x':
		return 'o'
	return 'x'

def determine_move(board, player):
	'''
		Given the board and the player, get the next move
	'''
	tmp = -2
	moves = []
	available = board.get_valid_moves()

	if len(available) == 9:
		return 4

	for each_move in board.get_valid_moves():
		board.set_move(each_move, player)
		val = board.alpha_beta(board, board.enemy(player), -2, 2)
		board.set_move(each_move, '')

		if val > tmp:
			tmp = val
			moves = [each_move]
		elif val == tmp:
			moves.append(each_move)

	return random.choice(moves)

@app.route('/')
def index():
	# create a token for this game
	token = str(uuid.uuid4())
	session['uuid'] = token
	board = ['', '', '', '', '', '', '', '', '']
	# store the current state of the game in redis
	store.lpush(uuid, *board)

	return render_template('index.html')

@app.route('/newgame', methods=['GET'])
def newgame():
	board = ['', '', '', '', '', '', '', '', '']
	# Reset the current state to blank
	store.delete(session['uuid'])
	store.lpush(session['uuid'], *board)

	return 'OK'

@app.route('/move', methods=['GET'])
def move():
	# Get the current state of the game
	current_state = store.lrange(session['uuid'], 0, -1)
	current_state.reverse()

	player_board = json.loads(request.args['board'])
	player = request.args['player']

	# find out if there are more than 1 differences in between the last state and this one
	if difference(current_state, player_board) > 1:
		return json.dumps({"status": "NOTVALID"}) # Prevent cheating

	ai = enemy(player)
	ttt = TicTacToe(player_board)

	# Check to see if the game is over after the player made a move
	gameover = is_gameOver(ttt)
	if gameover:
		return json.dumps({"status": "OVER", "winner": gameover})

	move = determine_move(ttt, ai)
	ttt.set_move(move, ai)

	# Set the new state in the store
	store.delete(session["uuid"])
	store.lpush(session['uuid'], *ttt.get_board())

	# check to see if the game is over after the AI made a move
	gameover = is_gameOver(ttt)
	if gameover:
		return json.dumps({"status": "MOVE", "move": str(move), "gameover": True, "winner": gameover})

	# Get the next move
	return json.dumps({"status": "MOVE", "move": str(move), "gameover": False, "winner": None})

if __name__ == '__main__':
	app.run(debug=True)

