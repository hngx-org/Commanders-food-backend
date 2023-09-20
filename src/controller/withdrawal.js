const prisma = require('../config/prisma');
const BaseController = require("./base");

class WithdrawalController extends BaseController {
  constructor() {
    super();
  }
  async requestWithdrawal(req, res) {
    //get info from req.body
    const { bank_name, bank_number, bank_code, amount } = req.body;

    //check for missing fields
    if(!bank_name || !bank_number || bank_code || amount) {
      this.error(res, 
        "--required field missing in request body", 
        400,
        {
          error: "required field missing in request body"
        }
      ) 
    }
    //create a withdrawal request in withdrawals table
    const user_id = null; // insert user from auth here

    // check user balance
    const { lunch_credit_balance: userBalance } = await prisma.withdrawal.findUnique({
      where: {
        id: user_id,
      },
      select: {
        lunch_credit_balance: true
      }
    })

    const newBalance = userBalance - amount;
    if(newBalance < 0) {
      this.error(res, 
        "--insufficient funds", 
        400,
        {
          error: "you don't have enough funds to make this request"
        }
      ) 
      return;
    }

    // feat- Handle payment service here if implemented

    // create a withdrawal request in withdrawals table
    const createWithdrawal = prisma.withdrawal.create({
      data: { 
        user_id,
        status: "success",
        amount,
        created_at: new Date().toISOString(),
      }
    });

    //update lunch_credit_balance of user
    const updateLunchCreditBalance = prisma.withdrawal.update({
      data: {
        lunch_credit_balance: newBalance,
      },
      where: {
        id: user_id,
      }
    });
    
    //transaction- create withdrawal and update user lunch_credit_balance
    await prisma.$transaction([createWithdrawal, updateLunchCreditBalance])

    //response
    const response = {
      "message": "Withdrawal request created successfully",
      "statusCode": 201,
      "data": {
        "id": withdrawal.id,
        "user_id": withdrawal.user_id,
        "status": "success", // the status should be updated from pending to successfull state assuming we integrated a payment provider.
        amount: withdrawal.amount,
        created_at: withdrawal.created_at,
      }
    }
    // send response
    this.success(res, response.message, response.statusCode, response.data);
  }


}

module.exports = WithdrawalController;
