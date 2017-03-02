const Board = require('./board');

class Game {
  constructor() {
    this.board = new Board();
  }

  isLost() {
    return this.board.isFull();
  }

  isWon() {
    return this.board.highestNumber === 20;
  }

  spaceOccupied(pos) {
    return this.board.spaceOccupied(pos);
  }

  move(fromPos, toPos) {
    return this.board.move(fromPos, toPos);
  }

  timer() {

  }
}

module.exports = Game;
