const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const BaseController = require("./base");

class UserController extends BaseController {
  constructor() {
    super();
  }

  async getUserProfile(req, res) {
    const { user_id } = req.user;

    const user = await prisma.user.findUnique({
      where: { id: user_id },
    });

    if (!user) {
      const errorData = {
        message: `User with id ${user_id} does not exist`,
      };
      this.error(res, "User Not Found", 404, errorData);
    } else {
      const userProfile = {
        data: {
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          phonenumber: user.phonenumber,
          profile_picture: user.profile_picture,
          lunch_credit_balance: user.lunch_credit_balance,
        },
      };
      this.success(res, "User data fetched successfully", 200, userProfile);
    }
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
      include: { organization: true },
    });

    //response payload
    const payload = {
      message: "Successfully retrieved all users",
      statusCode: 200,
      data: users.map((user) => ({
        name: user.first_name + " " + user.last_name,
        email: user.email,
        profile_picture: user.profile_picture,
        user_id: user.id,
        organization: user.organization,
      })),
    };
    // Send the response to the client
    this.success(res, payload.message, payload.statusCode, payload.data);
  }

  // Search a user by their name or email
  async searchUserByNameOrEmail(req, res) {
    const { query } = req.params;

    const user = await prisma.user.findUnique({
      where: {
        OR: [
          { first_name: query, mode: "insensitive" },
          { last_name: query, mode: "insensitive" },
          { email: query, mode: "insensitive" },
        ],
      },
      include: { organization: true }, // Optionally include organization details
    });

    const payload = {
      message: user
        ? "User found based on the query"
        : `No user found for the query: ${query}`,
      statusCode: user ? 200 : 404,
      data: user
        ? {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            profile_picture: user.profile_picture,
            user_id: user.id,
            organization: user.organization,
          }
        : null,
    };

    this.success(res, payload.message, payload.statusCode, payload.data);
  }
}

module.exports = UserController;
