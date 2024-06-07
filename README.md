Mathéo Bernabé : matheobernabe
Tom Serayet : Yulay77

Bonjour,
bienvenue dans notre api de tictactoe. 

Notre API comprend un systeme d'authentification. 
Sans le token bearer qui prouve que l'utilisateur est connecté il ne pourra pas intéragir avec la partie gameplay du jeu. 
De plus, en fonction du rôle des utilisateurs ils ne peuvent pas effectuer toutes les actions qu'ils veulent. 

Des règles de gestion telle-que ne pas pouvoir effectuer son tour tant qu'il n'y a pas d'autre joueur dans l'instance de jeu ont été implémentées. 
Nous vous laissons les découvrir dans le controller : game.js

Tous les messages transmis à l'utilisateur sont disponibles en 2 langues : français et anglais. Le choix de la langue par défault est français mais nous pouvons à travers le header définir la langue souhaitée. 

Pour faire des requêtes, nous vous invitons à vous rendre dans le dossier request :
RequestUsers.http => Pour intéragir avec la table user (créer son profil etc...)
RequestGame.http => Pour créer des parties, les rejoindre, jouer, et terminer la partie en la supprimant. 


