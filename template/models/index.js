const connection = require("./db");
const UserModel = require("./users")(connection);
const ProductModel = require("./products")(connection);
//const TictactoeModel = require("./tictactoe")(connection);

module.exports = {
  db: connection,
  User: UserModel,
  Product: ProductModel,
  //tictactoe: TictactoeModel,
};