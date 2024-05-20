const { NOT } = require("sequelize/lib/deferrable");
const { Game } = require("../models");
const uuid = require("uuid");
// game.js

// Stockage des parties en cours
const activeGames = {};

module.exports = {
  getGame: async (req, res, next) => {
    try {
      const gamesFound = await Game.findAll({
        /*where: {
          player2: null,
        },*/
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

      if (game.player2) {
        return res.status(403).json({ error: "Cette partie est déjà pleine." });
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

      if (game.player2) {
        await Game.update(
          { currentTurn: game.player1 },

          {
            where: {
              id: gameId,
            },
          }
        );

        activeGames[gameId].currentTurn = game.player1; // Update the activeGames object as well
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
  /*deleteOne: async (req, res, next) => {
    try {
      const gameId = req.params.gameId;
      await Game.destroy({
        where: {
          id: gameId,
        },
      });
      delete activeGames[gameId];
      res.json({ message: "La partie a été clôturée." });
    } catch (error) {
      next(error);
    }
  },*/
  deleteOne: async (req, res, next) => {
    try {
      const gameId = req.params.gameId;
      const playerId = req.body.playerId; // Récupérez l'identifiant du joueur depuis les paramètres de la requête
  
      // Recherchez la partie par son ID
      const game = await Game.findByPk(gameId);
  
      // Si la partie n'existe pas, retournez une erreur
      if (!game) {
        return res
          .status(404)
          .json({ error: "La partie n'a pas été trouvée." });
      }
  
      // Vérifiez si le joueur fait partie de la partie
      console.log(playerId);
      if (playerId !== game.player1 && playerId !== game.player2) {
        return res
          .status(403)
          .json({ error: "Vous n'êtes pas autorisé à supprimer cette partie." });
      }
  
      await Game.destroy({
        where: {
          id: gameId,
        },
      });
      delete activeGames[gameId];
      res.json({ message: "La partie a été clôturée." });
    } catch (error) {
      next(error);
    }
  },

  makeMove: async (req, res, next) => {
    try {
      const gameId = req.params.gameId; // Récupérez gameId à partir des paramètres de la requête

      const playerId = req.body.playerId; // Récupérez playerId à partir du corps de la requête

      const move = req.body.move; // Récupérez le mouvement à partir du corps de la requête

      // Recherchez la partie par son ID

      const game = await Game.findByPk(gameId);

      // Si la partie n'existe pas, retournez une erreur

      if (!game) {
        return res
          .status(404)
          .json({ error: "La partie n'a pas été trouvée. Soit elle n'existe pas, soit elle a été supprimée." });
      }

      // Si le joueur n'est pas un joueur de cette partie, vous ne pouvez pas jouer
      if (playerId !== game.player1 && playerId !== game.player2) {
        return res
          .status(403)
          .json({ error: "Vous n'êtes pas un joueur de cette partie." });
      }

      // S'il n'y a pas de joueur 2, vous ne pouvez pas jouer
      if (!game.player2) {
        return res.status(403).json({ error: "En attente d'un autre joueur." });
      }


      // Vérifiez si c'est le tour du joueur

      if (game.currentTurn !== playerId) {
        console.log(game.currentTurn);
        return res.status(403).json({ error: "Ce n'est pas votre tour." });
      }

      // Vérifier si la case est déjà remplie

      if (game.board[move] !== " ") {
        return res.status(403).json({ error: "Cette case est déjà remplie." });
      }

      // Mettez à jour le plateau de jeu
      const board = game.board;
      board[move] = playerId === game.player1 ? "X" : "O";
      // Vérifiez si le jeu est terminé
      const winner = checkWinner(board, playerId === game.player1 ? "X" : "O");
      if (winner) {
        await Game.update(
          { winner: winner},
          {
            where: {
              id: gameId,
            },
          }
        );

        res.json({ message: `Le joueur ${winner} a gagné ! Veuillez fermer la partie et en créer une nouvelle, merci !` });
      } else {
        // Mettez à jour le tour actuel

        game.currentTurn =
          playerId === game.player1 ? game.player2 : game.player1;

        await Game.update(
          { board: board, currentTurn: game.currentTurn },
          {
            where: {
              id: gameId,
            },
          }
        );
        res.json({ message: "Mouvement effectué avec succès." });
      }
    } catch (error) {
      next(error);
    }
  },
};
const checkWinner = (board, currentPlayer) => {
  // Vérifiez les lignes
  for (let i = 0; i < 3; i++) {
    if (board[i] === board[i + 1] && board[i + 1] === board[i + 2]) {
      if (board[i] === (currentPlayer === "X" ? "X" : "O")) {
        return currentPlayer;
      }
    }
  }

  // Vérifiez les colonnes
  for (let col = 0; col < 3; col++) {
    if (
      board[col] === board[col + 3] &&
      board[col + 3] === board[col + 6]
    ) {
      if (board[col] === (currentPlayer === "X" ? "X" : "O")) {
        return currentPlayer;
      }
    }
  }
  // Vérifiez les diagonales
  if (board[0] === board[4] && board[4] === board[8]) {
    if (board[0] === (currentPlayer === "X" ? "X" : "O")) {
      return currentPlayer;
    }
  }

  if (board[2] === board[4] && board[4] === board[6]) {
    if (board[2] === (currentPlayer === "X" ? "X" : "O")) {
      return currentPlayer;
    }
  }

  // Si personne n'a gagné, retournez null
  return null;
};
function generateGameId() {
  return uuid.v4();
}
