const boardEl = document.getElementById('sudoku');
const padEl = document.getElementById('pad');
let puzzle, current, selected = null;

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function isValid(b, r, c, n) {
  for (let i = 0; i < 9; i++) {
    if (b[r][i] === n || b[i][c] === n) return false;
  }
  const br = r - (r % 3), bc = c - (c % 3);
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++)
      if (b[br + i][bc + j] === n) return false;
  return true;
}

function fillBoard(b) {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (b[r][c] === 0) {
        for (const n of shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9])) {
          if (isValid(b, r, c, n)) {
            b[r][c] = n;
            if (fillBoard(b)) return true;
            b[r][c] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function newGame() {
  const full = Array.from({ length: 9 }, () => Array(9).fill(0));
  fillBoard(full);
  puzzle = full.map(row => [...row]);
  let removed = 0;
  while (removed < 40) {
    const r = Math.floor(Math.random() * 9);
    const c = Math.floor(Math.random() * 9);
    if (puzzle[r][c] !== 0) { puzzle[r][c] = 0; removed++; }
  }
  current = puzzle.map(row => [...row]);
  selected = null;
  document.getElementById('modal').classList.remove('show');
  draw();
}

function hasConflict(r, c) {
  const v = current[r][c];
  if (!v) return false;
  for (let i = 0; i < 9; i++) {
    if (i !== c && current[r][i] === v) return true;
    if (i !== r && current[i][c] === v) return true;
  }
  const br = r - (r % 3), bc = c - (c % 3);
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++) {
      const rr = br + i, cc = bc + j;
      if ((rr !== r || cc !== c) && current[rr][cc] === v) return true;
    }
  return false;
}

function draw() {
  boardEl.innerHTML = '';
  const selValue = selected ? current[selected[0]][selected[1]] : 0;
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const cell = document.createElement('div');
      cell.className = 'sc';
      if (puzzle[r][c] !== 0) cell.classList.add('given');
      if (c % 3 === 2 && c !== 8) cell.classList.add('bR');
      if (r % 3 === 2 && r !== 8) cell.classList.add('bB');
      if (selValue && current[r][c] === selValue) cell.classList.add('same');
      if (selected && selected[0] === r && selected[1] === c) cell.classList.add('sel');
      if (hasConflict(r, c)) cell.classList.add('bad');
      cell.textContent = current[r][c] || '';
      cell.addEventListener('click', () => { selected = [r, c]; draw(); });
      boardEl.appendChild(cell);
    }
  }
}

function setValue(n) {
  if (!selected) return;
  const [r, c] = selected;
  if (puzzle[r][c] !== 0) return;
  current[r][c] = n;
  draw();
  if (isSolved()) {
    setTimeout(() => document.getElementById('modal').classList.add('show'), 300);
  }
}

function isSolved() {
  for (let r = 0; r < 9; r++)
    for (let c = 0; c < 9; c++)
      if (current[r][c] === 0 || hasConflict(r, c)) return false;
  return true;
}

for (let n = 1; n <= 9; n++) {
  const b = document.createElement('button');
  b.textContent = n;
  b.addEventListener('click', () => setValue(n));
  padEl.appendChild(b);
}
const erase = document.createElement('button');
erase.textContent = '⌫';
erase.addEventListener('click', () => setValue(0));
padEl.appendChild(erase);

document.addEventListener('keydown', e => {
  if (e.key >= '1' && e.key <= '9') setValue(Number(e.key));
  if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') setValue(0);
});

document.getElementById('newGame').addEventListener('click', newGame);
document.getElementById('playAgain').addEventListener('click', newGame);
newGame();