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
  };

  initializeRoutes() {
    // Route to get all users
    this.router.get(
      `${this.path}/users`, 

      useCatchErrors(this.userController.allUsers.bind(this.userController))
    );

  }}

module.exports = AuthRoute;
