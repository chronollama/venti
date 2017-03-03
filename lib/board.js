const Tile = require('./tile');

class Board {
  constructor() {
    const startTiles = Board.generateTiles(true);
    this.grid = new Array(8);
    this.grid[0] = startTiles.slice(0, 7);
    this.grid[1] = startTiles.slice(7);
    for (let i = 2; i < 8; i++) {
      this.grid[i] = [null, null, null, null, null, null, null];
    }
    this.highestNumber = 5;
  }

  static generateTiles(setup = false) {
    let values;
    if (setup) {values = [1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 5];}
    else {values = [1, 1, 2, 2, 3, 4, 5];}
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

  fallStep() {
    let didFall = false;
    for (let rowIdx = 1; rowIdx < this.grid.length; rowIdx++) {
      const row = this.grid[rowIdx];
      for (let colIdx = 0; colIdx < row.length; colIdx++) {
        const space = row[colIdx];
        if (space && this.shouldFall([rowIdx, colIdx])) {
          this.move([rowIdx, colIdx], [rowIdx - 1, colIdx]);
          didFall = true;
        }
      }
    }
    return didFall;
  }

  getSpace(pos) {
    return this.grid[pos[0]][pos[1]];
  }

  gridState() {
    let state = {};
    let key = 1;
    for (let rowIdx = 0; rowIdx < this.grid.length; rowIdx++) {
      const row = this.grid[rowIdx];
      for (let colIdx = 0; colIdx < row.length; colIdx++) {
        const space = row[colIdx];
        if (space) {
          state[key] = {row: rowIdx, col: colIdx, num: space.number};
        }
        key++;
      }
    }
    return state;
  }

  move(fromPos, toPos) {
    const draggedTile = this.getSpace(fromPos);
    const landingTile = this.getSpace(toPos);
    if (landingTile) {
      if (landingTile.isMatch(draggedTile)) {
        const newTile = landingTile.combine(draggedTile);
        this.updateHighest(newTile.number);
        this.setSpace(toPos, newTile);
        this.setSpace(fromPos, null);
      }
    } else {
      this.setSpace(toPos, draggedTile);
      this.setSpace(fromPos, null);
    }
  }

  numAt(pos) {
    if (this.occupied(pos)) {
      return this.getSpace(pos).number;
    }
    return null;
  }

  occupied(pos) {
    return this.getSpace(pos) ? true : false;
  }

  setSpace(pos, val) {
    this.grid[pos[0]][pos[1]] = val;
    return val;
  }

  shouldFall(pos) {
    const below = [pos[0] - 1, pos[1]];
    if (!this.occupied(below) || this.numAt(pos) === this.numAt(below)) {
      return true;
    }
    return false;
  }

  updateHighest(newNumber) {
    if (newNumber > this.highestNumber) {this.highestNumber = newNumber;}
  }
}

module.exports = Board;
