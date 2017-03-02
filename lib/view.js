class View {
  constructor(game, $root) {
    this.game = game;
    this.$root = $root;
    this.fromPos = null;

    this.$root.on("click", "li", this.clickSpace.bind(this));
    this.setupBoard();
  }

  clickSpace(event) {
    const $space = $(event.currentTarget);
    const $clicked = $space.children().first();
    const clickedPos = [$space.data("row"), $space.data("col")];

    if (this.fromPos === null) {
      if (this.game.spaceOccupied(clickedPos)) {
        this.fromPos = clickedPos;
        $clicked.addClass("selected");
      }
    } else {
      this.game.move(this.fromPos, clickedPos);

      const $prevClicked = $("div.selected").detach();
      $space.append($prevClicked);
      $prevClicked.removeClass("selected");
      this.fromPos = null;
      this.renderTiles();
    }
    //
    // /*  TODO: too much render logic?
    //   Separate concerns between registering user input and rendering?
    // */
  }

  renderTiles() {
    $("div.tile").remove();
    const $board = $("ul.board");
    const boardState = this.game.boardState();

    Object.values(boardState).forEach((val) => {
      let $tile = $(`<div class="tile"><aside>${val.num}</aside></div>`);
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
        const $li = $("<li>");
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
