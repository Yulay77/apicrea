const { Game } = require("../models");
const uuid = require("uuid");
// game.js

// Stockage des parties en cours
const activeGames = {};

module.exports = {
  getGame: async (req, res, next) => {
    try {
      const gamesFound = await Game.findAll({
        where: {
          player2: null,
        },
      });
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
        currentTurn: creatorId, // Le créateur commence
      };
      activeGames[gameId] = newGame;
      await Game.create(newGame); // Ajouter la nouvelle partie à la base de données
      res.status(201).json(newGame); // Envoyer la nouvelle partie au client
    } catch (error) {
      next(error);
    }
  },
  joinGame: async (req, res, next) => {
    try {
      const gameId = req.params.gameId; // Récupérez gameId à partir des paramètres de la requête
      const playerId = req.body.playerId; // Récupérez playerId à partir du corps de la requête

      // Recherchez la partie par son ID
      const game = await Game.findByPk(gameId);

      // Si la partie n'existe pas, retournez une erreur
      if (!game) {
        return res
          .status(404)
          .json({ error: "La partie n'a pas été trouvée." });
      }

      // Si la partie existe, mettez à jour le joueur 2
      await Game.update(
        { player2: playerId },
        {
          where: {
            id: gameId,
          },
        }
      );

      // Mettez à jour la partie dans activeGames
      if (activeGames[gameId]) {
        activeGames[gameId].player2 = playerId;
      }

      res.json({ message: "Vous avez rejoint la partie." });
    } catch (error) {
      next(error);
    }
  },
  deleteAll: async (req, res, next) => {
    try {
      // Supprimez toutes les parties de la base de données
      await Game.destroy({
        where: {},
        truncate: true, // Cette option supprime toutes les lignes et réinitialise les compteurs d'auto-incrémentation
      });

      // Réinitialisez l'objet activeGames
      for (let prop in activeGames) {
        if (activeGames.hasOwnProperty(prop)) {
          delete activeGames[prop];
        }
      }

      res.json({ message: "Toutes les parties ont été supprimées." });
    } catch (error) {
      next(error);
    }
  },
  deleteOne: async (req, res, next) => {
    try {
      const gameId = req.params.gameId;
      await Game.destroy({
        where: {
          id: gameId,
        },
      });
      delete activeGames[gameId];
      res.json({ message: "La partie a été supprimée." });
    } catch (error) {
      next(error);
    }
  },

  play: async (req, res, next) => {
    try {
      const { gameId, playerId, move } = req.body;

      // Recherchez la partie par son ID
      const game = activeGames[gameId];

      // Faites le mouvement
      game.board[move] = game.currentTurn;

      // Changez le tour
      game.currentTurn =
        game.currentTurn === game.player1 ? game.player2 : game.player1;

      // Mettez à jour la partie dans la base de données
      await Game.update(
        { board: game.board, currentTurn: game.currentTurn },
        {
          where: {
            id: gameId,
          },
        }
      );

      res.json({ message: "Le mouvement a été effectué.", game });
    } catch (error) {
      next(error);
    }
  },
};

function generateGameId() {
  return uuid.v4();

}
/*function initializeBoard() {
  return [" ", " ", " ", " ", " ", " ", " ", " ", " "];
}*/
