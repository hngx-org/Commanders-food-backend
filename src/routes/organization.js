const express = require("express");
const OrganizationController = require("../controller/organization");
const useCatchErrors = require("../error/catchErrors");

class OrganizationRoute {
  router = express.Router();
  organizationController = new OrganizationController();
  path = "/organization";

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get(
      `${this.path}/staff/signup`,
      useCatchErrors(
        this.organizationController.staffSignUp.bind(
          this.organizationController
        )
      )
    );
  }
}

module.exports = OrganizationRoute;
