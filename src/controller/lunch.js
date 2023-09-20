const BaseController = require('./base');

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
}

module.exports = LunchController;
