const Game = require("../models/game.js");
// game.js

// Stockage des parties en cours
const activeGames = {
    
};
module.exports = {
    iget: async (req, res, next) => {
        
        const game = await Game.findAll();
        if (game) res.json(game);
        else res.sendStatus(404);
    },
    createGame: async (req, res, next) => {
        try {
            const creatorId = req.body;
            const gameId = generateGameId(); // Générez un identifiant unique pour la partie
            const newGame = {
                id: gameId,
                player1: creatorId, // Le créateur est le joueur 1
                player2: null, // Le joueur 2 n'a pas encore rejoint
                board: initializeBoard(), // Initialiser le plateau de jeu (tableau vide)
            };
            activeGames[gameId] = newGame;
            res.status(201).json(newGame); // Envoyer la nouvelle partie au client
        } catch (error) {
            next(error);
        }
    },
    joinGame(gameId, playerId) {
        if (activeGames[gameId]) {
            activeGames[gameId].player2 = playerId; // Le joueur 2 rejoint la partie
            return true;
        }
        return false; // La partie n'existe pas
    },


};
function generateGameId() {
    return Math.floor(Math.random() * 1000);
};
function initializeBoard() {
    return ["", "", "", "", "", "", "", "", ""];
};
