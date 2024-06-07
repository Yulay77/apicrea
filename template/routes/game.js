const checkRole = require("../middlewares/checkRole");
const checkAuth = require("../middlewares/checkAuth");
const express = require("express");
const router = express.Router();
const GameController = require("../controllers/game"); // Assurez-vous d'avoir un contrôleur de jeu approprié
const translationMiddleware = require("../middlewares/traduction");
const versionning = require("../middlewares/versionning");

// Créer une nouvelle partie
router.post("/create", versionning, translationMiddleware, checkAuth, GameController.createGame);

// Rejoindre une partie existante
router.post("/join/:gameId", versionning, translationMiddleware, checkAuth, GameController.joinGame);

// Item route : GET : fetch an user
router.get("", versionning,  translationMiddleware, checkAuth, GameController.getGame);

// Item route : DELETE ALL : delete all games
router.delete("/delete", versionning, translationMiddleware, checkAuth, checkRole("admin"), GameController.deleteAll);

// Item route : DELETE : delete a game
router.delete("/end/:gameId", versionning, translationMiddleware, checkAuth, GameController.deleteOne);

// Jouer
router.post("/play/:gameId", versionning, translationMiddleware,checkAuth, GameController.makeMove);

module.exports = router;
