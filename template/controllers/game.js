const { createGame, joinGame } = require("../models/game.js");
// game.js

// Stockage des parties en cours
const activeGames = {
    
};

// Créer une nouvelle partie
function createGame(creatorId) {
    const gameId = generateGameId(); // Générez un identifiant unique pour la partie
    const newGame = {
        id: gameId,
        player1: creatorId, // Le créateur est le joueur 1
        player2: null, // Le joueur 2 n'a pas encore rejoint
        board: initializeBoard(), // Initialiser le plateau de jeu (tableau vide)
    };
    activeGames[gameId] = newGame;
    return gameId;
}

// Rejoindre une partie existante
function joinGame(gameId, playerId) {
    if (activeGames[gameId]) {
        activeGames[gameId].player2 = playerId; // Le joueur 2 rejoint la partie
        return true;
    }
    return false; // La partie n'existe pas
}

// Fonction utilitaire pour générer un identifiant unique
function generateGameId() {
    // Implémentez votre propre logique pour générer un ID unique
    // Par exemple, vous pouvez utiliser un horodatage ou un UUID
    // Pour simplifier, nous utilisons un nombre aléatoire ici
    return Math.floor(Math.random() * 1000);
}

// Initialiser un plateau de jeu vide
-function initializeBoard() {
    return ["", "", "", "", "", "", "", "", ""];
}

module.exports = {
    createGame,
    joinGame,
};
