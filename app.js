// Board dimensions
const numRows = 8;
const numCols = 8;
const numMines = 10;

// Create an empty board
let board = [];
for (let row = 0; row < numRows; row++) {
  board[row] = [];
  for (let col = 0; col < numCols; col++) {
    board[row][col] = {
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      neighborMines: 0,
    };
  }
}

let isFirstClick = true;
let isGameOver = false;

// Function to check if the game has been won
function checkWin() {
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      const cell = board[row][col];

      if (!cell.isMine && !cell.isRevealed) {
        return false;
      }
    }
  }
  return true;
}

// Function to generate mines after the first click
function generateMines(firstRow, firstCol) {
  const allPositions = [];

  // Create an array with all possible positions on the board
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      allPositions.push({ row, col });
    }
  }

  // Remove the first clicked position from the array
  const clickedPositionIndex = allPositions.findIndex(
    (pos) => pos.row === firstRow && pos.col === firstCol
  );
  allPositions.splice(clickedPositionIndex, 1);

  // Shuffle the positions array
  for (let i = allPositions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allPositions[i], allPositions[j]] = [allPositions[j], allPositions[i]];
  }

  // Select the first numMines positions as mines
  for (let i = 0; i < numMines; i++) {
    const { row, col } = allPositions[i];
    board[row][col].isMine = true;
  }

  // Update neighborMines count for each cell
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      const cell = board[row][col];
      if (!cell.isMine) {
        let count = 0;
        for (let i = row - 1; i <= row + 1; i++) {
          for (let j = col - 1; j <= col + 1; j++) {
            if (
              i >= 0 &&
              i < numRows &&
              j >= 0 &&
              j < numCols &&
              board[i][j].isMine
            ) {
              count++;
            }
          }
        }
        cell.neighborMines = count;
      }
    }
  }
}

// Function to reveal a cell
function revealCell(row, col) {
  const cell = board[row][col];

  if (cell.isRevealed || cell.isFlagged || isGameOver) {
    return;
  }

  cell.isRevealed = true;

  if (cell.isMine) {
    // Game over, show all mines
    showMines();
    isGameOver = true;
    alert("Game over!");
    return;
  }

  const cellElement = document.getElementById(`cell-${row}-${col}`);
  cellElement.classList.add("revealed");

  if (cell.neighborMines > 0) {
    cellElement.textContent = cell.neighborMines;
  }

  if (cell.neighborMines === 0) {
    // Reveal neighboring cells recursively
    for (
      let i = Math.max(row - 1, 0);
      i <= Math.min(row + 1, numRows - 1);
      i++
    ) {
      for (
        let j = Math.max(col - 1, 0);
        j <= Math.min(col + 1, numCols - 1);
        j++
      ) {
        revealCell(i, j);
      }
    }
  }

  if (checkWin()) {
    isGameOver = true;
    alert("Congratulations! You win!");
  }
}
// Function to handle click on a cell
function cellClick(row, col) {
  const cell = board[row][col];

  if (isFirstClick) {
    generateMines(row, col);
    isFirstClick = false;
  }

  if (cell.isRevealed || cell.isFlagged || isGameOver) {
    return;
  }

  revealCell(row, col);
}

// Function to toggle flag on a cell
function toggleFlag(row, col) {
  const cell = board[row][col];

  if (cell.isRevealed || isGameOver) {
    return;
  }

  cell.isFlagged = !cell.isFlagged;

  const cellElement = document.getElementById(`cell-${row}-${col}`);
  cellElement.classList.toggle("flag");

  if (cell.isFlagged) {
    cellElement.textContent = String.fromCodePoint(0x1f525);
  } else {
    cellElement.textContent = "";
  }
}

// Function to show all mines
function showMines() {
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      const cell = board[row][col];

      if (cell.isMine) {
        const cellElement = document.getElementById(`cell-${row}-${col}`);
        cellElement.classList.add("mine");
        cellElement.textContent = String.fromCodePoint(0x1f4a3);
      }
    }
  }
}

// Create the game board
const boardElement = document.getElementById("board");
for (let row = 0; row < numRows; row++) {
  for (let col = 0; col < numCols; col++) {
    const cell = document.createElement("div");
    cell.id = `cell-${row}-${col}`;
    cell.classList.add("cell");
    cell.addEventListener("click", () => cellClick(row, col));
    cell.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      toggleFlag(row, col);
    });
    boardElement.appendChild(cell);
  }
}
