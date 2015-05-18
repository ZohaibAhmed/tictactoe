var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants')
var TicTacToeApi = require('../utils/TicTacToeApi');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var winner = null,
	gameFinished = false,
	board = ['', '', '',
			'', '', '',
			'', '', ''],
	currentPlayer = 'x';

var TicTacToeStore = assign({}, EventEmitter.prototype, {
	setPosition: function(pos, player) {
		board[pos] = player;
	},

	setWinner: function(player) {
		winner = player;
	},

	getPosition: function(pos) {
		return board[pos]
	},

	getWinner: function() {
		return winner;
	},

	isOccupied: function(position) {
		if ((board[position] === 'x' || board[position] === 'o')) {
      		return true;
	    } else {
	    	return false;
	    }
	},

	getBoard: function() {
		return board;
	},

	getPlayer: function() {
		return currentPlayer;
	},

	resetGame: function() {
		winner = null,
		gameFinished = false,
		currentPlayer = 'x',
		board = ['', '', '',
				'', '', '',
				'', '', ''];
	},

	emitChange: function() {
		this.emit(CHANGE_EVENT);
	},

	addChangeListener: function(callback) {
		this.on(CHANGE_EVENT, callback);
	},

	removeChangeListener: function(callback) {
		this.removeListener(CHANGE_EVENT, callback);
	}
});

var opponentMove = function(pos) {
	TicTacToeStore.setPosition(pos, 'o');
	currentPlayer = (currentPlayer === 'o') ? 'x' : 'o';
	return;
}

// Register callback with AppDispatcher
AppDispatcher.register(function(payload) {
	var action = payload.action;

	switch (action.type) {
		case AppConstants.ActionTypes.PLAY_POSITION:
			if (TicTacToeStore.isOccupied(action.pos)) {
				return;
			}

			TicTacToeStore.setPosition(action.pos, currentPlayer); // set the postiion
			currentPlayer = (currentPlayer === 'o') ? 'x' : 'o'; // switch the player

			break;
		case AppConstants.ActionTypes.RESTART_GAME:
			// Restart the game
			TicTacToeStore.resetGame();
			TicTacToeStore.emitChange();
			break;
		case AppConstants.ActionTypes.OPPONENT_MOVE:
			opponentMove(parseInt(action.pos));

			if (action.gameover) {
				TicTacToeStore.setWinner(action.winner);
			}

			// emit the change
			TicTacToeStore.emitChange();
			break;

		case AppConstants.ActionTypes.GAME_OVER:
			TicTacToeStore.setWinner(action.winner);
			TicTacToeStore.emitChange();
			break;
		case AppConstants.ActionTypes.INVALID_MOVE:
			alert("This game is now invalid");
    		TicTacToeStore.resetGame();
			TicTacToeStore.emitChange();
			break;
		default:
			return true;
	}
});

module.exports = TicTacToeStore;