const express = require('express');
const OrganizationController = require('../controller/organization');

class OrganizationRoute {
  router = express.Router();
  organizationController = new OrganizationController();
  path = '/organization';

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {}
}

module.exports = OrganizationRoute;
