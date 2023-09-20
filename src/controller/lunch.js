const { PrismaClient } = require("@prisma/client");
const BaseController = require("./base");

const checkIfUserExists = async (userId, prisma) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  console.log(11, user);

  if (user === null) {
    return false;
  } else {
    return true;
  }
};
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
    const prisma = new PrismaClient();

    const { receivers, quantity, note } = req.body;
    const existenceArray = [];


    if(!receivers) {

      this.error(res, "Please fill the receivers credential", 404);
    }
    //checks if all elements in the receivers array exist.
    for (let i of receivers) {
      existenceArray.push(await checkIfUserExists(i, prisma));
    }

    let allReceiversExist;

    if (existenceArray.includes(false)) {
      allReceiversExist = false;
    }

    console.log(56, allReceiversExist);

    if (!allReceiversExist) {
      this.error(res, "At least one potential receiver does not exist", 404);
    }

    if (quantity < 1) {
      this.error(res, "Invalid quantity", 422);
    }

    if (!note) {
      this.error(res, "Please enter a note", 422);
    }

    const data = {
      receivers,
      quantity,
    };
    this.success(res, "Lunch request created successfully", 201, data);
  }
}

module.exports = LunchController;
