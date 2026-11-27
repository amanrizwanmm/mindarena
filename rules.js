const RULES = {
  memory: {
    title: 'Memory Match',
    items: [
      'The board has 16 cards face down, hiding 8 pairs of pictures.',
      'Click a card to flip it, then click a second card.',
      'If the two cards match, they stay face up. If not, they flip back.',
      'Every two flips count as one move.',
      'Find all 8 pairs to win. Fewer moves means a better score.'
    ]
  },
  pattern: {
    title: 'Pattern Memory',
    items: [
      'Press Start. The colored pads will light up in a pattern.',
      'Watch carefully and do not click while the pattern is playing.',
      'When it says "Your turn!", click the pads in the same order.',
      'Each correct round adds one more step, so the pattern keeps growing.',
      'One wrong pad ends the game. The level you reach is your score.'
    ]
  },
  sudoku: {
    title: 'Sudoku',
    items: [
      'The 9×9 grid is divided into nine 3×3 boxes.',
      'Fill every empty cell with a number from 1 to 9.',
      'Each row, each column and each 3×3 box must contain 1 to 9 exactly once.',
      'Click a cell, then tap a number below or type 1 to 9. Use ⌫ to erase.',
      'Bold numbers are locked. A number turns red if it breaks a rule.',
      'Fill the whole grid with no red numbers to win.'
    ]
  },
  checkers: {
    title: 'Checkers',
    items: [
      'Two players share the screen and take turns. Cyan moves first, then Pink.',
      'A piece moves one square diagonally forward onto an empty dark square.',
      'To capture, jump diagonally over an opponent piece into the empty square behind it.',
      'Capturing is mandatory. If you can jump, you must jump.',
      'If the same piece can jump again after a capture, keep jumping.',
      'Reach the opponent back row to become a king (♛), which can move and capture backward too.',
      'You win when your opponent has no pieces left or no legal moves.'
    ]
  },
  chess: {
    title: 'Chess',
    items: [
      'Two players share the screen. White moves first, then Black.',
      'Click one of your pieces to see where it can go, then click a glowing dot to move. A pink ring means you can capture.',
      'Pawns move forward one square (two on their first move) and capture diagonally.',
      'Rooks move in straight lines. Bishops move diagonally. Queens do both.',
      'Knights jump in an L shape and can hop over other pieces. Kings move one square in any direction.',
      'Special moves: castling (king and rook swap places), en passant, and promotion. A pawn that reaches the far end becomes a queen.',
      'If your king is attacked, you are in check and must escape it.',
      'Checkmate (no escape from check) wins the game. Stalemate and other draws end it with no winner.',
      'Use Undo to take back the last move.'
    ]
  },
    go: {
    title: 'Go',
    items: [
      'Two players share the screen. Black plays first, then White.',
      'On your turn, click an empty intersection to place a stone. Stones never move after that.',
      'Stones that touch along a line form a group. The empty points next to a group are its liberties.',
      'If a group loses all its liberties, it is captured and removed from the board.',
      'You cannot play a stone that would leave your own group with no liberties, unless it captures.',
      'Ko rule: you cannot immediately recreate the previous position by capturing back a single stone.',
      'Press Pass if you have no useful move. When both players pass in a row, the game ends.',
      'Score: your stones plus the empty points only you surround. White gets 6.5 extra points (komi) for moving second.',
      'Before passing, remove dead stones by playing them out, since the game does not mark them for you.',
      'The pink dot marks the last stone played. Use Undo to take back a move.'
    ]
  }
};


const gameId = document.body.dataset.game;
if (RULES[gameId]) {
  const data = RULES[gameId];

  const btn = document.createElement('button');
  btn.className = 'rules-btn';
  btn.textContent = '? Rules';

  const overlay = document.createElement('div');
  overlay.className = 'modal';
  overlay.innerHTML =
    '<div class="modal-box rules-box">' +
    '<h2>' + data.title + ' Rules</h2>' +
    '<ol>' + data.items.map(item => '<li>' + item + '</li>').join('') + '</ol>' +
    '<button class="btn" id="closeRules">Got it</button>' +
    '</div>';

  document.body.append(btn, overlay);

  btn.addEventListener('click', () => overlay.classList.add('show'));
  overlay.addEventListener('click', e => {
    if (e.target === overlay || e.target.id === 'closeRules') {
      overlay.classList.remove('show');
    }
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') overlay.classList.remove('show');
  });
}