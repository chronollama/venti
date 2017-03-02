const Board = require('./board');

class Game {
  constructor() {
    this.board = new Board();
  }

  boardState() {
    return this.board.gridState();
  }

  isLost() {

  }

  isWon() {
    return this.board.highestNumber === 20;
  }

  spaceOccupied(pos) {
    return this.board.spaceOccupied(pos);
  }

  move(fromPos, toPos) {
    return this.board.move(fromPos, toPos);
    // this function enables the view to update the grid state
  }

  timer() {

  }
}

module.exports = Game;
