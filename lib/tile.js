class Tile {
  constructor(number) {
    this.number = number;
  }

  attemptCombine(otherTile) {
    if (this.isMatch(otherTile)) {
      return new Tile(this.number + 1);
    }
  }

  isMatch(otherTile) {
    return this.number === otherTile.number;
  }
}

module.exports = Tile;
