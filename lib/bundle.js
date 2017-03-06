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

  isLost() {

  }

  isWon() {
    return this.board.highestNumber === 20;
  }

  occupied(pos) {
    return this.board.occupied(pos);
  }

  move(toPos) {
    return this.board.move(toPos);
    // this function enables the view to update the grid state
  }

  timer() {
    // TODO: revisit _tick hw/project
  }
}

module.exports = Game;


/***/ }),
/* 1 */
/***/ (function(module, exports) {

class View {
  constructor(game, $root) {
    this.game = game;
    // TODO: remove this when done testing
    window.game = this.game;
    window.renderTiles = this.renderTiles.bind(this);

    this.$root = $root;

    this.$root.on("dragstart", "div.tile", this.dragStart.bind(this));
    this.$root.on("drag", "li.space", this.handleDrag.bind(this));
    this.$root.on("drop", "li.space", this.handleDrop.bind(this));
    this.$root.on("dropout", "li.space", this.dropOut.bind(this));
    this.$root.on("dropover", "li.space", this.dropOver.bind(this));

    this.setupBoard();
  }

  attachToGhost(row, col) {
    const $ghost = $("li.ghost-space").filter((idx, el) => {
      return $(el).data("row") === row && $(el).data("col") === col;
    });
    $ghost.append(this.$draggedTile);
  }

  dragStart(event) {
    this.$draggedTile = $(event.currentTarget);
    const $space = this.$draggedTile.parent();
    const row = $space.data("row");
    const col = $space.data("col");
    
    this.game.grabTile([row, col]);
    this.attachToGhost(row, col);
    this.game.fall($space.data("col"));
    this.renderTiles(true);
  }

  dropOut(event) {
    $(event.currentTarget).removeClass("highlight");
  }

  dropOver(event) {
    $(event.currentTarget).addClass("highlight");
  }

  handleDrag(event) {
    // const $space = $(event.currentTarget);
    // $space.removeClass("highlight");
    // const toPos = [$space.data("row"), $space.data("col")];
    // if (this.fromPos[0] !== toPos[0] || this.fromPos[1] !== toPos[1]) {
    //   this.game.move(this.fromPos, toPos);
    // }
    // this.fromPos = null;
    // this.game.fall();
    // this.renderTiles();
  }

  handleDrop(event, ui) {
    const $space = $(event.currentTarget);
    $space.append(this.$draggedTile);
    this.game.move([$space.data("row"), $space.data("col")]);
    $space.removeClass("highlight");
    this.game.fall($space.data("col"));
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
    // TODO: anyway to refactor this in order to locate space by position data?
    //  alternative: only render specific columns when changes occur.
    // board state would return which columns changed.
    Object.values(boardState).forEach((val) => {
      let $tile = $(
        `<div class="tile num${val.num}"><aside>${val.num}</aside></div>`
      ).draggable({containment: "ul.board"});

      const $space = $("li.space").filter((idx, li) => {
        const $li = $(li);
        return $li.data("row") === val.row && $li.data("col") === val .col;
      });
      $space.append($tile);
    });
  }

  setupBoard() {
    const $board = $("<ul>");
    $board.addClass("board");
    for (let rowIdx = 0; rowIdx < 8; rowIdx++) {
      for (let colIdx = 0; colIdx < 7; colIdx++) {
        const $li = $("<li>").droppable({ tolerance: "intersect" });
        $li.addClass("space");
        $li.data("row", rowIdx);
        $li.data("col", colIdx);
        $board.append($li);
      }
    }

    const $ghost = $("<ul>");
    $ghost.addClass("ghost-board");
    for (let rowIdx = 0; rowIdx < 8; rowIdx++) {
      for (let colIdx = 0; colIdx < 7; colIdx++) {
        const $li = $("<li>");
        $li.addClass("ghost-space");
        $li.data("row", rowIdx);
        $li.data("col", colIdx);
        $ghost.append($li);
      }
    }

    $ghost.append($board);
    this.$root.append($ghost);

    for (let i = 0; i < 7; i++) {
      this.game.fall(i);
    }
    this.renderTiles();
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
      this.grid[i] = [null, null, null, null, null, null, null];
    }
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
    console.log("you lose! good day!");
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

class Tile {
  constructor(number) {
    this.number = number;
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