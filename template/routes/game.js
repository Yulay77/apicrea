// gameRoutes.js

const express = require("express");
const router = express.Router();
const GameController = require("../controllers/game"); // Assurez-vous d'avoir un contrôleur de jeu approprié


// Créer une nouvelle partie
router.post("/create",/*CheckAuth*/ GameController.createGame);

// Rejoindre une partie existante
router.post("/join/:gameId", GameController.joinGame);

//Voir toutes les parties 
router.get("", GameController.getAllGames);
// Autres routes spécifiques au jeu (par exemple, jouer un coup, obtenir l'état du plateau, etc.)

module.exports = router;
