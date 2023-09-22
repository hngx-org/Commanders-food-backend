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
    this.router.post(
      `${this.path}/user/signup`,
      useCatchErrors(this.authController.userSignup.bind(this.authController))
    );
    this.router.post(
      `${this.path}/login`,
      useCatchErrors(this.authController.login.bind(this.authController))
    );
  }
}

module.exports = AuthRoute;
