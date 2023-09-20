const express = require("express");
const UserController = require("../controller/user");
const useCatchErrors = require("../error/catchErrors");

class UserRoute {
  router = express.Router();
  userController = new UserController();
  path = "/user";

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get(
      `${this.path}/data`,
      useCatchErrors(this.userController.getUser.bind(this.userController))
    );
  }

  initializeRoutes() {
    // Route to update user's bank details
    this.router.put(
      `${this.path}/update-bank-details/:id`,
      useCatchErrors(this.userController.updateUserBankDetails.bind(this.userController))
    );
  }

  initializeRoutes() {
    // Route to update user's bank details
    this.router.patch(
      `${this.path}/update-bank-details/:id`,
      useCatchErrors(this.userController.updateUserBankDetails.bind(this.userController))
    );
  }

}

module.exports = UserRoute;
