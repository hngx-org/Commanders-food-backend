const BaseController = require("./base");

class WithdrawalController extends BaseController {
  constructor() {
    super();
  }

  async withdraw(req, res) {
    const payload = {
      message: "Withdrawal request created successfully",
      statusCode: 201,
      data: {
        id: "withdrawal-uuid",
        user_id: "user_id",
        status: "success", // pending | failed
        amount: 100,
        created_at: "2023-09-19T12:00:00Z",
      },
    };

    this.success(res, "success", 201, payload);
  }
}

module.exports = WithdrawalController;
