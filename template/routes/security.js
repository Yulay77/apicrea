const {Router} = require("express");
const SecurityController = require("../controllers/security");
const router = new Router();

// Collection route : GET : list users
router.post("/login", /* middlewares */ SecurityController.login);

// Collection route : POST : create an user
//router.post("/register", /* middlewares */ SecurityController.register);

module.exports = router;