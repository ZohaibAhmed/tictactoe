var React = require('react');
var Menu = require('../components/Menu');
var Tile = require('../components/Tile');
var TicTacToeActions = require('../actions/TicTacToeActions');
var TicTacToeStore = require('../stores/TicTacToeStore');

/** @jsx React.DOM */
var TicTacToe = React.createClass({
  // sets initial state
  getInitialState: function(){
    // Start a new game
    TicTacToeActions.newGame();

    return { 
      currentPlayer: TicTacToeStore.getPlayer(),
      tiles: TicTacToeStore.getBoard()
    };
  },

  componentDidMount: function() {
    TicTacToeStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    TicTacToeStore.removeChangeListener(this._onChange);
  },

  tileClick: function(position, player) {
    if (!TicTacToeStore.isOccupied(position) && !TicTacToeStore.getWinner()) {
      TicTacToeActions.playPosition(position); // play position
      this.setState({tiles: TicTacToeStore.getBoard(), currentPlayer: TicTacToeStore.getPlayer()});
      TicTacToeActions.getOpponentMove(TicTacToeStore.getBoard()); // get opponent move
    }
  },

  render: function() {
    return (
      <div>
        <Menu turn={this.state.turn} />
        <hr></hr>
        <div id='Game'>
          {this.state.tiles.map(function(tile, position) {
            return ( 
                <Tile status={tile} pos={position} turn={this.state.turn} tileClick={this.tileClick} />
              );
          }, this)}
        </div>
        
      </div>
      )
  },

  _onChange: function() {
    this.setState({tiles: TicTacToeStore.getBoard(), currentPlayer: TicTacToeStore.getPlayer()});
  }
});

module.exports = TicTacToe;
