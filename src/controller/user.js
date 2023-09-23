const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const BaseController = require("./base");
const {
  saveBankInfoShema,
  passwordResetSchema,
  ForgotPasswordSchema,
} = require("../helper/validate");
const sendEmail = require("../helper/sendMail");
const otpGenerator = require("otp-generator");
const { passwordManager } = require("../helper");

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
        AND: {
          id: {
            in: ids,
          },
          receiver_id: req?.user?.user_id,
          org_id: req?.user?.org_id,
        },
      },
    });
    const user = await prisma.user.findFirst({
      where: { id: req.user?.user_id },
      include: { organization: true },
    });

    // check if one of the lunch id doesn't exist
    if (lunches.length !== ids.length) {
      return this.error(
        res,
        "One or more of the specified lunch do not exist.",
        404
      );
    }

    if (lunches.length === 0) {
      return this.error(res, "No lunch found", 404);
    }

    for (const lunch of lunches) {
      if (!lunch.redeemed) {
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
          lunch.quantity * user.organization.lunch_price;
        await prisma.user.update({
          where: {
            id: lunch.receiver_id,
          },
          data: {
            lunch_credit_balance: lunchCreditBalance,
          },
        });
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

  async passwordReset(req, res) {
    const payload = req.body;

    const { error } = passwordResetSchema.validate(payload);
    if (error) {
      return this.error(res, error.message, 400);
    }

    const { new_password, otp_code } = payload;

    // verify otp_code
    const otpCodeInvite = await prisma.organizationInvite.findFirst({
      where: {
        token: otp_code,
        ttl: {
          gte: new Date(), // check if the expiration is Greater than or equal to current time
        },
      },
      select: { org_id: true, email: true, id: true },
    });

    if (!otpCodeInvite) {
      return this.error(res, "Invalid OTP code", 422);
    }

    const user = await prisma.user.findFirst({
      where: {
        AND: {
          email: otpCodeInvite.email,
          org_id: otpCodeInvite.org_id,
        },
      },
    });

    if (user === null) {
      return this.error(res, "Invalid OTP code, user don't exist", 422);
    }

    const hashedPasswword = passwordManager.hash(new_password);
    await prisma.user.update({
      where: { id: user.id },
      data: { password_hash: hashedPasswword },
    });
    // delete otp code
    await prisma.organizationInvite.delete({
      where: {
        id: otpCodeInvite.id,
      },
    });

    this.success(res, "Password reset successfully", 200);
  }

  async forgotPassword(req, res) {
    const { error } = ForgotPasswordSchema.validate(req.body);
    if (error) {
      return this.error(res, error.message, 400);
    }

    const { email } = req.body;
    const user = await prisma.user.findFirst({ where: { email } });
    if (user === null) {
      return this.error(res, "User not found", 404);
    }

    // send password reset email
    const now = new Date();
    const fifteenMinutesLater = new Date(now.getTime() + 15 * 60 * 1000);
    const otpCode = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });
    const PasswordResetMail = `
    Password Reset - OTP Confirmation

    Dear ${user.first_name + " " + user.last_name},

    You are receiving this email because a request to reset your password has been initiated. Please use the OTP (One-Time Password) below to confirm your password reset:

    <div style="background-color: #f0f0f0; padding: 15px; text-align: center; border-radius: 5px;">
        <h3>One-Time Password (OTP)</h3>
        <p style="font-size: 24px; font-weight: bold; color: #0070b7;">${otpCode}</p>
        <p style="font-size: 14px; color: #777;">This OTP is valid for the next 15 minutes. Please do not share it with anyone.</p>
    </div>

    If you didn't initiate this password reset request, please ignore this email. Your account remains secure.

    Note: This OTP is valid for 15 minutes only.
    `;

    await prisma.organizationInvite.create({
      data: {
        email,
        token: otpCode,
        ttl: fifteenMinutesLater,
        org_id: user?.org_id,
      },
    });

    await sendEmail({
      subject: "Password Reset",
      to: email,
      text: PasswordResetMail,
    });

    this.success(
      res,
      "Forgot password OTP sent",
      201,
      process.env.NODE_ENV !== "production" && otpCode
    );
  }
}

module.exports = UserController;
