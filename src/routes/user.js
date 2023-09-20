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
			useCatchErrors(
				this.userController.getUser.bind(this.userController)
			)
		);
		this.router.get(
			`${this.path}/profile`,
      isAuthenticated,
			useCatchErrors(
				this.userController.getUserProfile.bind(this.userController)
			)
		);
	}
}

module.exports = UserRoute;
