const { PrismaClient } = require("@prisma/client");
const shortid = require("shortid");
const prisma = new PrismaClient();
const BaseController = require("./base");
const { encryptPassword } = require("../helper/hashPassword");

class OrganizationController extends BaseController {
  constructor() {
    super();
  }

  async staffSignUp(req, res) {
    const { email, password, otp_token, first_name, last_name, phone_number } =
      req.body;

    const hashedPassword = await encryptPassword(password);
    const id = shortid.generate();
    const formattedDate = new Date().toISOString();

    const newStaff = await prisma.User.create({
      data: {
        id,
        email,
        org_id: req.user.org_id,
        password_hash: hashedPassword,
        refresh_token: otp_token,
        first_name,
        last_name,
        phonenumber: phone_number,
        updated_at: formattedDate,
        created_at: formattedDate,
      },
    });
    this.success(res, "Staff member created successfully", 201, newStaff);
  }
}

module.exports = OrganizationController;
