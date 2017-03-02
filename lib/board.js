const Tile = require('./tile');

class Board {
  constructor() {
    const startTiles = Board.generateTiles(true);
    this.grid = new Array(8);
    this.grid[0] = startTiles.slice(0, 7);
    this.grid[1] = startTiles.slice(7);
    for (let i = 2; i < 8; i++) {this.grid[i] = new Array(7);}

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

  getSpace(pos) {
    return this.grid[pos[0]][pos[1]];
  }

  updateHighest(newNumber) {
    if (newNumber > this.highestNumber) {this.highestNumber = newNumber;}
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
