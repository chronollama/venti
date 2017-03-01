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
    return this.space(pos) ? true : false;
  }

  move(fromPos, toPos) {

  }

  space(pos) {
    return this.grid[pos[0]][pos[1]];
  }
}
