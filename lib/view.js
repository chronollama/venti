class View {
  constructor(game, $root) {
    this.$root = $root;
    this.game = game;
    this.timer = 15;
    // TODO: remove this when done testing
    window.game = this.game;

    this.$root.on("dragstart", "div.tile", this.dragStart.bind(this));
    this.$root.on("drop", "li.space", this.handleDrop.bind(this));
    this.$root.on("dropout", "li.space", this.dropOut.bind(this));
    this.$root.on("dropover", "li.space", this.dropOver.bind(this));

    this.setup();
    // setInterval(this.tick.bind(this), 1000);
    // setInterval(this.renderTiles.bind(this, true), 500);
  }

  addRow() {
    this.game.addRow();
    this.checkLoss();
    this.renderTiles(true);
  }

  // attachToGhost(row, col) {
  //   const $ghost = $("li.ghost-space").filter((idx, el) => {
  //     return $(el).data("row") === row && $(el).data("col") === col;
  //   });
  //   $ghost.append(this.$draggedTile);
  // }

  checkLoss() {
    if (this.game.isLost) { this.gameOver(); }
  }

  dragStart(event) {
    this.$draggedTile = $(event.currentTarget);
    const $space = this.$draggedTile.parent();
    this.startRow = $space.data("row");
    this.startCol = $space.data("col");

    // $space.on("mouseleave", this.handleDrag.bind(this));
    this.game.grabTile([this.startRow, this.startCol]);
    // this.attachToGhost(this.currentRow, this.currentCol);
    // this.game.fall($space.data("col"));
    // this.renderTiles();
  }

  dropOut(event) {
    $(event.currentTarget).removeClass("highlight");
  }

  dropOver(event) {
    $(event.currentTarget).addClass("highlight");
  }

  gameOver() {

  }

  handleDrag(event) {
    // const $space = $(event.currentTarget);
    // const row = $space.data("row");
    // const col = $space.data("col");
    // console.log(`${row} - ${col}`);

    // if (this.currentRow !== row || this.currentCol !== col) {
    //   this.currentRow = row;
    //   this.currentCol = col;
    //   this.game.moveBlankTile([row, col]);
    // }
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
    this.game.fall(this.startCol);
    this.game.fall($space.data("col"));
    this.$draggedTile = null;
    this.renderTiles();
  }

  renderTiles(dragging = false) {
    // console.log("render");
    // if (dragging) {
    //   $("div.tile").not(this.$draggedTile).remove();
    // } else {
    //   $("div.tile").remove();
    // }
    const $board = $("ul.board");
    const boardState = this.game.boardState();
    // TODO: anyway to refactor this in order to locate space by position data?
    //  alternative: only render specific columns when changes occur.
    // board state would return which columns changed.
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
      // const $li = $(`li.space[data-row="${tile.row}"][data-col="${tile.col}"]`);
      // $li.append($div);
    });
  }

  resetTimer() {
    this.timer = 15;
    const $timer = $("div.timer");
    for (let i = 0; i < 15; i++) {
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
    // const $ghost = $("<ul>");
    // $ghost.addClass("ghost-board");
    // for (let rowIdx = 0; rowIdx < 8; rowIdx++) {
    //   for (let colIdx = 0; colIdx < 7; colIdx++) {
    //     const $li = $("<li>");
    //     $li.addClass("ghost-space");
    //     $li.data("row", rowIdx);
    //     $li.data("col", colIdx);
    //     $ghost.append($li);
    //   }
    // }
    // $ghost.append($board);
    // this.$root.append($ghost);
  }

  tick() {
    if (this.timer === 0) {
      this.game.addRow();
      this.resetTimer();
    } else {
      this.timer -= 1;
      $(".timer").children().last().remove();
    }
  }
}

module.exports = View;
