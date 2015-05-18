var React = require('react');
var TicTacToeActions = require('../actions/TicTacToeActions');
var TicTacToeStore = require('../stores/TicTacToeStore');

var Menu = React.createClass({
  restartGame: function() {
  	TicTacToeActions.restartGame();
  },
  
  render: function() {
  	var winner = TicTacToeStore.getWinner();
  	var winnerStatement;

  	if (winner) {
  		winnerStatement = "RESULT: THE WINNER IS " + winner.toUpperCase();
  	} else {
  		winnerStatement = "IN PROGRESS";
  	}

    return <div id='Menu'>
    		<div className={"row"}>
    			<div className={"col-md-6"}>
	    			<h4>{winnerStatement}</h4>
    			</div>
    			<div className={"col-md-6"}>
	            	<button className={'btn btn-primary'} onClick={this.restartGame}>Restart</button>
	            </div>
            </div>
        </div>; 
  }
});

module.exports = Menu;