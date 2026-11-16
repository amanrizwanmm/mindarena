const gridEl = document.getElementById('grid');
const scoreEl = document.getElementById('score');
let grid, score;

function startGame() {
  grid = Array.from({ length: 4 }, () => Array(4).fill(0));
  score = 0;
  addTile(); addTile();
  draw();
  document.getElementById('modal').classList.remove('show');
}

function addTile() {
  const empty = [];
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 4; c++)
      if (grid[r][c] === 0) empty.push([r, c]);
  if (!empty.length) return;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  grid[r][c] = Math.random() < 0.9 ? 2 : 4;
}

function draw() {
  gridEl.innerHTML = '';
  grid.flat().forEach(v => {
    const cell = document.createElement('div');
    cell.className = 'cell' + (v ? ' v' + v : '');
    cell.textContent = v || '';
    gridEl.appendChild(cell);
  });
  scoreEl.textContent = score;
}

function slideRow(row) {
  const nums = row.filter(n => n !== 0);
  for (let i = 0; i < nums.length - 1; i++) {
    if (nums[i] === nums[i + 1]) {
      nums[i] *= 2;
      score += nums[i];
      nums.splice(i + 1, 1);
    }
  }
  while (nums.length < 4) nums.push(0);
  return nums;
}

function move(dir) {
  const before = JSON.stringify(grid);
  if (dir === 'left') grid = grid.map(slideRow);
  if (dir === 'right') grid = grid.map(r => slideRow([...r].reverse()).reverse());
  if (dir === 'up' || dir === 'down') {
    for (let c = 0; c < 4; c++) {
      let col = grid.map(r => r[c]);
      if (dir === 'down') col.reverse();
      col = slideRow(col);
      if (dir === 'down') col.reverse();
      for (let r = 0; r < 4; r++) grid[r][c] = col[r];
    }
  }
  if (JSON.stringify(grid) === before) return;
  addTile();
  draw();
  if (isGameOver()) {
    document.getElementById('finalScore').textContent = score;
    document.getElementById('modal').classList.add('show');
  }
}

function isGameOver() {
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 4; c++) {
      if (grid[r][c] === 0) return false;
      if (c < 3 && grid[r][c] === grid[r][c + 1]) return false;
      if (r < 3 && grid[r][c] === grid[r + 1][c]) return false;
    }
  return true;
}

document.addEventListener('keydown', e => {
  const keys = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down' };
  if (keys[e.key]) { e.preventDefault(); move(keys[e.key]); }
});

let sx, sy;
gridEl.addEventListener('touchstart', e => {
  sx = e.touches[0].clientX;
  sy = e.touches[0].clientY;
});
gridEl.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - sx;
  const dy = e.changedTouches[0].clientY - sy;
  if (Math.max(Math.abs(dx), Math.abs(dy)) < 30) return;
  if (Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? 'right' : 'left');
  else move(dy > 0 ? 'down' : 'up');
});

document.getElementById('restart').addEventListener('click', startGame);
document.getElementById('playAgain').addEventListener('click', startGame);
startGame();