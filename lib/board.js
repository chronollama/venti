const Tile = require('./tile');

class Board {
  constructor() {
    const startTiles = this.generateTiles(true);
    this.grid = new Array(8);
    this.grid[0] = startTiles.slice(0, 7);
    this.grid[1] = startTiles.slice(7);
    for (let i = 2; i < 8; i++) {
      this.grid[i] = new Array(7).fill(null);
    }
    this.blankTile = new Tile(-1);
    this.highestNumber = 5;
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

  addRow() {
    if (this.grid[7].every((el) => { return el === null; })) {
      for (let rowIdx = 6; rowIdx >= 0; rowIdx -= 1) {
        const row = this.grid[rowIdx];
        this.grid[rowIdx + 1] = row;
      }
      this.grid[0] = this.generateTiles();
    } else {
      this.reportLoss();
    }
  }

  atTopRow() {
    return this.grid[7].some((el) => el !== null);
  }

  fallStep(colIdx) {
    let didFall = false;
    for (let rowIdx = 1; rowIdx < this.grid.length; rowIdx++) {
      let space = this.getSpace([rowIdx, colIdx]);
      if (space && this.shouldFall([rowIdx, colIdx])) {
        this.move([rowIdx - 1, colIdx], space);
        this.setSpace([rowIdx, colIdx], null);
        didFall = true;
      }
    }
    return didFall;
  }

  generateTiles(setup = false) {
    let values;
    if (setup) {values = [1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 5];}
    else {values = [1, 1, 2, 2, 3, 4, 5];}
    Board.shuffle(values);
    return values.map((value) => {
      return new Tile(value);
    });
  }

  getSpace(pos) {
    return this.grid[pos[0]][pos[1]];
  }

  grabTile(pos) {
    this.draggedTile = this.getSpace(pos);
    this.setSpace(pos, null);
    //  ^^ move this logic to the function that triggers after movign the tile out
    //  OR just leave the tile appended to the original position until release

    this.BlankPos = pos;
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

  move(toPos, tile = null) {
    if (tile === null) { tile = this.draggedTile; }
    const landingTile = this.getSpace(toPos);
    if (landingTile) {
      if (landingTile.isMatch(tile)) {
        const newTile = landingTile.combine(tile);
        this.updateHighest(newTile.number);
        this.setSpace(toPos, newTile);
      } else {
        console.log("Tile shouldn't disappear, fix by implementing containment");
      }
    } else {
      this.setSpace(toPos, tile);
    }
  }

  moveBlankTile(toPos) {
    this.setSpace(this.blankPos, null);
    this.move(toPos, this.blankTile);
    this.blankPos = toPos;
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

  reportLoss() {
    // TODO:
    console.log("render loss condition");
  }

  setSpace(pos, tile) {
    this.grid[pos[0]][pos[1]] = tile;
    return tile;
  }

  shouldFall(pos) {
    const below = [pos[0] - 1, pos[1]];
    if (!this.occupied(below) || this.numAt(pos) === this.numAt(below)) {
      return true;
    }
    return false;
  }

  updateHighest(num) {
    if (num > this.highestNumber) {this.highestNumber = num;}
  }
}

module.exports = Board;
