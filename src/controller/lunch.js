const BaseController = require("./base");
const prisma = require("../config/prisma")

class LunchController extends BaseController {
  constructor() {
    super();
  }

  // this is sample function to test route
  async getLaunch(req, res) {
    const data = [
      {
        id: 'id',
        senderId: 'senderId',
        receiverId: 'receiverId',
        quantity: 4,
        redeemed: false,
        created_at: new Date(),
        note: 'note'
      }
    ];

    this.success(res, 'success', 200, data);
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

    this.success(
      res,
      "All Lunch data fetched successfully",
      200,
      allLunchdata
    );


  }
}

module.exports = LunchController;

