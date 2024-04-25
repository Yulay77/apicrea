const { Game } = require("../models");
// game.js

// Stockage des parties en cours
const activeGames = {
    
};
module.exports = {
    getGame: async (req, res, next) => {
        try {
            const games = Object.values(activeGames);
            const gamesFound = games.filter(game => game.player2 === null);
            res.json(gamesFound);
        } catch (error) {
            next(error);
        }
    },
    createGame: async (req, res, next) => {
        try {
            const creatorId = req.body.creatorId; // Assurez-vous que c'est un UUID
            const gameId = generateGameId(); // Générez un identifiant unique pour la partie
            const newGame = {
                id: gameId,
                player1: creatorId, // Le créateur est le joueur 1
                board: [" ", " ", " ", " ", " ", " ", " ", " ", " "], // Initialiser le plateau de jeu avec un tableau de 9 chaînes vides
            };
            activeGames[gameId] = newGame;
            await Game.create(newGame); // Ajouter la nouvelle partie à la base de données
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
    return [" ", " ", " ", " ", " ", " ", " ", " ", " "];

};

