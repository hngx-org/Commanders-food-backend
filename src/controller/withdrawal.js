const prisma = require("../config/prisma");
const BaseController = require("./base");
const { WithdrawalRequestSchema } = require("../helper/validate");
const shortId = require("short-uuid");
const { genRandomIntId } = require("../helper");

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

    const { bank_code, bank_name, bank_number, amount } = req.body;
    const { user_id, org_id } = req?.user;
    // check organization balance
    const organizationBalance = await prisma.organizationLunchWallet.findFirst({
      where: { org_id },
    });
    const orgWalletBalance = organizationBalance?.balance;

    // get user lunch balance
    const userLunchBalance = await prisma.user.findFirst({
      where: { id: user_id },
    });

    const lunchCreditBalance = userLunchBalance?.lunch_credit_balance;

    if (lunchCreditBalance < amount) {
      this.error(res, "Insufficient lunch credit", 400);
      return;
    }

    if (orgWalletBalance < amount) {
      this.error(res, "Request can't be granted at this time.", 400, {
        error: "insufficient-funds",
      });
      return;
    }

    const finalUserLunchBal = lunchCreditBalance - amount;
    const finalOrgLunchBalance = orgWalletBalance - amount;

    // update user lunch balance
    await prisma.user.update({
      where: { id: user_id },
      data: {
        lunch_credit_balance: finalUserLunchBal < 0 ? 0 : finalUserLunchBal,
      },
    });

    // update org lunch wallet balance
    await prisma.organizationLunchWallet.update({
      where: { id: organizationBalance.id },
      data: {
        balance: finalOrgLunchBalance < 0 ? 0 : finalOrgLunchBalance,
      },
    });

    // create a withdrawal request in withdrawals table
    await prisma.withdrawal.create({
      data: {
        user_id,
        status: "pending",
        amount,
        created_at: new Date().toISOString(),
        id: genRandomIntId(),
      },
    });

    // send response
    this.success(res, "Withdrawal request created successfully", 200);
  }

  async allWithdrawals(req, res) {
    const { user_id, org_id } = req.user;

    const allWithdrawals = await prisma.withdrawal.findMany({
      include: { user: true },
    });

    const orgUserWithdrawals = [];
    for (const withdraw of allWithdrawals) {
      const userOrg = await prisma.user.findFirst({
        where: {
          AND: {
            id: withdraw?.user_id,
            org_id,
          },
        },
        include: { organization: true },
      });
      if (userOrg) {
        orgUserWithdrawals.push({
          id: withdraw.id,
          status: withdraw.status,
          amount: withdraw.amount,
          created_at: withdraw.created_at,
          user: {
            id: withdraw.user.id,
            first_name: withdraw.user.first_name,
            last_name: withdraw.user.last_name,
            email: withdraw.user.email,
            profile_pic: withdraw.user.profile_pic,
          },
          organization: {
            name: userOrg.organization.name,
            id: userOrg.organization.id,
            lunch_price: userOrg.organization.lunch_price,
          },
        });
      }
    }

    this.success(
      res,
      "withdrawals fetched successfully",
      200,
      orgUserWithdrawals
    );
  }
}

module.exports = WithdrawalController;
