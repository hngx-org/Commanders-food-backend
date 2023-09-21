const express = require('express');
const LunchController = require('../controller/lunch');
const useCatchErrors = require('../error/catchErrors');
const { isAuthenticated } = require('../middlewares/auth');

class LunchRoute {
  router = express.Router();
  lunchController = new LunchController();
  path = '/lunch';

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get(
      `${this.path}/all`,
      isAuthenticated, //Make sure User is Authenticated
      useCatchErrors(
        this.lunchController.getAllLunch.bind(this.lunchController)
      )
    );
    this.router.post(
      `${this.path}/send`,
      isAuthenticated,
      useCatchErrors(this.lunchController.sendLunch.bind(this.lunchController))
    );

    // redeem user lunch by id
    this.router.put(
      `${this.path}/redeem/:id`,
      isAuthenticated,
      useCatchErrors(
        this.lunchController.redeemLunchById.bind(this.lunchController)
      )
    );

    // redeem all user lunches
    this.router.put(
      `${this.path}/redeem`,
      isAuthenticated,
      useCatchErrors(
        this.lunchController.redeemAllUserLunches.bind(this.lunchController)
      )
    );
  }
}

module.exports = LunchRoute;
