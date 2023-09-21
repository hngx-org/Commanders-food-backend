const { PrismaClient } = require("@prisma/client");
const short = require("short-uuid");
const prisma = new PrismaClient();
const BaseController = require("./base");
const { passwordManager } = require("../helper/index");

class OrganizationController extends BaseController {
  constructor() {
    super();
  }

  async staffSignUp(req, res) {
    const { email, password, otp_token, first_name, last_name, phone_number } =
      req.body;

    const hashedPassword = passwordManager.hash(password);
    const id = short.generate();
    const formattedDate = new Date().toISOString();

    const newStaff = await prisma.user.create({
      data: {
        id,
        email,
        org_id: req.user.org_id,
        password_hash: hashedPassword,
        refresh_token: otp_token,
        first_name,
        last_name,
        profile_picture: `https://api.dicebear.com/7.x/micah/svg?seed=${first_name}`,
        phonenumber: phone_number,
        updated_at: formattedDate,
        created_at: formattedDate,
      },
    });
    this.success(res, "Staff member created successfully", 201, newStaff);
  }
}

module.exports = OrganizationController;
