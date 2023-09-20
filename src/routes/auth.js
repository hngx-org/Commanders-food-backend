const express = require("express");
const AuthController = require("../controller/auth");
const useCatchErrors = require("../error/catchErrors");

class AuthRoute {
  router = express.Router();
  authController = new AuthController();
  path = "/auth";

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    // test endpoint
    this.router.get(
      `${this.path}/data`,
      useCatchErrors(this.authController.getUser.bind(this.authController))
    );
  }
}

module.exports = AuthRoute;
