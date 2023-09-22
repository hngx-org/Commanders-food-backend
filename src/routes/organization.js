const express = require('express');
const OrganizationController = require('../controller/organization');
const useCatchErrors = require("../error/catchErrors");
const { isAuthenticated, } = require('../middlewares/auth');

class OrganizationRoute {
  router = express.Router();
  organizationController = new OrganizationController();
  path = '/organization';

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    //test endpoints
    this.router.put(
      `${this.path}/create`,
      isAuthenticated,
      isAdmin,
      useCatchErrors(this.organizationController.updateOrganization.bind(this.organizationController))
    );
  }
}

module.exports = OrganizationRoute;
