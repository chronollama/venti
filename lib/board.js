const Tile = require('./tile');

class Board {
  constructor() {
    this.grid = new Array(8);
    for (let i = 0; i < 8; i ++) {
      this.grid[i] = new Array(7);
    }
    this.highestNumber = null;

  }

  isFull() {

  }

  spaceOccupied(pos) {
    return this.getSpace(pos) ? true : false;
  }

  move(fromPos, toPos) {
    if (this.getSpace(fromPos)) {
      this.setSpace(toPos, this.getSpace(fromPos));
      return true;
    }
    return false;
    // TODO: returning a boolean in this function may not be necessary
  }

  getSpace(pos) {
    return this.grid[pos[0]][pos[1]];
  }

  setSpace(pos, val) {
    this.grid[pos[0]][pos[1]] = val;
    return val;
  }
}

module.exports = Board;
