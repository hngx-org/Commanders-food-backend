const express = require("express");
const OrganisationController = require("../controller/organisation");
const useCatchErrors = require("../error/catchErrors");

class OrganisationRoute {
    router = express.Router();
    organisationController = new OrganisationController();
    path = "/organisation";

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get(
            `${this.path}`,
           useCatchErrors(this.organisationController.getOrganisation.bind(this.organisationController))
        );
    }
}

module.exports = OrganisationRoute;