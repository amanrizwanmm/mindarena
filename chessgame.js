const game = new Chess();
const boardEl = document.getElementById('chessboard');
const statusEl = document.getElementById('status');
const SYMBOLS = { p: '♟', r: '♜', n: '♞', b: '♝', q: '♛', k: '♚' };
let selected = null, targets = [], lastMove = null;

function findKing(color) {
  const board = game.board();
  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (p && p.type === 'k' && p.color === color) return 'abcdefgh'[c] + (8 - r);
    }
  return null;
}

function draw() {
  boardEl.innerHTML = '';
  const board = game.board();
  const checkSquare = game.in_check() ? findKing(game.turn()) : null;

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const name = 'abcdefgh'[c] + (8 - r);
      const sq = document.createElement('div');
      sq.className = 'csq ' + ((r + c) % 2 === 0 ? 'light' : 'dark');

      if (lastMove && (name === lastMove.from || name === lastMove.to)) sq.classList.add('last');
      if (name === selected) sq.classList.add('sel');
      if (name === checkSquare) sq.classList.add('check');
      if (targets.includes(name)) {
        sq.classList.add('dest');
        if (board[r][c]) sq.classList.add('cap');
      }

      const piece = board[r][c];
      if (piece) {
        const el = document.createElement('span');
        el.className = 'cp';
        el.innerHTML = '<svg class="pc ' + piece.color + '" viewBox="0 0 45 45"><use href="#p-' + piece.type + '"/></svg>';
        sq.appendChild(el);
      }

      sq.addEventListener('click', () => onClick(name));
      boardEl.appendChild(sq);
    }
  }
}

function onClick(name) {
  if (game.game_over()) return;

  if (selected && targets.includes(name)) {
    makeMove(selected, name);
    return;
  }

  const piece = game.get(name);
  if (piece && piece.color === game.turn()) {
    selected = name;
    targets = game.moves({ square: name, verbose: true }).map(m => m.to);
  } else {
    selected = null;
    targets = [];
  }
  draw();
}

function makeMove(from, to) {
  game.move({ from: from, to: to, promotion: 'q' });
  lastMove = { from: from, to: to };
  selected = null;
  targets = [];
  draw();
  updateStatus();
}

function showResult(text) {
  statusEl.textContent = text;
  document.getElementById('result').textContent = text;
  setTimeout(() => document.getElementById('modal').classList.add('show'), 500);
}

function updateStatus() {
  const mover = game.turn() === 'w' ? 'White' : 'Black';
  const winner = game.turn() === 'w' ? 'Black' : 'White';

  if (game.in_checkmate()) showResult('Checkmate! ' + winner + ' wins');
  else if (game.in_stalemate()) showResult('Stalemate. It is a draw');
  else if (game.in_draw()) showResult('Draw');
  else statusEl.textContent = mover + "'s turn" + (game.in_check() ? ' - Check!' : '');
}

function resetView() {
  selected = null;
  targets = [];
  lastMove = null;
  document.getElementById('modal').classList.remove('show');
  draw();
  updateStatus();
}

document.getElementById('restart').addEventListener('click', () => { game.reset(); resetView(); });
document.getElementById('playAgain').addEventListener('click', () => { game.reset(); resetView(); });
document.getElementById('undo').addEventListener('click', () => { game.undo(); resetView(); });

draw();
updateStatus();