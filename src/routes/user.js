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
    //Route to get user profile
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
      useCatchErrors(this.userController.allUsers.bind(this.userController))
    );
    // Route to search a user by Name or Email
    this.router.get(
      `${this.path}/search/:query`,
      isAuthenticated,
      useCatchErrors(
        this.userController.searchUserByNameOrEmail.bind(this.userController)
      )
    );
    this.router.patch(
      `${this.path}/bank`,
      isAuthenticated,
      useCatchErrors(
        this.userController.saveBankInfo.bind(this.userController)
      )
    );
  }
}

module.exports = UserRoute;
