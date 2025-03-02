const ROWS = 6;
const COLS = 7;
let board = [];
let currentPlayer = 1;
let gameOver = false;

const gameBoard = document.getElementById('game-board');
const statusDiv = document.getElementById('status');
const resetButton = document.getElementById('reset-button');

function createBoard() {
    board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    gameBoard.innerHTML = '';
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell', 'empty');
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener('click', () => dropPiece(col));
            gameBoard.appendChild(cell);
        }
    }
    statusDiv.textContent = `Player ${currentPlayer}'s turn`;
}

function dropPiece(col) {
    if (gameOver) return;

    for (let row = ROWS - 1; row >= 0; row--) {
        if (board[row][col] === 0) {
            board[row][col] = currentPlayer;
            updateBoard();
            if (checkWin(row, col)) {
                statusDiv.textContent = `Player ${currentPlayer} wins!`;
                gameOver = true;
                return;
            }
            if (board.every(row => row.every(cell => cell !== 0))) {
                statusDiv.textContent = "It's a draw!";
                gameOver = true;
                return;
            }
            currentPlayer = currentPlayer === 1 ? 2 : 1;
            statusDiv.textContent = `Player ${currentPlayer}'s turn`;
            return;
        }
    }
}

function updateBoard() {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
            if (board[row][col] === 1) {
                cell.classList.remove('empty');
                cell.classList.add('player1');
            } else if (board[row][col] === 2) {
                cell.classList.remove('empty');
                cell.classList.add('player2');
            }
        }
    }
}

function checkWin(row, col) {
    const directions = [
        [1, 0], // Vertical
        [0, 1], // Horizontal
        [1, 1], // Diagonal down-right
        [1, -1] // Diagonal down-left
    ];

    for (const [dx, dy] of directions) {
        let count = 1;
        for (let direction of [-1, 1]) {
            let x = row + direction * dx;
            let y = col + direction * dy;
            while (x >= 0 && x < ROWS && y >= 0 && y < COLS && board[x][y] === currentPlayer) {
                count++;
                x += direction * dx;
                y += direction * dy;
            }
        }
        if (count >= 4) {
            return true;
        }
    }
    return false;
}

function resetGame() {
    board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    currentPlayer = 1;
    gameOver = false;
    createBoard();
    statusDiv.textContent = `Player ${currentPlayer}'s turn`;
}

resetButton.addEventListener('click', resetGame);

createBoard();