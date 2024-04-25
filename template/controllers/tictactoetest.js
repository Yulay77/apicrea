const router = express.Router();

// Initialisation du jeu
let games = {};

// Création d'une nouvelle partie
router.post('/newGame', (req, res) => {
  const gameId = generateGameId();
  games[gameId] = {
    board: [['', '', ''], ['', '', ''], ['', '', '']],
    currentPlayer: 'X',
    winner: null
  };
  res.json({ gameId });
});

// Jouer un coup
router.post('/play/:gameId', (req, res) => {
  const gameId = req.params.gameId;
  const game = games[gameId];
  if (!game) {
    return res.status(404).json({ error: 'Game not found' });
  }
  const { row, col } = req.body;
  if (game.board[row][col]!== '') {
    return res.status(400).json({ error: 'Cell already occupied' });
  }
  game.board[row][col] = game.currentPlayer;
  checkWinner(game);
  game.currentPlayer = game.currentPlayer === 'X'? 'O' : 'X';
  res.json({ board: game.board });
});

// Vérifier si il y a un gagnant
function checkWinner(game) {
  const board = game.board;
  for (let i = 0; i < 3; i++) {
    if (board[i][0] === board[i][1] && board[i][1] === board[i][2] && board[i][0]!== '') {
      game.winner = board[i][0];
      return;
    }
    if (board[0][i] === board[1][i] && board[1][i] === board[2][i] && board[0][i]!== '') {
      game.winner = board[0][i];
      return;
    }
  }
  if (board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[0][0]!== '') {
    game.winner = board[0][0];
    return;
  }
  if (board[0][2] === board[1][1] && board[1][1] === board[2][0] && board[0][2]!== '') {
    game.winner = board[0][2];
    return;
  }
}

// Récupérer l'état du jeu
router.get('/game/:gameId', (req, res) => {
  const gameId = req.params.gameId;
  const game = games[gameId];
  if (!game) {
    return res.status(404).json({ error: 'Game not found' });
  }
  res.json({ board: game.board, winner: game.winner });
});

// Générer un ID de jeu unique
function generateGameId() {
  return Math.random().toString(36).substr(2, 9);
}

module.exports = router;