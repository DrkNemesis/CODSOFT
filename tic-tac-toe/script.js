const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const resetBtn = document.getElementById('reset-btn');

let board = ['', '', '', '', '', '', '', '', ''];
const human = 'X';
const ai = 'O';
let gameOver = false;

const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

// Initialize Game
function initGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    gameOver = false;
    statusText.textContent = "Your Turn (X)";
    statusText.style.color = "#cbd5e1";
    cells.forEach(cell => {
        cell.innerHTML = '';
        cell.className = 'cell'; // Reset classes
    });
}

function checkWinnerDetailed(currentBoard) {
    for (let i = 0; i < winPatterns.length; i++) {
        let [a, b, c] = winPatterns[i];
        if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
            return { winner: currentBoard[a], pattern: winPatterns[i] };
        }
    }
    if (!currentBoard.includes('')) return { winner: 'tie' };
    return null; // ongoing
}

function checkWinnerState(boardState) {
    for (let i = 0; i < winPatterns.length; i++) {
        let [a, b, c] = winPatterns[i];
        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            return boardState[a];
        }
    }
    for (let i = 0; i < 9; i++) {
        if (boardState[i] === '') return null; // ongoing
    }
    return 'tie';
}

function highlightWin(pattern) {
    pattern.forEach(index => {
        cells[index].classList.add('win');
    });
}

// Handle User Click
function handleCellClick(e) {
    if (gameOver) return;
    const index = e.target.getAttribute('data-index');
    if (board[index] !== '') return;

    // Human Move
    makeMove(index, human);

    let result = checkWinnerDetailed(board);
    if (result) {
        endGame(result);
        return;
    }

    // AI Turn Indicator
    statusText.textContent = "AI is thinking...";
    document.body.classList.add('disabled'); // Disable clicks during AI thinking

    // Slight delay for realism and to allow UI update
    setTimeout(() => {
        let bestMove = getBestMove(board);
        if (bestMove !== -1) {
            makeMove(bestMove, ai);
            let resultAfterAi = checkWinnerDetailed(board);
            if (resultAfterAi) {
                endGame(resultAfterAi);
            } else {
                statusText.textContent = "Your Turn (X)";
            }
        }
        document.body.classList.remove('disabled');
    }, 400); // 400ms delay
}

function makeMove(index, player) {
    board[index] = player;
    cells[index].classList.add(player.toLowerCase());
    cells[index].innerHTML = `<span class="pop-in">${player}</span>`;
}

function endGame(result) {
    gameOver = true;
    if (result.winner === 'tie') {
        statusText.textContent = "It's a Draw!";
        statusText.style.color = "#fcd34d"; // Amber 300
    } else {
        highlightWin(result.pattern);
        if (result.winner === human) {
            statusText.textContent = "You Win! (Wait, that's impossible...)";
            statusText.style.color = "#38bdf8";
        } else {
            statusText.textContent = "AI Wins! (O)";
            statusText.style.color = "#f472b6";
        }
    }
}

// AI Minimax Logic with Alpha-Beta Pruning
function getBestMove(boardState) {
    let bestScore = -Infinity;
    let move = -1;

    for (let i = 0; i < 9; i++) {
        if (boardState[i] === '') {
            boardState[i] = ai;
            let score = minimax(boardState, 0, false, -Infinity, Infinity);
            boardState[i] = '';

            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function minimax(boardState, depth, isMaximizing, alpha, beta) {
    let result = checkWinnerState(boardState);
    if (result === ai) return 10 - depth; // Prefer winning sooner
    if (result === human) return depth - 10; // Prefer losing later
    if (result === 'tie') return 0;

    if (isMaximizing) {
        let maxScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (boardState[i] === '') {
                boardState[i] = ai;
                let score = minimax(boardState, depth + 1, false, alpha, beta);
                boardState[i] = '';
                maxScore = Math.max(score, maxScore);
                alpha = Math.max(alpha, maxScore);
                if (beta <= alpha) break; // Beta cutoff
            }
        }
        return maxScore;
    } else {
        let minScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (boardState[i] === '') {
                boardState[i] = human;
                let score = minimax(boardState, depth + 1, true, alpha, beta);
                boardState[i] = '';
                minScore = Math.min(score, minScore);
                beta = Math.min(beta, minScore);
                if (beta <= alpha) break; // Alpha cutoff
            }
        }
        return minScore;
    }
}

// Event Listeners
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetBtn.addEventListener('click', initGame);

// Initial set up
initGame();
