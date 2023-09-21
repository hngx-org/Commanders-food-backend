const prisma = require('../config/prisma');
const BaseController = require("./base");
const WithdrawalRequestSchema = require('../helper/validate');

class WithdrawalController extends BaseController {
  constructor() {
    super();
  }

  async requestWithdrawal(req, res) {
    //get info from req.body
    const payload = req.body;
    const { error } = WithdrawalRequestSchema.validate(payload);

    // validate request body
    if (error) {
      return this.error(res, error.message, 400);
    }
    
    const user = req.user;
    // check organization balance
    const { balance: organizationBalance } = await prisma.OrganizationLunchWallet.findUnique({
      where: { id: user.org_id, },
      select: { balance: true, }
    })
    if(organizationBalance < amount) {
      this.error(res, 
        "--insufficient funds", 
        400,
        {
          error: "sorry, the organization cannot grant this request at this time"
        }
      ) 
      return;
    }

  
    //calculating totalAvailable credits
    let totalAvailableCredits = 0;
    // The lunch price per quantity
    const { lunch_price } = await prisma.organization.findUnique({
      where: { id: user.org_id },
      select: { lunch_price: true }
    }); 

    for (const lunch of user.receiver_lunch) {
      if (!lunch.redeemed) {

        // Check if the withdrawal amount can be covered by this lunch credit
        if (amount <= lunch.quantity * lunch_price) {
          // Calculate the new quantity for this lunch credit
          const remainingQuantity = Math.max(
            0,
            lunch.quantity - Math.ceil(amount / lunch_price)
          );

          // Update the lunch credit with the new quantity
          await prisma.lunch.update({
            where: { id: lunch.id },
            data: { quantity: remainingQuantity, redeemed: true },
          });

          // Update the total available credits
          totalAvailableCredits += remainingQuantity;
          amount -= remainingQuantity * lunch_price;
        } else {
          // This lunch credit doesn't cover the full withdrawal amount
          // No need to mark it as redeemed or update its quantity
        }
      }
    }


    // Check if the withdrawal amount is valid
    if (amount <= totalAvailableCredits * lunch_price) {
      // Perform the withdrawal and update the user's lunch credit balance
      const lunchCreditBalance = user.lunch_credit_balance || '0';
      const newBalance = parseInt(lunchCreditBalance) - amount;
      const updateUserLunchCreditBalance =  prisma.user.update({
        where: { id: user.id },
        data: { lunch_credit_balance: newBalance.toString() },
      });

      const organization = await prisma.organization.findUnique({
        where: { id: user.org_id },
      });
      
      // Update the organization's lunch wallet balance
      const newOrganizationBalance = organization.lunch_wallet_balance - amount;
      const updateOrganizationLunchWalletBalance = prisma.OrganizationLunchWallet.update({
        where: { id: user.org_id },
        data: { balance: newOrganizationBalance },
      });

      // create a withdrawal request in withdrawals table
      const createWithdrawal = prisma.withdrawal.create({
        data: { 
          user_id: user.id,
          status: "success",
          amount,
          created_at: new Date().toISOString(),
        }
      });
      // successful
      //transaction- update user lunch_credit_balance, update_organization_wallet_balance, create withdrawal
      await prisma.$transaction([updateUserLunchCreditBalance, updateOrganizationLunchWalletBalance, createWithdrawal]);

    } else {
    // 'Insufficient lunch credits for withdrawal.'
      this.error(res, 
        "--insufficient funds", 
        400,
        {
          error: "sorry, the organization cannot grant this request at this time"
        }
      ) 
      return;
    }

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
