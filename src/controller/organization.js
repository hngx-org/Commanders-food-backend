const { PrismaClient } = require("@prisma/client");
const short = require("short-uuid");
const prisma = new PrismaClient();
const BaseController = require("./base");
const { passwordManager } = require("../helper/index");
const { StaffSignupSchema } = require("../helper/validate");

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
}

module.exports = OrganizationController;
