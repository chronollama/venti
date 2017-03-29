const Game = require('./game');

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

    this.timerId = setInterval(this.tick.bind(this), 1000);
    this.renderId = setInterval(this.renderTiles.bind(this, true), 1000);
    this.setup();
  }

  addRow() {
    this.game.addRow();
    this.renderTiles(true);
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
    this.fall($space.data("col"));

    this.renderTiles();
  }

  fall(col) {
    this.game.fall(this.startCol);
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

  renderTiles(dragging = false) {
    const $board = $("ul.board");
    const boardState = this.game.boardState();
    boardState["removed"].forEach((tileId) => {
      $(`div.tile[data-id=${tileId}]`).remove();
    });

    Object.values(boardState["tiles"]).forEach((tile) => {
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
    this.renderId = setInterval(this.renderTiles.bind(this, true), 1000);
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
