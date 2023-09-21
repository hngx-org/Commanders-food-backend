const { Prisma } = require("@prisma/client");
const BaseController = require("./base");
const prisma = require("../config/prisma")

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
  }
  
  async getAllLunch(req, res) {

    const allLunchdata = await prisma.Lunch.findMany({
        where: {
            receiverId: req.user.user_id,//test value waiting for id from auth
        },
    });

    if(allLunchdata.length == 0){
        return this.success(
            res,
            "There are currently no Lunch data",
            200,
            allLunchdata
        );
    }
    this.success(res, "All Lunch data fetched successfully", 200, allLunchdata);
  }
  
}

module.exports = LunchController;
