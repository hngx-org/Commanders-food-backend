const express = require("express");
const WithdrawController = require("../controller/withdrawal");
const useCatchErrors = require("../error/catchErrors");
const { isAuthenticated } = require("../middlewares/auth");

class WithdrawalRoute {
  router = express.Router();
  withdrawController = new WithdrawController();
  path = "/withdrawal";

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get(
      `${this.path}/request`,
      isAuthenticated,
      useCatchErrors(this.withdrawController.withdraw.bind(this.withdrawController))
    );
  }
}

module.exports = WithdrawalRoute;
