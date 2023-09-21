const express = require("express");
const UserController = require("../controller/user");
const useCatchErrors = require("../error/catchErrors");
const { isAuthenticated } = require("../middlewares/auth");

class UserRoute {
  router = express.Router();
  userController = new UserController();
  path = "/user";

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    // route for getting user profile information

    this.router.get(
      `${this.path}/profile`,
      isAuthenticated,
      useCatchErrors(
        this.userController.getUserProfile.bind(this.userController)
      )
    );

    // Route to get all users
    this.router.get(
      `${this.path}/users`,
      isAuthenticated,
      useCatchErrors(this.userController.allUsers.bind(this.userController))
    );
  }
}

module.exports = UserRoute;
