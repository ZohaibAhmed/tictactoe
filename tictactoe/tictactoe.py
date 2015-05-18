import random
class TicTacToe(object):

	def __init__(self, board):
		self.board = board
		self.winning_combinations = ([0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6])

	def get_board(self):
		return self.board

	def get_valid_moves(self):
		return [k for k, v in enumerate(self.board) if v == '']

	def get_squares(self, player):
		return [k for k, v in enumerate(self.board) if v == player]

	def get_combos(self, player):
		return self.get_valid_moves(board) + get_squares(player)

	def winner(self):
		'''
			Return if any of the two players are winners
		'''
		for player in ('x', 'o'):
			positions = self.get_squares(player)

			for combination in self.winning_combinations:
				is_winner = True

				for pos in combination:
					if pos not in positions:
						is_winner = False

				if is_winner:
					return player

		return None

	def complete(self):
		'''
			Check to see if the game is complete (tied or winner)
		'''
		if '' not in [v for v in self.board]:
			return True

		elif self.winner() != None:
			return True

		return False


	def set_move(self, position, player):
		self.board[position] = player

	def enemy(self, player):
		if player == 'x':
			return 'o'
		return 'x'

	def alpha_beta(self, board, player, alpha, beta):
		'''
			Using alpha-beta pruning to determine the next best move
		'''
		if board.complete():
			winner = board.winner()
			if winner == "x":
				return -1
			elif winner is None:
				return 0
			elif winner == "o":
				return 1

		for each_move in board.get_valid_moves():
			board.set_move(each_move, player)
			val = board.alpha_beta(board, board.enemy(player), alpha, beta)
			board.set_move(each_move, '')
			
			if player == 'o':
				if val > alpha:
					alpha = val
				if alpha >= beta:
					return beta

			else:
				if val < beta:
					beta = val
				if beta <= alpha:
					return alpha

		if player == 'o':
			return alpha
		else:
			return beta