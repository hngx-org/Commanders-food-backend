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

    const users = await prisma.user.findMany({
      where: {
        OR: [
          {
            email: {
              contains: query,
            },
          },
          {
            first_name: {
              contains: query,
            },
          },
        ],
      },
      include: { organization: true },
    });
    const payload = {
      message: users
        ? "Users found based on the query"
        : `No user found for the query: ${query}`,
      statusCode: users ? 200 : 404,
      data: users.map((user) => ({
        name: user.first_name + " " + user.last_name,
        email: user.email,
        profile_picture: user.profile_picture,
        user_id: user.id,
        organization: user.organization,
      })),
    };

    this.success(res, payload.message, payload.statusCode, payload.data);
  }

  // redeem user lunch
  async redeemLunch(req, res) {
    const { ids } = req.body;
    const userId = req.user.user_id;

    if (!ids || ids.length === 0) {
      return this.error(res, "No ids provided", 400);
    }

    const lunches = await prisma.lunch.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    if (lunches.length === 0) {
      return this.error(res, "No lunch found", 404);
    }

    for (const lunch of lunches) {
      if (!lunch.redeemed) {
        const organisation = await prisma.organization.findUnique({
          where: {
            id: lunch.org_id,
          },
        });

        const user = await prisma.user.findUnique({
          where: {
            id: lunch.receiverId,
          },
        });

        if (organisation && user) {
          // update lunch
          await prisma.lunch.update({
            where: {
              id: lunch.id,
            },
            data: {
              redeemed: true,
              quantity: 0,
            },
          });

          // update user
          await prisma.user.update({
            where: {
              id: lunch.receiverId,
            },
            data: {
              lunch_credit_balance: String(
                Number(user.lunch_credit_balance) +
                  Number(lunch.quantity) * Number(organisation.lunch_price)
              ),
            },
          });
        }
      } else {
        return this.error(
          res,
          `Lunch with id ${lunch.id} already redeemed`,
          400
        );
      }
    }

    return this.success(res, "Lunches redeemed successfully", 200);
  }
}

module.exports = UserController;
