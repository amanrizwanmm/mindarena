const boardEl = document.getElementById('checkers');
const turnEl = document.getElementById('turn');
let board, turn, selected, mustContinue;

function newGame() {
  board = Array.from({ length: 8 }, () => Array(8).fill(null));
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if ((r + c) % 2 === 1) {
        if (r < 3) board[r][c] = { p: 'b', k: false };
        if (r > 4) board[r][c] = { p: 'a', k: false };
      }
    }
  }
  turn = 'a';
  selected = null;
  mustContinue = null;
  document.getElementById('modal').classList.remove('show');
  draw();
}

function inBoard(r, c) {
  return r >= 0 && r < 8 && c >= 0 && c < 8;
}

function dirs(piece) {
  if (piece.k) return [[-1, -1], [-1, 1], [1, -1], [1, 1]];
  return piece.p === 'a' ? [[-1, -1], [-1, 1]] : [[1, -1], [1, 1]];
}

function movesFor(r, c) {
  const piece = board[r][c];
  const result = [];
  for (const [dr, dc] of dirs(piece)) {
    const r1 = r + dr, c1 = c + dc;
    if (!inBoard(r1, c1)) continue;
    if (board[r1][c1] === null) {
      result.push({ r: r1, c: c1, cap: null });
    } else if (board[r1][c1].p !== piece.p) {
      const r2 = r + 2 * dr, c2 = c + 2 * dc;
      if (inBoard(r2, c2) && board[r2][c2] === null) {
        result.push({ r: r2, c: c2, cap: [r1, c1] });
      }
    }
  }
  return result;
}

function playerHasCapture() {
  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 8; c++)
      if (board[r][c] && board[r][c].p === turn && movesFor(r, c).some(m => m.cap)) return true;
  return false;
}

function legalMoves(r, c) {
  const all = movesFor(r, c);
  if (mustContinue) return all.filter(m => m.cap);
  return playerHasCapture() ? all.filter(m => m.cap) : all;
}

function hasAnyMove() {
  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 8; c++)
      if (board[r][c] && board[r][c].p === turn && legalMoves(r, c).length > 0) return true;
  return false;
}

function draw() {
  boardEl.innerHTML = '';
  const dests = selected ? legalMoves(selected.r, selected.c) : [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const sq = document.createElement('div');
      sq.className = 'sq ' + ((r + c) % 2 === 1 ? 'dark' : 'light');
      if (dests.some(m => m.r === r && m.c === c)) sq.classList.add('dest');
      const piece = board[r][c];
      if (piece) {
        const el = document.createElement('div');
        el.className = 'piece ' + (piece.p === 'a' ? 'pa' : 'pb');
        if (selected && selected.r === r && selected.c === c) el.classList.add('sel');
        if (piece.k) el.textContent = '♛';
        sq.appendChild(el);
      }
      sq.addEventListener('click', () => onClick(r, c));
      boardEl.appendChild(sq);
    }
  }
  turnEl.textContent = turn === 'a' ? 'Cyan' : 'Pink';
  turnEl.className = turn === 'a' ? 'turn-a' : 'turn-b';
}

function onClick(r, c) {
  if (selected) {
    const mv = legalMoves(selected.r, selected.c).find(m => m.r === r && m.c === c);
    if (mv) { makeMove(mv); return; }
  }
  const piece = board[r][c];
  if (piece && piece.p === turn) {
    if (mustContinue && (mustContinue.r !== r || mustContinue.c !== c)) return;
    selected = { r, c };
    draw();
  }
}

function makeMove(mv) {
  const { r: fr, c: fc } = selected;
  const piece = board[fr][fc];
  board[mv.r][mv.c] = piece;
  board[fr][fc] = null;
  if (mv.cap) board[mv.cap[0]][mv.cap[1]] = null;

  let promoted = false;
  if (!piece.k && ((piece.p === 'a' && mv.r === 0) || (piece.p === 'b' && mv.r === 7))) {
    piece.k = true;
    promoted = true;
  }

  if (mv.cap && !promoted && movesFor(mv.r, mv.c).some(m => m.cap)) {
    mustContinue = { r: mv.r, c: mv.c };
    selected = { r: mv.r, c: mv.c };
  } else {
    mustContinue = null;
    selected = null;
    turn = turn === 'a' ? 'b' : 'a';
  }
  draw();
  checkWin();
}

function checkWin() {
  if (mustContinue) return;
  if (!hasAnyMove()) {
    document.getElementById('winner').textContent = turn === 'a' ? 'Pink' : 'Cyan';
    setTimeout(() => document.getElementById('modal').classList.add('show'), 400);
  }
}

document.getElementById('restart').addEventListener('click', newGame);
document.getElementById('playAgain').addEventListener('click', newGame);
newGame();