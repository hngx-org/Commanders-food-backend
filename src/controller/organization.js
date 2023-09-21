const { PrismaClient } = require("@prisma/client");
const short = require("short-uuid");
const prisma = new PrismaClient();
const BaseController = require("./base");
const { passwordManager } = require("../helper/index");
const { StaffSignupSchema, organizationInvite } = require("../helper/validate");
const { sendEMail } = require('../helper/sendemail');
const otpGenerator = require('otp-generator');


class OrganizationController extends BaseController {
  constructor() {
    super();
  }

  async staffSignUp(req, res) {
    // validate payload
    const { error } = StaffSignupSchema.validate(req.body);

    if (error) {
      return this.error(res, error.message, 400);
    }

    const { email, password, first_name, last_name, phone_number } = req.body;
    const hashedPassword = passwordManager.hash(password);
    const id = short.generate();
    const formattedDate = new Date().toISOString();

    // check if staff exists for this organization
    const staffExists = await prisma.user.findFirst({
      where: {
        AND: {
          email,
          org_id: req.user?.org_id,
        },
      },
    });

    if (staffExists !== null) {
      return this.error(res, "User already exists", 400);
    }
    async createOrganizationInvite(req, res) {
      const { error } = organizationInvite.validate(req.body);

      if (error) {
        return this.error(res, error.message, 400);
      }
        const { email } = req.body;

        const emailExists = await prisma.user.findFirst({ where: { email: email } });
        if (emailExists !== null) {
            return this.error(res, "User already exists", 400);
        }
        const otp = otpGenerator.generate(6,
          { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });

        const subject = 'Invitation to Join Free Lunch Organization';
        const body = `
          You've been invited to join an organization on Free Lunch!

          Use the OTP below to accept the invitation:
          ${otp}`;

        // Send email using helper function
        const sendmail = await sendMail({to: email, subject, text: body});
        return this.success(res, "success", 200);
    };

    const newStaff = await prisma.user.create({
      data: {
        id,
        email,
        password_hash: hashedPassword,
        org_id: req.user?.org_id,
        refresh_token: "",
        first_name,
        last_name,
        profile_picture: `https://api.dicebear.com/7.x/micah/svg?seed=${first_name}`,
        phonenumber: phone_number,
        updated_at: formattedDate,
        created_at: formattedDate,
        isAdmin: false,
      },
    });
    this.success(res, "Staff member created successfully", 201, newStaff);
  }

  async updateOrgWalletBalance(req, res) {
    const user = req.user;
    const { org_id } = user;
    const payload = req.body;

    if (typeof payload.amount === "undefined") {
      this.error(res, "Balance is missing", 400);
      return;
    }

    const newBalance = +payload.amount;

    const orgLunchWallet = await prisma.organizationLunchWallet.findFirst({
      where: { org_id },
    });

    const prevBalance = +orgLunchWallet.balance;
    const totalBalance = prevBalance + newBalance;

    // update org lunch wallet balance
    await prisma.organizationLunchWallet.update({
      where: { id: orgLunchWallet.id },
      data: { balance: String(totalBalance) },
    });

    this.success(res, "Successfully topped-up lunch wallet", 200);
  }
}

module.exports = OrganizationController;
