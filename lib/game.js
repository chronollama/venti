const Board = require('./board');

class Game {
  constructor() {
    this.board = new Board();
  }

  boardState() {
    return this.board.gridState();
  }

  fall() {
    while(this.board.fallStep());
  }

  isLost() {

  }

  isWon() {
    return this.board.highestNumber === 20;
  }

  occupied(pos) {
    return this.board.occupied(pos);
  }

  move(fromPos, toPos) {
    return this.board.move(fromPos, toPos);
    // this function enables the view to update the grid state
  }

  timer() {

  }
}

module.exports = Game;
