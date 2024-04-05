const { TicTacToe } = require('../models/tictactoe');

let board = [['', '', ''], ['', '', ''], ['', '', '']];
let currentPlayer = 'X';



function move(row, col) {
    if (board[row][col] === '') {
        board[row][col] = currentPlayer;
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
}
function start() {
    // Create a new instance of TicTacToe
    const game = new TicTacToe();
    // Reset the current player
    currentPlayer = 'X';

    // Play the game until there is a winner or a draw
    while (true) {
        // Get the row and column from the user
        const row = prompt('Enter the row (0-2):');
        const col = prompt('Enter the column (0-2):');

        // Make the move
        game.move(row, col);

        // Check if there is a winner
        const winner = game.checkWin();
        if (winner) {
            console.log(`Player ${winner} wins!`);
            break;
        }

        // Check if it's a draw
        if (game.isDraw()) {
            console.log('It\'s a draw!');
            break;
        }
    }
}
function checkWin() {
    // Vérifiez les lignes
    for (let i = 0; i < 3; i++) {
        if (board[i][0] === board[i][1] && board[i][1] === board[i][2] && board[i][0] !== '') {
            return board[i][0];
        }
    }

    // Vérifiez les colonnes
    for (let i = 0; i < 3; i++) {
        if (board[0][i] === board[1][i] && board[1][i] === board[2][i] && board[0][i] !== '') {
            return board[0][i];
        }
    }

    // Vérifiez les diagonales
    if (board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[0][0] !== '') {
        return board[0][0];
    }
    if (board[0][2] === board[1][1] && board[1][1] === board[2][0] && board[0][2] !== '') {
        return board[0][2];
    }

    // Vérifiez si le tableau est plein
    if (board.flat().every(cell => cell !== '')) {
        return 'Draw';
    }

    // Le jeu est toujours en cours
    return null;
}
