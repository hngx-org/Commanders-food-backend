const BaseController = require("./base");

class WithdrawalController extends BaseController {
  constructor() {
    super();
  }

  async getWithdraw(req, res) {
    const data = [
      {
        id: "id",
        userId: "userId",
        status: "pending",
        amount: 4000000,
        created_at: new Date(),
      },
    ];

    this.success(res, "success", 200, data);
  }
}

module.exports = WithdrawalController;
