// const { Prisma } = require("@prisma/client");
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
      return this.error(res, "You cannot be a receiver", 422);
    }

    if (receivers.length > 0) {
      //check if all receivers are valid
      for (let receiver of receivers) {
        receiversExistsArray.push(await checkIfUserExists(receiver, prisma));
      }

      console.log(receiversExistsArray);

      if (receiversExistsArray.includes(false)) {
        return this.error(
          res,
          "At least one potential receiver does not exist ",
          422
        );
      }
    }

    if (quantity < 1) {
      return this.error(res, "Invalid quantity", 422);
    }

    const responseData = [];

    for (let successfulReceiver of receivers) {
      const orgLunchWallet = await prisma.organizationLunchWallet.findUnique({
        where: {
          id: req.user.org_id,
        },
      });
      const sender = await prisma.user.findUnique({
        where: {
          id: req.user.user_id,
        },
      });

      const currentLunchBalance = Number(orgLunchWallet.balance);
      const senderLunchBalance = Number(sender.lunch_credit_balance);
      const newLunchBalance = currentLunchBalance - quantity;

      if(newLunchBalance > 0 && senderLunchBalance > 0) {
        const newLunch = await prisma.lunch.create({
          data: {
            senderId: req.user.user_id,
            receiverId: successfulReceiver,
            quantity: quantity,
            redeemed: false,
            note: note,
            org_id: req.user.org_id,
          },
        });


        const modifiedOrgLunchWallet = await prisma.organizationLunchWallet.update({

            where: {

              id: req.user.org_id,
            },

            data: {

              balance: String(newLunchBalance)
            }
        })
  
        const modifiedUser = await prisma.user.update({
          where: {
            id: req.user.user_id,
          },
  
          data: {
            lunch_credit_balance: String(Number(senderLunchBalance) - quantity),
          },
        });

        const succReceiver = await prisma.user.findUnique({
           where: {
            id: successfulReceiver
           }
        })

        const receiverPreviousBalance = Number(succReceiver.lunch_credit_balance);
        const newReceiverBalance = receiverPreviousBalance + quantity;
        const receiver = await prisma.user.update({

          where: {
            id: successfulReceiver
          },

          data: {

            lunch_credit_balance: String(newReceiverBalance)
          }
        })

        const data = {
           sender: modifiedUser.id,
           receiver: receiver,
           quantity: quantity
        }

        responseData.push(data);
          
      }  else {

        return this.error(res, "The transaction was rejected over inconsistencies", 403)
      }
     
    }


    

    return this.success(res, "You have access", 200, responseData);
  }
}

module.exports = LunchController;
