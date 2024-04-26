// gameRoutes.js

const express = require("express");
const router = express.Router();
const GameController = require("../controllers/game"); // Assurez-vous d'avoir un contrôleur de jeu approprié


// Créer une nouvelle partie
router.post("/create", GameController.createGame);

// Rejoindre une partie existante
router.post("/join/:gameId",/* middlewares */ GameController.joinGame);

// Item route : GET : fetch an user
router.get("", /* middlewares */ GameController.getGame);

// Item route : DELETE ALL : delete all games
router.delete("/delete", /* middlewares */ GameController.deleteAll);

// Item route : DELETE : delete a game
router.delete("/delete/:gameId", /* middlewares */ GameController.deleteOne);

// Autres routes spécifiques au jeu (par exemple, jouer un coup, obtenir l'état du plateau, etc.)

router.post("/:gameID", /*middlewares*/ GameController.play);

module.exports = router;
