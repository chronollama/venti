class View {
  constructor(game, $root) {
    this.game = game;
    // TODO: remove this when done testing
    window.game = this.game;

    this.$root = $root;
    this.fromPos = null;
    // this.$root.on("click", "li.space", this.clickSpace.bind(this));
    this.$root.on("dragstart", "div.tile", this.dragStart.bind(this));
    this.$root.on("drop", "li.space", this.handleDrop.bind(this));
    this.setupBoard();
  }

  dragStart(event) {
    const $tile = $(event.currentTarget);
    const $space = $tile.parent();
    this.fromPos = [$space.data("row"), $space.data("col")];
  }

  handleDrop(event, ui) {
    const $space = $(event.currentTarget);
    const $tile = $(ui.draggable);
    const toPos = [$space.data("row"), $space.data("col")];
    this.game.move(this.fromPos, toPos);
    this.fromPos = null;
    this.renderTiles();
  }

  // clickSpace(event) {
  //   const $space = $(event.currentTarget);
  //   const $clicked = $space.children().first();
  //   const clickedPos = [$space.data("row"), $space.data("col")];
  //
  //   if (this.fromPos === null) {
  //     if (this.game.spaceOccupied(clickedPos)) {
  //       this.fromPos = clickedPos;
  //       $clicked.addClass("selected");
  //     }
  //   } else {
  //     this.game.move(this.fromPos, clickedPos);
  //
  //     const $prevClicked = $("div.selected").detach();
  //     $space.append($prevClicked);
  //     $prevClicked.removeClass("selected");
  //     this.fromPos = null;
  //     this.renderTiles();
  //   }
  // }

  renderTiles() {
    $("div.tile").remove();
    const $board = $("ul.board");
    const boardState = this.game.boardState();
    // TODO: anyway to refactor this in order to locate space by position data?
    Object.values(boardState).forEach((val) => {
      let $tile = $(
        `<div class="tile"><aside>${val.num}</aside></div>`
      ).draggable({
        zIndex: 100,
        containment: "ul.board"
      });

      const $space = $("li.space").filter((idx, li) => {
        const $li = $(li);
        return $li.data("row") === val.row && $li.data("col") === val .col;
      });
      $space.append($tile);
    });
  }

  setupBoard() {
    const $ul = $("<ul>");
    $ul.addClass("board");
    for (let rowIdx = 0; rowIdx < 8; rowIdx++) {
      for (let colIdx = 0; colIdx < 7; colIdx++) {
        const $li = $("<li>").droppable();
        $li.addClass("space");
        $li.data("row", rowIdx);
        $li.data("col", colIdx);
        $ul.append($li);
      }
    }
    this.$root.append($ul);
    this.renderTiles();
  }
}

module.exports = View;
