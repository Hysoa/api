const express = require("express");
const router = express.Router();

const UserController = require("./userController");

router.post("/login", UserController.login);

if (process.env.NODE_ENV === "development") {
  router.post("/create", UserController.createOne);
}

module.exports = router;
