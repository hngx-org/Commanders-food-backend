const express = require("express");
const useCatchErrors = require("../error/catchErrors");
const { isAuthenticated, isAdmin } = require("../middlewares/auth");
const WithdrawalController = require("../controller/withdrawal");

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
      useCatchErrors(
        this.withdrawalController.requestWithdrawal.bind(
          this.withdrawalController
        )
      )
    );

    this.router.get(
      `${this.path}/all`,
      isAuthenticated,
      isAdmin,
      useCatchErrors(
        this.withdrawalController.allWithdrawals.bind(this.withdrawalController)
      )
    );
  }
}

module.exports = WithdrawalRoute;
