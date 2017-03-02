class View {
  constructor(game, $root) {
    this.game = game;
    this.$root = $root;
    this.fromPos = null;

    this.$root.on("click", "li", this.clickSpace.bind(this));
    this.setupBoard();
  }

  clickSpace(event) {
    // TODO: target? Want to grab the div (tile) inside the li (space)
    let $clicked = $(event.currentTarget);
    const clickedPos = $clicked.data("pos");
    if (this.fromPos === null) {
      if (this.game.spaceOccupied(clickedPos)) {
        this.fromPos = clickedPos;
        $clicked.addClass("selected");
        $clicked.append("<strong>Hi</strong>");
      }
    } else {
      this.game.move(this.fromPos, clickedPos);
      $clicked.append("<strong>Hi</strong>");

      const $prevClicked = $("li.selected");
      $prevClicked.empty();
      $prevClicked.removeClass("selected");
      this.fromPos = null;
    }

    /*  TODO: too much render logic?
      Separate concerns between registering user input and rendering?
    */
    this.render();
  }

  render() {

  }

  setupBoard() {
    const $ul = $("<ul>");
    $ul.addClass("board");
    for (let rowIdx = 0; rowIdx < 8; rowIdx++) {
      for (let colIdx = 0; colIdx < 7; colIdx++) {
        const $li = $("<li>");
        $li.addClass("space");
        $li.data("pos", [rowIdx, colIdx]);
        $ul.append($li);
      }
    }
    this.$root.append($ul);
  }
}

module.exports = View;
