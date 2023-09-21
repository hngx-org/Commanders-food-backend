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
      useCatchErrors(this.userController.createBankDetailsForUser.bind(this.userController))
    );

    // Create user bank account details
    this.router.post(
      `${this.path}/bank-details`,
      useCatchErrors(this.userController.getUserProfile.bind(this.userController))
    );

    // Route to update user's bank details (PUT)
    this.router.put(
      `${this.path}/update-bank-details/:id`,
      useCatchErrors(this.userController.updateUserBankDetails.bind(this.userController))
    );

    // Route to update user's bank details (PATCH)
    this.router.patch(
      `${this.path}/update-bank-details/:id`,
      useCatchErrors(this.userController.updateUserBankDetails.bind(this.userController))
    );

    // Route to get all users
    this.router.get(
      `${this.path}/all`,
      isAuthenticated,
      useCatchErrors(this.userController.allUsers.bind(this.userController))
    );
  }
}

module.exports = UserRoute;
