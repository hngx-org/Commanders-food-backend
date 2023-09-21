const BaseController = require("./base");
const prisma = require("../config/prisma");

const checkIfUserExists = async (userId, prisma) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

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
        receiverId: req.user.user_id, //test value waiting for id from auth
      },
    });

    if (allLunchdata.length == 0) {
      return this.success(
        res,
        "There are currently no Lunch data",
        200,
        allLunchdata
      );
    }
  }

  async sendLunch(req, res) {
    const { receivers, quantity, note } = req.body;

    const receiversExistsArray = [];

    if (!receivers || receivers.length === 0) {
      return this.error(res, "Please add at least receiver", 422);
    }
    //prevent user from sending lunch to him/her self
    if (receivers.includes(req.user.user_id)) {
      return this.error(res, "You cannot send to yourself", 422);
    }

    if (receivers.length > 0) {
      //check if all receivers are valid
      for (let receiver of receivers) {
        receiversExistsArray.push(await checkIfUserExists(receiver, prisma));
      }

      console.log(receiversExistsArray);

      if (receiversExistsArray.includes(false)) {
        return this.error(res, "At least one receiver does not exist", 422);
      }
    }

    if (quantity < 1) {
      return this.error(res, "Invalid quantity", 422);
    }

    const responseData = [];

    const orgLunchWallet = await prisma.organizationLunchWallet.findUnique({
      where: {
        org_id: req.user.org_id,
      },
    });

    const org = await prisma.organization.findUnique({
      where: {
        id: orgLunchWallet.org_id,
      },
    });

    const sender = await prisma.user.findUnique({
      where: {
        id: req.user.user_id,
      },
    });

    const amountToDeduct =
      quantity * receivers.length * Number(org.lunch_price);

    if (amountToDeduct > Number(orgLunchWallet.balance)) {
      return this.error(res, "Organization's lunch balance exceeded", 403);
    }

    //deduct lunch balance from org wallet

    const modifiedOrgWallet = await prisma.organizationLunchWallet.update({
      where: {
        org_id: orgLunchWallet.org_id,
      },
      data: {
        balance: String(Number(orgLunchWallet.balance) - amountToDeduct),
      },
    });

    if (!modifiedOrgWallet) {
      return this.error(res, "The transaction was unsuccessful", 403);
    }

    for (let successfulReceiver of receivers) {
      const succReceiver = await prisma.user.findUnique({
        where: {
          id: successfulReceiver,
        },
      });

      const receiverPreviousBalance = Number(succReceiver.lunch_credit_balance);
      const newReceiverBalance =
        receiverPreviousBalance + quantity * Number(org.lunch_price);
      const receiver = await prisma.user.update({
        where: {
          id: successfulReceiver,
        },

        data: {
          lunch_credit_balance: String(newReceiverBalance),
        },
      });

      if (!receiver) {
        return this.error(res, "The transaction was unsuccessful", 403);
      }

      //add the lunch to the the lunch table
      const newLunch = await prisma.lunch.create({
        data: {
          senderId: sender.id,
          receiverId: successfulReceiver,
          quantity: quantity,
          redeemed: false,
          note: note,
          org_id: req.user.org_id,
        },
      });

      if (!newLunch) {
        return this.error(res, "The transaction was unsuccessful", 403);
      }

      const data = {
        sender: sender.id,
        receiver: { id: receiver.id, email: receiver.email },
        quantity: quantity,
      };

      responseData.push(data);
    }
  }
}

module.exports = LunchController;
