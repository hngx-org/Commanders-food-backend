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
			useCatchErrors(
				this.userController.allUsers.bind(this.userController)
			)
		);
	}
}

module.exports = UserRoute;
