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

  clearRemoved() {
    this.board.clearRemoved();
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
    if (this.board.move(toPos) === "mismatch") {
      this.addRow();
      this.penalty();
    }
    if (this.board.highestNumber === 20) { this.isWon = true; }
  }
}

module.exports = Game;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const Game = __webpack_require__(0);

class View {
  constructor($root) {
    this.$root = $root;
    this.game = new Game();
    this.game.penalty = this.penalty.bind(this);

    this.timer = 6;

    this.$root.on("dragstart", "div.tile", this.dragStart.bind(this));
    this.$root.on("dragstop", "div.tile", this.ensureDrop.bind(this));
    this.$root.on("dropout", "li.space", this.dropOut.bind(this));
    this.$root.on("dropover", "li.space", this.dropOver.bind(this));

    this.setup();
  }

  addRow() {
    this.game.addRow();
    this.renderTiles();
  }

  checkGameStatus() {
    if (this.game.isWon) {
      this.pause();
      this.gameOver(true);
    } else if (this.game.isLost) {
      this.pause();
      this.gameOver(false);
    }
  }

  clickInstructions(event) {
    event.stopPropagation();
    this.pause();
    if ($("div.how-to").length) {
      this.closeInstructions();
    } else {
      this.openInstructions();
    }
  }

  closeInstructions() {
    $(".how-to").remove();
    $("body").off("click");
    if (!this.game.isLost) { this.resume(); }
  }

  dragStart(event) {
    this.$draggedTile = $(event.currentTarget);
    const num = this.$draggedTile.data("num");
    this.$draggedTile.attr("class", `tile num${num}`);

    const $space = this.$draggedTile.parent();
    $space.children().not(this.$draggedTile).remove();
    this.startCol = $space.data("col");
    this.game.grabTile([$space.data("row"), this.startCol]);
  }

  dropOut(event) {
    $(event.currentTarget).removeClass("highlight");
  }

  dropOver(event) {
    const $space = $(event.currentTarget);
    $space.addClass("highlight");
    this.newRow = $space.data("row");
    this.newCol = $space.data("col");
  }

  ensureDrop() {
    const row = this.newRow;
    const col = this.newCol;
    const $space = $(`li.space[data-row="${row}"][data-col="${col}"]`);
    const num = this.$draggedTile.data("num");

    $space.append(this.$draggedTile);
    this.game.move([row, col]);
    this.$draggedTile.css({ "top" : "", "left" : "" });
    this.$draggedTile.attr("class", `tile num${num} row${row} col${col}`);
    $space.removeClass("highlight");
    this.fall(this.startCol);
    this.fall(col);
    setTimeout(this.renderTiles.bind(this), 100);
  }

  fall(col) {
    this.game.fall(col);
    const boardState = this.game.boardState();
    Object.values(boardState).forEach((tile) => {
      let $div = $(`div.tile[data-id="${tile.id}"]`);
      $div.attr("class", `tile num${tile.num} row${tile.row} col${tile.col}`);
    });
  }

  gameOver(win = false) {
    const $gameOver = $("<div>");
    $gameOver.addClass("modal");
    const $text = $("<div></div>");

    if (win) { $text.append("<p>You Win!</p>"); }
    else { $text.append("<p>Game Over</p>"); }
    $text.addClass("game-over");

    const $github = $('<a href="https://github.com/chronollama/Venti"><i class="fa fa-github" aria-hidden="true"></i></a>');
    $github.addClass("github");
    const $linkedin = $('<a href="https://www.linkedin.com/in/jwudev/"><i class="fa fa-linkedin-square" aria-hidden="true"></i></a>');
    $linkedin.addClass("linkedin");
    const $portfolio = $('<a href="http://chronollama.com/"><i class="fa fa-folder-open" aria-hidden="true"></i></a>');
    $portfolio.addClass("portfolio");
    const $restart = this.restartButton();

    $text.append($github, $linkedin, $portfolio, $restart);
    $gameOver.append($text);
    this.$root.append($gameOver);
    $gameOver.on("click", (event) => { event.stopPropagation(); });
    this.$root.off();
  }

