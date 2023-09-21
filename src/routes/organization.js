const express = require('express');
const OrganizationController = require('../controller/organization');
const useCatchErrors = require('../error/catchErrors')
const { isAdmin, isAuthenticated } = require('../middlewares/auth');

class OrganizationRoute {
  router = express.Router();
  organizationController = new OrganizationController();
  path = '/organization';

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post(
      `${this.path}/invite`,
      isAuthenticated,
      isAdmin,
      useCatchErrors(this.organizationController.createOrganizationInvite.bind(
        this.organizationController
      ))
    )
  }
}

module.exports = OrganizationRoute;
