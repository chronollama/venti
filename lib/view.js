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
