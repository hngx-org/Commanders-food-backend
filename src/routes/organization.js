const express = require('express');
const OrganizationController = require('../controller/organization');
const useCatchErrors = require("../error/catchErrors");
const { isAdmin } = require("../middlewares/auth")

class OrganizationRoute {
  router = express.Router();
  organizationController = new OrganizationController();
  path = '/organization';

  constructor() {
    this.initializeRoutes();

    this.router.patch(
      `${this.path}/wallet/update`,
      isAdmin,
      useCatchErrors(
        this.organizationController.updateOrgWalletBalance.bind(
          this.organizationController
        )
      )
    );
  }

  initializeRoutes() {}
}

module.exports = OrganizationRoute;
