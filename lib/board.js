const Tile = require('./tile');

class Board {
  constructor() {
    const startTiles = Board.generateTiles(true);
    this.grid = new Array(8);
    this.grid[0] = startTiles.slice(0, 7);
    this.grid[1] = startTiles.slice(7);
    for (let i = 2; i < 8; i++) {
      this.grid[i] = new Array(7);
    }

    this.highestNumber = null;
  }

  static generateTiles(setup = false) {
    let values;
    if (setup) {
      values = [1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 5];
    } else {
      values = [1, 1, 2, 2, 3, 4, 5];
    }
    Board.shuffle(values);
    return values.map((value) => {
      return new Tile(value);
    });
  }

  static shuffle (array) {
    let i = 0, j = 0, temp = null;
    for (i = array.length - 1; i > 0; i -= 1) {
      j = Math.floor(Math.random() * (i + 1));
      temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }

  atTopRow() {
    return this.grid[7].some((el) => el !== null);
  }

  gridState() {
    let state = {};
    let key = 1;
    this.grid.forEach((row, rowIdx) => {
      row.forEach((space, colIdx) => {
        if (space) {
          state[key] = {row: rowIdx, col: colIdx, num: space.number};
        }
        key++;
      });
    });
    return state;
  }

  move(fromPos, toPos) {
    if (this.getSpace(fromPos)) {
      this.setSpace(toPos, this.getSpace(fromPos));
      return true;
    }
    return false;
    /* TODO:
      returning a boolean in this function may not be necessary
    */
  }

  getSpace(pos) {
    return this.grid[pos[0]][pos[1]];
  }

  setSpace(pos, val) {
    this.grid[pos[0]][pos[1]] = val;
    return val;
  }

  spaceOccupied(pos) {
    return this.getSpace(pos) ? true : false;
  }
}

module.exports = Board;
