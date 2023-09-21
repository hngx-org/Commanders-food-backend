const express = require("express")
const useCatchErrors = require("../error/catchErrors");
const {isAuthenticated} = require('../middlewares/auth');

class WithdrawalRoute {
	router = express.Router();
	withdrawalController = new WithdrawalController();
	path = "/withdrawal";

	constructor() {
		this.initializeRoutes();
	}

  initializeRoutes() {
    // route for withdrawal request
    
    this.router.post(
      `${this.path}/request`,
      isAuthenticated,
      useCatchErrors(this.withdrawalController.withdraw.bind(this.withdrawalController))
    );

  };
}

module.exports = WithdrawalRoute;