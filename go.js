const boardEl = document.getElementById('goboard');
const statusEl = document.getElementById('status');
const capEl = document.getElementById('captures');
const N = 9;
const KOMI = 6.5;
const STAR = ['2,2', '2,6', '6,2', '6,6', '4,4'];
let board, turn, passes, koPoint, caps, lastMove, history, finished;

function newGame() {
  board = Array.from({ length: N }, () => Array(N).fill(0));
  turn = 1;
  passes = 0;
  koPoint = null;
  caps = { 1: 0, 2: 0 };
  lastMove = null;
  history = [];
  finished = false;
  document.getElementById('modal').classList.remove('show');
  draw();
}

function neighbors(r, c) {
  const list = [];
  if (r > 0) list.push([r - 1, c]);
  if (r < N - 1) list.push([r + 1, c]);
  if (c > 0) list.push([r, c - 1]);
  if (c < N - 1) list.push([r, c + 1]);
  return list;
}

function groupAt(b, r, c) {
  const color = b[r][c];
  const stones = [];
  const libs = new Set();
  const seen = new Set([r * N + c]);
  const stack = [[r, c]];
  while (stack.length) {
    const [y, x] = stack.pop();
    stones.push([y, x]);
    for (const [ny, nx] of neighbors(y, x)) {
      if (b[ny][nx] === 0) {
        libs.add(ny * N + nx);
      } else if (b[ny][nx] === color && !seen.has(ny * N + nx)) {
        seen.add(ny * N + nx);
        stack.push([ny, nx]);
      }
    }
  }
  return { stones, libs };
}

function tryPlay(r, c) {
  if (board[r][c] !== 0) return null;
  if (koPoint && koPoint[0] === r && koPoint[1] === c) return null;

  const test = board.map(row => [...row]);
  test[r][c] = turn;
  const enemy = turn === 1 ? 2 : 1;
  const captured = [];

  for (const [ny, nx] of neighbors(r, c)) {
    if (test[ny][nx] === enemy) {
      const g = groupAt(test, ny, nx);
      if (g.libs.size === 0) {
        g.stones.forEach(([y, x]) => { test[y][x] = 0; captured.push([y, x]); });
      }
    }
  }

  const mine = groupAt(test, r, c);
  if (mine.libs.size === 0) return null;

  let ko = null;
  if (captured.length === 1 && mine.stones.length === 1 && mine.libs.size === 1) {
    ko = captured[0];
  }
  return { test, captured, ko };
}

function snapshot() {
  history.push({
    board: board.map(row => [...row]),
    turn, passes, koPoint, lastMove,
    caps: { 1: caps[1], 2: caps[2] }
  });
}

function onClick(r, c) {
  if (finished) return;
  const res = tryPlay(r, c);
  if (!res) {
    if (board[r][c] === 0) {
      statusEl.textContent = 'Not allowed: no liberties, or it repeats a position (ko).';
      setTimeout(updateStatus, 1800);
    }
    return;
  }
  snapshot();
  board = res.test;
  caps[turn] += res.captured.length;
  koPoint = res.ko;
  passes = 0;
  lastMove = [r, c];
  turn = turn === 1 ? 2 : 1;
  draw();
}

function pass() {
  if (finished) return;
  snapshot();
  passes++;
  koPoint = null;
  lastMove = null;
  if (passes >= 2) {
    finished = true;
    draw();
    showScore();
    return;
  }
  turn = turn === 1 ? 2 : 1;
  draw();
}

function undo() {
  if (!history.length) return;
  const s = history.pop();
  board = s.board;
  turn = s.turn;
  passes = s.passes;
  koPoint = s.koPoint;
  lastMove = s.lastMove;
  caps = s.caps;
  finished = false;
  document.getElementById('modal').classList.remove('show');
  draw();
}

function score() {
  let black = 0, white = 0;
  const seen = new Set();
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      if (board[r][c] === 1) black++;
      else if (board[r][c] === 2) white++;
      else if (!seen.has(r * N + c)) {
        const borders = new Set();
        let size = 0;
        const stack = [[r, c]];
        seen.add(r * N + c);
        while (stack.length) {
          const [y, x] = stack.pop();
          size++;
          for (const [ny, nx] of neighbors(y, x)) {
            if (board[ny][nx] === 0) {
              if (!seen.has(ny * N + nx)) { seen.add(ny * N + nx); stack.push([ny, nx]); }
            } else {
              borders.add(board[ny][nx]);
            }
          }
        }
        if (borders.size === 1) {
          if (borders.has(1)) black += size; else white += size;
        }
      }
    }
  }
  return { black: black, white: white + KOMI };
}

function showScore() {
  const s = score();
  const winner = s.black > s.white ? 'Black' : 'White';
  document.getElementById('result').textContent = winner + ' wins!';
  document.getElementById('details').textContent = 'Black ' + s.black + ' - White ' + s.white + ' (includes ' + KOMI + ' komi)';
  statusEl.textContent = 'Game over. ' + winner + ' wins.';
  setTimeout(() => document.getElementById('modal').classList.add('show'), 400);
}

function updateStatus() {
  if (finished) return;
  const who = turn === 1 ? 'Black' : 'White';
  statusEl.textContent = who + "'s turn" + (passes === 1 ? ' (opponent passed)' : '');
}

function draw() {
  boardEl.innerHTML = '';
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      const pt = document.createElement('div');
      pt.className = 'pt';
      if (r === 0) pt.classList.add('t');
      if (r === N - 1) pt.classList.add('b');
      if (c === 0) pt.classList.add('l');
      if (c === N - 1) pt.classList.add('r');

      if (STAR.includes(r + ',' + c)) {
        const dot = document.createElement('span');
        dot.className = 'hoshi';
        pt.appendChild(dot);
      }
      if (board[r][c] !== 0) {
        const stone = document.createElement('div');
        stone.className = 'stone s' + board[r][c];
        if (lastMove && lastMove[0] === r && lastMove[1] === c) stone.classList.add('last');
        pt.appendChild(stone);
      }
      pt.addEventListener('click', () => onClick(r, c));
      boardEl.appendChild(pt);
    }
  }
  capEl.textContent = 'Captured: Black ' + caps[1] + ' · White ' + caps[2];
  updateStatus();
}

document.getElementById('pass').addEventListener('click', pass);
document.getElementById('undo').addEventListener('click', undo);
document.getElementById('restart').addEventListener('click', newGame);
document.getElementById('playAgain').addEventListener('click', newGame);
newGame();