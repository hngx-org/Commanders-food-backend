const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient
const BaseController = require("./base");

class UserController extends BaseController {
  constructor() {
    super();
  }
  
  async getProfileInfo(req, res) {
    const userId = req.user?.user_id;
      if (!userId) {
        return this.error(res, "User ID not found in the request", 400);
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          first_name: true,
          last_name: true,
          email: true,
          profile_picture: true,
          phonenumber: true,
          bank_number: true,
          bank_code: true,
          bank_name: true,
          isAdmin: true,
        },
      });

      if (!user) {
        return this.error(res, "User not found", 404);
      }

      this.success(res, "User data fetched successfully", 200, {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        profile_picture: user.profile_picture,
        phonenumber: user.phonenumber,
        bank_number: user.bank_number,
        bank_code: user.bank_code,
        bank_name: user.bank_name,
        isAdmin: user.isAdmin,
      });
  }
}

module.exports = UserController;
