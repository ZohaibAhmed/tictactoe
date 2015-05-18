var React = require('react');

var Tile = React.createClass({
  clickHandler: function() {
    this.props.tileClick(this.props.pos, this.props.turn);
  },

  render: function() {
    return <div className={this.props.status === '' ? 'tile' : 'tile status-' + this.props.status} onClick={this.clickHandler}>{this.props.status}</div>;
  }
});

module.exports = Tile;