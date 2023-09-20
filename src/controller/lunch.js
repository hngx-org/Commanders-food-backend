const BaseController = require("./base");
const prisma = require("../config/prisma")

class UserController extends BaseController {
  constructor() {
    super();
  }

  async getAllLunch(req, res) {

    const allLunchdata = await prisma.Lunch.findMany({
        where: {
            receiverId: "wewrr",
        },
    });

    if(allLunchdata.length == 0){
        return this.success(
            res,
            null,
            "There are currently no Lunch data",
            200,
            allLunchdata
        );
    }

    this.success(
      res,
      null,
      "All Lunch data fetched successfully",
      200,
      allLunchdata
    );


  }
}

module.exports = UserController;
