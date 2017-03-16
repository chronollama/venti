const Board = require('./board');

class Game {
  constructor() {
    this.board = new Board();
    this.isLost = false;
  }

  addRow() {
    if (this.board.atTopRow()) { this.isLost = true; }
    else { this.board.addRow(); }
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

  occupied(pos) {
    return this.board.occupied(pos);
  }

  move(toPos) {
    if (this.board.move(toPos) === "mismatch") {
      this.addRow();
    }
    if (this.board.highestNumber === 20) { this.isWon = true; }
  }
}

module.exports = Game;
