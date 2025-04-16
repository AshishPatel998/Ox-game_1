const cells = document.querySelectorAll('#board div');
const status = document.getElementById('status');
const resetButton = document.getElementById('reset');
const popup = document.getElementById('popup');
const popupText = document.getElementById('popup-text');
const popupBtn = document.getElementById('popup-btn');
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const loadingScreen = document.getElementById('loading-screen');
const vsPlayerBtn = document.getElementById('vs-player');
const vsComputerBtn = document.getElementById('vs-computer');

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = false;
let vsComputer = false;

const winConditions = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

window.addEventListener('load', () => {
  setTimeout(() => {
    loadingScreen.style.display = "none";
    startScreen.style.display = "block";
  }, 2000);
});

vsPlayerBtn.onclick = () => {
  vsComputer = false;
  startScreen.style.display = "none";
  gameScreen.style.display = "block";
  gameActive = true;
  resetGame();
};

vsComputerBtn.onclick = () => {
  vsComputer = true;
  startScreen.style.display = "none";
  gameScreen.style.display = "block";
  gameActive = true;
  resetGame();
};

cells.forEach((cell, index) => {
  cell.addEventListener('click', () => handleCellClick(index));
});

resetButton.onclick = resetGame;
popupBtn.onclick = () => {
  popup.style.display = 'none';
  resetGame();
};

function handleCellClick(index) {
  if (!gameActive || board[index] !== "") return;

  board[index] = currentPlayer;
  cells[index].textContent = currentPlayer;
  checkResult();

  if (vsComputer && currentPlayer === "X" && gameActive) {
    currentPlayer = "O";
    setTimeout(() => {
      const bestMove = minimax(board, "O").index;
      board[bestMove] = "O";
      cells[bestMove].textContent = "O";
      checkResult();
      if (gameActive) currentPlayer = "X";
    }, 500);
  } else if (gameActive) {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
  }
}

function checkResult() {
  let roundWon = false;
  for (let condition of winConditions) {
    const [a, b, c] = condition;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      roundWon = true;
      break;
    }
  }

  if (roundWon) {
    gameActive = false;
    showPopup(`${currentPlayer} wins!`);
    return;
  }

  if (!board.includes("")) {
    gameActive = false;
    showPopup("It's a draw!");
    return;
  }
}

function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameActive = true;
  cells.forEach(cell => cell.textContent = "");
  popup.style.display = 'none';
  status.textContent = "Player X's Turn";
}

function showPopup(message) {
  popupText.textContent = message;
  popup.style.display = "flex";
}

// Minimax Algorithm for Hard AI
function minimax(newBoard, player) {
  const availSpots = newBoard.map((v, i) => v === "" ? i : null).filter(v => v !== null);

  if (checkWin(newBoard, "X")) return { score: -10 };
  if (checkWin(newBoard, "O")) return { score: 10 };
  if (availSpots.length === 0) return { score: 0 };

  let moves = [];

  for (let i = 0; i < availSpots.length; i++) {
    let move = {};
    move.index = availSpots[i];
    newBoard[availSpots[i]] = player;

    if (player === "O") {
      let result = minimax(newBoard, "X");
      move.score = result.score;
    } else {
      let result = minimax(newBoard, "O");
      move.score = result.score;
    }

    newBoard[availSpots[i]] = "";
    moves.push(move);
  }

  let bestMove;
  if (player === "O") {
    let bestScore = -Infinity;
    moves.forEach((m, i) => {
      if (m.score > bestScore) {
        bestScore = m.score;
        bestMove = i;
      }
    });
  } else {
    let bestScore = Infinity;
    moves.forEach((m, i) => {
      if (m.score < bestScore) {
        bestScore = m.score;
        bestMove = i;
      }
    });
  }

  return moves[bestMove];
}

function checkWin(board, player) {
  return winConditions.some(condition => {
    return condition.every(index => board[index] === player);
  });
}
