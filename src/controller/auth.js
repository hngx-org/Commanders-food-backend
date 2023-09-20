const prisma = require("../config/prisma");
const BaseController = require("./base");

class AuthController extends BaseController {
  constructor() {
    super();
  }
  async getUser(req, res) {
    const userdata = [
      {
        name: "john doe",
        email: "john@mail.com",
      },
      {
        name: "brain tracy",
        email: "brian@mail.com",
      },
    ];
    this.success(res, "user data fetched successfully", 200, userdata);
  }
}

module.exports = AuthController;
