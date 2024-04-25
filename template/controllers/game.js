const { createGame, joinGame, Game } = require("../models");
const uuid = require('uuid');
// game.js

// Stockage des parties en cours
const activeGames = {
    
};

function generateGameId() {
    // Implémentez votre propre logique pour générer un ID unique
    // Par exemple, vous pouvez utiliser un horodatage ou un UUID
    // Pour simplifier, nous utilisons un nombre aléatoire ici
    //return Math.floor(Math.random() * 100);
    return uuid.v4();
};

// Initialiser un plateau de jeu vide
function initializeBoard() {
    return ["", "", "", "", "", "", "", "", ""];
}

module.exports = {

    //Voir toutes les parties
    getAllGames: async (req, res, next) => {
        const games = await Game.findAll();
        res.status(200).json(games);
    },

    createGame: async(req, res, next) => {
        const creatorId = req.body;
        const gameId = generateGameId(); // Générez un identifiant unique pour la partie
        const newGame = {
            id: gameId,
            player1: creatorId, // Le créateur est le joueur 1
            player2: null, // Le joueur 2 n'a pas encore rejoint
            board: initializeBoard(), // Initialiser le plateau de jeu (tableau vide)
        };
        activeGames[gameId] = newGame;
        res.json({ gameId }); // Send the gameId back to the client
        //return gameId;
        
    },

    // Rejoindre une partie existante
    /*joinGame(gameId, playerId) {
        if (activeGames[gameId]) {
            activeGames[gameId].player2 = playerId; // Le joueur 2 rejoint la partie
            return true;
        }
        res.json({ gameId, playerId, CreatorId }); // Send the gameId back to the client
        //return false; // La partie n'existe pas
    */
    joinGame(req, res, next) {
            const { gameId, playerId } = req.body;
            if (activeGames[gameId]) {
                activeGames[gameId].player2 = playerId; // Le joueur 2 rejoint la partie
                res.json({ success: true, gameId, playerId });
            } else {
                res.json({ success: false, message: 'La partie n\'existe pas' });
            }
        },

    // Fonction utilitaire pour générer un identifiant unique
/*    generateGameId() {
        // Implémentez votre propre logique pour générer un ID unique
        // Par exemple, vous pouvez utiliser un horodatage ou un UUID
        // Pour simplifier, nous utilisons un nombre aléatoire ici
        return Math.floor(Math.random() * 1000);
    },

    // Initialiser un plateau de jeu vide
    initializeBoard() {
        return ["", "", "", "", "", "", "", "", ""];
    }
*/

};
