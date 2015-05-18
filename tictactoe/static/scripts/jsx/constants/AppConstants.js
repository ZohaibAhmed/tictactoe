var keyMirror = require('react/lib/keyMirror');

module.exports = {
	ActionTypes: keyMirror({
		PLAY_POSITION: null,
		RESTART_GAME: null,
		OPPONENT_MOVE: null,
		GAME_OVER: null,
		INVALID_MOVE: null
	}),

	ActionSources: keyMirror({
		SERVER_ACTION: null,
		VIEW_ACTION: null
	})
}