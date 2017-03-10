const Board = require('./board');

class Game {
  constructor() {
    this.board = new Board();
  }

  addRow() {
    this.board.addRow();
  }

  boardState() {
    return this.board.gridState();
  }

  fall(colIdx) {
    let shouldFall = true;
    while (shouldFall) {
      shouldFall = this.board.fallStep(colIdx);
    }
  }

  grabTile(pos) {
    this.board.grabTile(pos);
  }

  isLost() {

  }

  isWon() {
    return this.board.highestNumber === 20;
  }

  occupied(pos) {
    return this.board.occupied(pos);
  }

  move(toPos) {
    return this.board.move(toPos);
    // this function enables the view to update the grid state
  }
}

module.exports = Game;
