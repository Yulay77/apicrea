const checkRole = require("../middlewares/checkRole");
const checkAuth = require("../middlewares/checkAuth");
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
router.delete("/delete", /* middlewares */checkAuth, checkRole("admin"), GameController.deleteAll);

// Item route : DELETE : delete a game
router.delete("/end/:gameId", /* middlewares */ GameController.deleteOne);

// Jouer 
router.post("/play/:gameId", GameController.makeMove);

module.exports = router;