  openInstructions() {
    const $howTo = $("<div>");
    $howTo.addClass("modal how-to");

    const $text = $("<div>");
    $text.addClass("instruction-block");
    $text.append("<p><strong>How to Play</strong></p>",
      "<p>Match numbered tiles to form higher numbers. Reach 20 to win.</p>",
      "<p>Tiles drop down to lowest unoccupied positions.</p>",
      "<p>More tiles will be added to the bottom every 6 seconds or when tiles are matched incorrectly.</p>",
      "<p>The game is over if the tiles reach the top.</p>");

    const $resumeButton = $("<button>Resume</button>").addClass("how-to-btn");
    $resumeButton.on("click", this.closeInstructions.bind(this));

    $howTo.append($text, $resumeButton);
    this.$root.append($howTo);
    $howTo.on("click", (closeEvent) => { closeEvent.stopPropagation(); });
  }

  pause() {
    clearInterval(this.timerId);
    clearInterval(this.renderId);
  }

  penalty() {
    const $board = $("ul.board");
    $board.addClass("penalty");
    setTimeout(() => { $board.removeClass("penalty"); }, 300);
  }

  renderTiles() {
    const $board = $("ul.board");
    const boardState = this.game.boardState();
    boardState.removed.forEach((tileId) => {
      $(`div.tile[data-id=${tileId}]`).remove();
    });
    this.game.clearRemoved();

    Object.values(boardState.tiles).forEach((tile) => {
      let $div = $(`div.tile[data-id="${tile.id}"]`);
      if ($div.length === 0) {
        $div = $(`<div><aside>${tile.num}</aside></div>`)
          .draggable({ containment: "ul.board" });
        $div.addClass(`tile num${tile.num} row${tile.row} col${tile.col}`);
        $div.attr("data-id", tile.id);
        $div.attr("data-num", tile.num);
      } else {
        $div.attr("class", `tile num${tile.num} row${tile.row} col${tile.col}`);
      }
      const $li = $(`li.space[data-row="${tile.row}"][data-col="${tile.col}"]`);
      setTimeout(() => { $li.append($div); }, 100);
    });
    this.checkGameStatus();
  }

  resetTimer() {
    this.timer = 6;
    const $timer = $("div.timer");
    for (let i = 0; i < 6; i++) {
      $timer.append($("<section>"));
    }
  }

  restartButton() {
    const $button = $("<button>Reset</button>");
    $button.addClass("restart-btn");
    $button.on("click", () => {
      $(".modal").remove();
      this.$root.empty();
      this.$root.off();
      new View($("#venti-game"));
    });
    return $button;
  }

  resume() {
    this.timerId = setInterval(this.tick.bind(this), 1000);
    this.renderId = setInterval(this.renderTiles.bind(this), 1000);
  }

  setup() {
    this.setupTimer();
    this.setupBoard();
    this.setupInstructions();
    for (let i = 0; i < 7; i++) {
      this.game.fall(i);
    }
    this.renderTiles();
    this.pause();
    this.openInstructions();
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

  setupInstructions() {
    const $button = $("<button>Instructions</button>");
    $button.on("click", this.clickInstructions.bind(this));
    $button.addClass("how-to-btn");
    this.$root.append($button);
  }

  setupTimer() {
    const $timer = $("<div>");
    $timer.addClass("timer");
    this.$root.append($timer);
    this.resetTimer();
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

  clearRemoved() {
    this.removedTiles = [];
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

  gridState() {
    let state = {};
    let tiles = {};
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 7; col++) {
        if (this.occupied([row, col])) {
          const tile = this.getSpace([row, col]);
          tiles[tile.id] = { row, col, num: tile.number, id: tile.id };
        }
      }
    }
    const removed = this.removedTiles.slice();
    return { tiles, removed };
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
  new View(rootEl);
});


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map