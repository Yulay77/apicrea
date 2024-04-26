module.exports = function () {
    return function (req, res, next) {
        const { gameId, playerId, move } = req.body;

        // Recherchez la partie par son ID
        const game = activeGames[gameId];

        // Vérifiez si la partie existe
        if (!game) {
            return res.status(404).json({ error: 'La partie n\'a pas été trouvée.' });
        }

        // Vérifiez si c'est le tour du joueur
        if (game.currentTurn !== playerId) {
            return res.status(400).json({ error: 'Ce n\'est pas votre tour.' });
        }

        // Vérifiez si la case est libre
        if (game.board[move] !== " ") {
            return res.status(400).json({ error: 'Cette case est déjà occupée.' });
        }

        // Si toutes les vérifications passent, passez au prochain middleware
        next();
    };
}