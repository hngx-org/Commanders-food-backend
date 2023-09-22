const BaseController = require("./base");
const prisma = require("../config/prisma");
const shortId = require("short-uuid");
const { SendLunchSchema } = require("../helper/validate");

class LunchController extends BaseController {
  constructor() {
    super();
  }

  async getLunch(req, res) {
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
    const lunches = await prisma.lunch.findMany({
      where: {
        receiverId: req.user.user_id, //test value waiting for id from auth
      },
    });

    if (lunches.length == 0) {
      return this.success(
        res,
        "There are currently no Lunch data",
        200,
        lunches
      );
    }

    this.success(res, "Lunch data fetched successfully", 200, lunches);
  }

  async sendLunch(req, res) {
    const payload = req.body;
    const { error } = SendLunchSchema.validate(payload);

    if (error) {
      return this.error(res, error.message, 400);
    }

    const { user_id, org_id } = req.user;
    const { receivers, quantity, note } = payload;
    const receiversExistsArray = [];

    //prevent user from sending lunch to him/her self
    if (receivers.includes(req.user.user_id)) {
      return this.error(res, "You cannot send to yourself", 422);
    }

    if (receivers.length > 0) {
      //check if all receivers are valid
      for (let receiver of receivers) {
        const user = await prisma.user.findFirst({
          where: {
            AND: {
              id: receiver,
              org_id,
            },
          },
        });
        if (user === null) receiversExistsArray.push(false);
        else receiversExistsArray.push(true);
      }

      if (receiversExistsArray.includes(false)) {
        return this.error(
          res,
          "One or more of the specified users do not exist.",
          422
        );
      }
    }

    if (quantity < 1) {
      return this.error(res, "Invalid quantity", 422);
    }

    // add lunch credit
    for (let receiver of receivers) {
      await prisma.lunch.create({
        data: {
          senderId: user_id,
          receiverId: receiver,
          quantity,
          redeemed: false,
          note,
          org_id,
          id: shortId.generate(),
          created_at: new Date(),
        },
      });
    }

    return this.success(res, "Lunch transfer was successful", 200);
  }
}

module.exports = LunchController;
