const View = require('./view');
const Game = require('./game');

$( () => {
  const rootEl = $('#venti-game');
  new View(rootEl);
});
