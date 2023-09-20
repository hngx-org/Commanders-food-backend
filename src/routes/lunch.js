const express = require("express");
const LunchController = require("../controller/lunch");
const useCatchErrors = require('../error/catchErrors');

class LunchRoute {
    router = express.Router();
    lunchController = new LunchController();
    path = "/lunch";

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get(
            `${this.path}`,
            useCatchErrors(this.lunchController.getLaunch.bind(this.lunchController))
        );
    }
}

module.exports = LunchRoute;