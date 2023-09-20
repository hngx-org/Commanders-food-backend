const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient
const BaseController = require("./base");

class UserController extends BaseController {
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
  // retrieve all users within the organization
  async allUsers(req, res) {
      // authenticate request
        const organizationId = req.user.org_id;
  
        // Retrieve all users within the organization
        const users = await prisma.user.findMany({
          where: {
            organization: {
              id: organizationId,
            },
          },
        });
  
        //response payload
        const payload = {
          message: "Successfully retrieved all users",
          statusCode: 200,
          data: users.map((user) => ({
            name: user.first_name + " " + user.last_name,
            email: user.email,
            profile_picture: user.profile_picture,
            user_id: user.id
          }))
        };
        // Send the response to the client
        this.success(res, payload.message, payload.statusCode, payload.data);
      }
  }

module.exports = UserController;
