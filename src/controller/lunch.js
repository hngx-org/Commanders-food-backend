const { Prisma } = require("@prisma/client");
const BaseController = require("./base");

class LunchController extends BaseController {
  constructor() {
    super();
  }

  async getLunch(req, res) {
    const prisma = new PrismaClient();
    const lunchId = req.params.id;
    const lunch = await prisma.lunch.findUnique({ where: { id: lunchId } });

    if (!lunch) {
      const errorData = {
        message: `Lunch with id ${lunchId} does not exist`,
      };
      this.error(res, "Lunch Not Found", 404, errorData);
    } else {
      const lunchData = {
        receiverId: lunch.receiverId,
        senderId: lunch.senderId,
        quantity: lunch.quantity,
        redeemed: lunch.redeemed,
        note: lunch.note,
        created_at: "",
        id: "",
      };

      this.success(res, "Lunch request created successfully", 200, lunchData);
    }
    this.success(res, "success", 200, data);
  }

  async send(req, res) {
    const { receivers, quantity, note } = req.body;

    if (!receivers && !quantity && !note) {
      this.error(res, "Error completing request. Please add credentials", 301);
    }

    const data = {
      receivers,
      quantity,
    };
    this.success(res, "Lunch request created successfully", 201, data);
  }
}

module.exports = LunchController;
