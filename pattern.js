const pads = document.querySelectorAll('.pad-btn');
const levelEl = document.getElementById('level');
const msgEl = document.getElementById('msg');
const startBtn = document.getElementById('startBtn');
let sequence = [], step = 0, accepting = false, best = 0;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function flash(i) {
  pads[i].classList.add('lit');
  await sleep(450);
  pads[i].classList.remove('lit');
  await sleep(180);
}

async function playSequence() {
  accepting = false;
  msgEl.textContent = 'Watch carefully...';
  await sleep(600);
  for (const i of sequence) await flash(i);
  step = 0;
  accepting = true;
  msgEl.textContent = 'Your turn!';
}

function nextRound() {
  sequence.push(Math.floor(Math.random() * 4));
  levelEl.textContent = sequence.length;
  playSequence();
}

function startGame() {
  sequence = [];
  levelEl.textContent = 0;
  startBtn.hidden = true;
  document.getElementById('modal').classList.remove('show');
  nextRound();
}

function gameOver() {
  accepting = false;
  const reached = sequence.length - 1;
  if (reached > best) best = reached;
  document.getElementById('finalLevel').textContent = reached;
  document.getElementById('bestLevel').textContent = best;
  msgEl.textContent = 'Wrong pad!';
  document.getElementById('modal').classList.add('show');
}

pads.forEach((pad, i) => {
  pad.addEventListener('click', () => {
    if (!accepting) return;
    pad.classList.add('lit');
    setTimeout(() => pad.classList.remove('lit'), 200);

    if (i !== sequence[step]) { gameOver(); return; }

    step++;
    if (step === sequence.length) {
      accepting = false;
      msgEl.textContent = 'Correct!';
      setTimeout(nextRound, 900);
    }
  });
});

startBtn.addEventListener('click', startGame);
document.getElementById('playAgain').addEventListener('click', startGame);