const express = require('express');
const LunchController = require('../controller/lunch');
const useCatchErrors = require('../error/catchErrors');

class LunchRoute {
  router = express.Router();
  lunchController = new LunchController();
  path = '/lunch';

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {}
}

module.exports = LunchRoute;
