const View = require('./view');
const Game = require('./game');

$(function () {
  const rootEl = $('#venti-game');
  const game = new Game();
  new View(game, rootEl);
});
