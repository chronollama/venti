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
    this.removedTiles = [];
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

  addRow() {
    for (let rowIdx = 6; rowIdx >= 0; rowIdx -= 1) {
      const row = this.grid[rowIdx];
      this.grid[rowIdx + 1] = row;
    }
    this.grid[0] = this.generateTiles();
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
    this.startPos = pos;
  }

  gridDiff(prevState, newState) {
    let tiles = {};

    Object.keys(newState).forEach((tileId) => {
      if (prevState[tileId]) {
        const prevRow = prevState[tileId].row;
        const prevCol = prevState[tileId].col;
        const {row, col} = newState[tileId];
        if (prevRow !== row || prevCol !== col) {
          tiles[tileId] = Object.assign({}, newState[tileId]);
        }
        delete prevState[tileId];
      } else {
        tiles[tileId] = Object.assign({}, newState[tileId]);
      }
    });

    const removed = Object.keys(prevState);
    this.prevState = newState;
    return { tiles, removed };
  }

  gridState() {
    let state = {};
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 7; col++) {
        if (this.occupied([row, col])) {
          const tile = this.getSpace([row, col]);
          state[tile.id] = { row, col, num: tile.number, id: tile.id };
        }
      }
    }
    if (this.prevState) {
      return this.gridDiff(this.prevState, state);
    } else {
      this.prevState = state;
      return { tiles: state, removed: [] };
    }
    // const removed = this.removedTiles.slice();
    // return { tiles, removed };
  }

  move(toPos, tile = null) {
    if (tile === null) { tile = this.draggedTile; }
    const landingTile = this.getSpace(toPos);
    if (landingTile) {
      if (landingTile.isMatch(tile)) {
        this.removedTiles.push(tile.id);
        this.removedTiles.push(landingTile.id);
        const newTile = landingTile.combine(tile);
        this.updateHighest(newTile.number);
        this.setSpace(toPos, newTile);
      } else {
        this.removedTiles.push(tile.id);
        this.removedTiles.push(landingTile.id);
        this.setSpace(toPos, null);
        return "mismatch";
      }
    } else {
      this.setSpace(toPos, tile);
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

  reportLoss() {

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
