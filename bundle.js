/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const Board = __webpack_require__(2);

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
    this.board.move(toPos);
    // this function enables the view to update the grid state
  }

  // moveBlankTile(toPos) {
  //   this.board.moveBlankTile(toPos);
  // }
}

module.exports = Game;


/***/ }),
/* 1 */
/***/ (function(module, exports) {

class View {
  constructor(game, $root) {
    this.$root = $root;
    this.game = game;
    this.timer = 6;

    this.$root.on("dragstart", "div.tile", this.dragStart.bind(this));
    this.$root.on("drop", "li.space", this.handleDrop.bind(this));
    this.$root.on("dropout", "li.space", this.dropOut.bind(this));
    this.$root.on("dropover", "li.space", this.dropOver.bind(this));

    this.setup();
    this.timerId = setInterval(this.tick.bind(this), 1000);
    this.renderId = setInterval(this.renderTiles.bind(this, true), 1000);
  }

  addRow() {
    this.game.addRow();
    this.checkLoss();
    this.renderTiles(true);
  }

  checkLoss() {
    if (this.game.isLost) {
      clearInterval(this.timerId);
      clearInterval(this.renderId);
      this.gameOver();
    }
  }

  dragStart(event) {
    this.$draggedTile = $(event.currentTarget);
    const $space = this.$draggedTile.parent();
    this.startRow = $space.data("row");
    this.startCol = $space.data("col");
    this.game.grabTile([this.startRow, this.startCol]);
  }

  dropOut(event) {
    $(event.currentTarget).removeClass("highlight");
  }

  dropOver(event) {
    $(event.currentTarget).addClass("highlight");
  }

  gameOver() {

  }

  handleDrop(event, ui) {
    const $space = $(event.currentTarget);
    $space.append(this.$draggedTile);
    this.game.move([$space.data("row"), $space.data("col")]);
    $space.removeClass("highlight");
    this.game.fall(this.startCol);
    this.game.fall($space.data("col"));
    this.$draggedTile = null;
    this.renderTiles();
  }

  renderTiles(dragging = false) {
    if (dragging) {
      $("div.tile").not(this.$draggedTile).remove();
    } else {
      $("div.tile").remove();
    }
    const $board = $("ul.board");
    const boardState = this.game.boardState();
    Object.values(boardState).forEach((tile) => {
      let $div = $(`div.tile[data-id="${tile.id}"]`);
      if ($div.length === 0) {
        $div = $(`<div><aside>${tile.num}</aside></div>`)
          .draggable({ containment: "ul.board" });
        $div.addClass(`tile num${tile.num} row${tile.row} col${tile.col}`);
        $div.attr("data-id", tile.id);
      } else {
        $div.removeClass().addClass(`tile num${tile.num} row${tile.row} col${tile.col}`);
      }
      const $li = $(`li.space[data-row="${tile.row}"][data-col="${tile.col}"]`);
      $li.append($div);
    });
  }

  resetTimer() {
    this.timer = 6;
    const $timer = $("div.timer");
    for (let i = 0; i < 6; i++) {
      $timer.append($("<section>"));
    }
  }

  setup() {
    this.setupTimer();
    this.setupBoard();
    for (let i = 0; i < 7; i++) {
      this.game.fall(i);
    }
    this.renderTiles();
  }

  setupTimer() {
    const $timer = $("<div>");
    $timer.addClass("timer");
    this.$root.append($timer);
    this.resetTimer();
  }

  setupBoard() {
    const $board = $("<ul>");
    $board.addClass("board");
    for (let rowIdx = 0; rowIdx < 8; rowIdx++) {
      for (let colIdx = 0; colIdx < 7; colIdx++) {
        const $li = $("<li>").droppable({
          tolerance: "intersect"
        });
        $li.addClass("space");
        $li.attr("data-row", rowIdx);
        $li.attr("data-col", colIdx);
        $board.append($li);
      }
    }
    this.$root.append($board);
  }

  tick() {
    if (this.timer === 0) {
      this.addRow();
      this.resetTimer();
    } else {
      this.timer -= 1;
      $(".timer").children().last().remove();
    }
  }
}

module.exports = View;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

const Tile = __webpack_require__(3);

class Board {
  constructor() {
    const startTiles = this.generateTiles(true);
    this.grid = new Array(8);
    this.grid[0] = startTiles.slice(0, 7);
    this.grid[1] = startTiles.slice(7);
    for (let i = 2; i < 8; i++) {
      this.grid[i] = new Array(7).fill(null);
    }
    // this.blankTile = new Tile(-1);
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
    //  ^^ move this logic to the function that triggers after movign the tile out
    //  OR just leave the tile appended to the original position until release

    this.startPos = pos;
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
      }
    } else {
      this.setSpace(toPos, tile);
    }
  }

  // moveBlankTile(toPos) {
  //   this.setSpace(this.blankPos, null);
  //   this.move(toPos, this.blankTile);
  //   this.blankPos = toPos;
  // }

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


/***/ }),
/* 3 */
/***/ (function(module, exports) {

let id = 0;

class Tile {
  constructor(number) {
    this.number = number;
    this.id = id++;
  }

  combine(otherTile) {
    return new Tile(this.number + 1);
  }

  isMatch(otherTile) {
    return this.number === otherTile.number;
  }
}

module.exports = Tile;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

const View = __webpack_require__(1);
const Game = __webpack_require__(0);

$( () => {
  const rootEl = $('#venti-game');
  const game = new Game();
  new View(game, rootEl);
});


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map