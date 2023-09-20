const express = require("express");
const WithdrawController = require("../controller/withdrawal");
const useCatchErrors = require("../error/catchErrors");

class WithdrawalRoute {
  router = express.Router();
  withdrawController = new WithdrawController();
  path = "/auth";

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get(`${this.path}`, useCatchErrors(this.withdrawController.getWithdraw.bind(this.withdrawController)));
  }
}

module.exports = WithdrawalRoute;
