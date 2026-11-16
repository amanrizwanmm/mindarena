const emojis = ['🐶','🐱','🦊','🐼','🐸','🦁','🐵','🐙'];
const board = document.getElementById('board');
const movesEl = document.getElementById('moves');
let first = null, lock = false, moves = 0, matched = 0;

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function startGame() {
  board.innerHTML = '';
  moves = 0; matched = 0; first = null; lock = false;
  movesEl.textContent = 0;
  shuffle([...emojis, ...emojis]).forEach(symbol => {
    const card = document.createElement('button');
    card.className = 'tile';
    card.dataset.symbol = symbol;
    card.addEventListener('click', () => flip(card));
    board.appendChild(card);
  });
}

function flip(card) {
  if (lock || card.classList.contains('open') || card.classList.contains('done')) return;
  card.classList.add('open');
  card.textContent = card.dataset.symbol;

  if (!first) { first = card; return; }

  moves++;
  movesEl.textContent = moves;

  if (first.dataset.symbol === card.dataset.symbol) {
    first.classList.add('done');
    card.classList.add('done');
    first = null;
    matched++;
    if (matched === emojis.length) {
      setTimeout(() => {
  document.getElementById('finalMoves').textContent = moves;
  document.getElementById('modal').classList.add('show');
}, 400);
    }
  } else {
    lock = true;
    setTimeout(() => {
      first.classList.remove('open'); first.textContent = '';
      card.classList.remove('open'); card.textContent = '';
      first = null; lock = false;
    }, 800);
  }
}

document.getElementById('restart').addEventListener('click', startGame);
startGame();
document.getElementById('playAgain').addEventListener('click', () => {
  document.getElementById('modal').classList.remove('show');
  startGame();
});