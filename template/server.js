require("dotenv").config();
const express = require("express");
const UserRouter = require("./routes/users");
const ProductRouter = require("./routes/products");
const securityRouter = require("./routes/security");
const GameRouter = require("./routes/game");
const checkAuth = require("./middlewares/checkAuth");

const app = express();

app.use(express.json());

app.use("/security", securityRouter);
app.use("/users", UserRouter);
app.use("/products", checkAuth, ProductRouter);
app.use("/game", GameRouter);

app.listen(process.env.PORT, () =>
  console.log("Server listening on port " + process.env.PORT)
);