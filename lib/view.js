class View {
  constructor(game, $root) {
    this.game = game;
    this.$root = $root;
    this.fromSpace = null;

    this.$root.on("click", "li", this.clickSpace.bind(this));
    this.setupBoard();
  }

  clickSpace(event) {
    const clickedPos = $(event.currentTarget).data("pos");
    if (this.fromSpace === null) {
      if (this.game.spaceOccupied(clickedPos)) {
        this.fromSpace = clickedPos;
      }
    } else {
      this.game.moveTile(this.fromSpace, clickedPos);
    }
    this.fromSpace = null;
    this.render();
  }

  setupBoard() {
    const $li = $("<li>");
    const $ul = $("<ul>");
    for (let rowIdx = 0; rowIdx < 8; rowIdx++) {
      for (let colIdx = 0; colIdx < 7; colIdx++) {
        $li.data("pos", [rowIdx, colIdx]);
        $ul.append($li);
      }
    }
    this.$root.append($ul);
  }
}

module.exports = View;
