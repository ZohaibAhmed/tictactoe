var AppDispatcher = require('../dispatcher/AppDispatcher');
var Constants = require('../constants/AppConstants');
var request = require('superagent');

module.exports = {
	newGame: function() {
		request
			.get('/newgame')
		    .end(function(err, res){
		    	if (err) throw err;
		    	console.log("NEW GAME: " + res.text);
		    });
	},

	playPosition: function(pos) {
		AppDispatcher.handleViewAction({
			type: Constants.ActionTypes.PLAY_POSITION,
			pos: pos
		});
	},

	restartGame: function() {
		request
			.get('/newgame')
		    .end(function(err, res){
		    	if (err) throw err;
		    	console.log("NEW GAME: " + res.text);

		    	AppDispatcher.handleViewAction({
					type: Constants.ActionTypes.RESTART_GAME
				});
		    });
	},

	getOpponentMove: function(board) {
		// Given the board, get the next move for the opponent
		request
			.get('/move')
			.query({ player: 'x', board: JSON.stringify(board) })
		    .end(function(err, res){
		    	if (err) throw err;

		    	var obj = JSON.parse(res.text);
		    	if (obj['status'] === "OVER") {
		    		AppDispatcher.handleServerAction({
			    		type: Constants.ActionTypes.GAME_OVER,
			    		winner: obj['winner']
			    	});
		    	} else if (obj['status'] === "NOTVALID") { 
		    		AppDispatcher.handleServerAction({
			    		type: Constants.ActionTypes.INVALID_MOVE,
			    	});
		    	} else {
			    	AppDispatcher.handleServerAction({
			    		type: Constants.ActionTypes.OPPONENT_MOVE,
			    		pos: obj['move'],
			    		gameover: obj['gameover'],
			    		winner: obj['winner']
			    	});
			    }
		    });
	}
}