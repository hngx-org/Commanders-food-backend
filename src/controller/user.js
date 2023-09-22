const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const BaseController = require("./base");
const { saveBankInfoShema } = require("../helper/validate");

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
          profile_pic: user.profile_pic,
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
        profile_pic: user.profile_pic,
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
        OR: [{ email: query }, { first_name: query }, { last_name: query }],
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
        profile_pic: user.profile_pic,
        user_id: user.id,
        organization: user.organization,
      })),
    };

    this.success(res, payload.message, payload.statusCode, payload.data);
  }

  // redeem user lunch
  async redeemLunch(req, res) {
    const { ids } = req.body;

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
            id: lunch.receiver_id,
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
          const lunchCreditBalance =
            user.lunch_credit_balance +
            lunch.quantity * organisation.lunch_price;
          await prisma.user.update({
            where: {
              id: lunch.receiver_id,
            },
            data: {
              lunch_credit_balance: lunchCreditBalance,
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

    return this.success(
      res,
      `${ids.length > 1 ? "Lunches" : "Lunch"} redeemed successfully`,
      200
    );
  }

  async saveBankInfo(req, res) {
    const user_id = req.user?.user_id;

    const payload = req.body;

    const { error } = saveBankInfoShema.validate(payload);
    if (error) {
      return this.error(res, error.message, 400);
    }

    const { bank_name, bank_code, bank_number, bank_region } = payload;

    const user = await prisma.user.findUnique({
      where: { id: user_id },
    });
    const errorData = {
      message: `User with id ${user_id} does not exist`,
    };
    if (!user) this.error(res, "User not found", 404, errorData);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        bank_name: bank_name,
        bank_code: bank_code,
        bank_number: bank_number,
        bank_region: bank_region,
      },
    });
    this.success(res, "successfully saved bank details", 200, {
      bank_name,
      bank_code,
      bank_number,
      bank_region,
    });
  }
}

module.exports = UserController;
