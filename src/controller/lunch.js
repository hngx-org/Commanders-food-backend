const BaseController = require("./base");
const prisma = require("../config/prisma");
const shortId = require("short-uuid");
const { SendLunchSchema } = require("../helper/validate");
const { genRandomIntId } = require("../helper");

class LunchController extends BaseController {
  constructor() {
    super();
  }

  async getLunch(req, res) {
    const lunchId = req.params.id;
    const lunch = await prisma.lunch.findFirst({
      where: {
        AND: {
          id: +lunchId,
          org_id: req?.user?.org_id,
        },
      },
    });

    if (!lunch) {
      this.error(res, "Lunch Not Found", 404);
    } else {
      const lunchData = {
        receiverId: lunch.receiver_id,
        senderId: lunch.sender_id,
        quantity: lunch.quantity,
        redeemed: lunch.redeemed,
        note: lunch.note,
        created_at: "",
        id: req.params?.id,
      };

      this.success(res, "Lunch request created successfully", 200, lunch);
    }
  }

  async getAllLunch(req, res) {
    const lunches = await prisma.lunch.findMany({
      where: {
        OR: [
          {
            receiver_id: req.user.user_id,
          },
          { sender_id: req.user.user_id },
        ],
      },
      include: {
        sender: {
          select: {
            email: true,
            first_name: true,
            last_name: true,
            profile_pic: true,
          },
        },
        receiver: {
          select: {
            email: true,
            first_name: true,
            last_name: true,
            profile_pic: true,
          },
        },
      },
    });

    console.log(lunches);

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
          sender_id: user_id,
          receiver_id: receiver,
          quantity,
          redeemed: false,
          note,
          org_id,
          id: genRandomIntId(),
          created_at: new Date(),
        },
      });
    }

    return this.success(res, "Lunch transfer was successful", 200);
  }
}

module.exports = LunchController;
