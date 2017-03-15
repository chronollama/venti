const View = require('./view');
const Game = require('./game');

$( () => {
  const game = new Game();
  const rootEl = $('#venti-game');
  new View(game, rootEl);
});
