const BaseController = require("./base");

class LunchController extends BaseController {
  constructor() {
    super();
  }

  // this is sample function to test route
  async getLaunch(req, res) {
    const data = [
      {
        id: "id",
        senderId: "senderId",
        receiverId: "receiverId",
        quantity: 4,
        redeemed: false,
        created_at: new Date(),
        note: "note",
      },
    ];

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
