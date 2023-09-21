const BaseController = require("./base");

class OrganizationController extends BaseController {
    constructor() {
        super();
    }
    async updateOrgWalletBalance(req, res) {
        const user = req.user;
      
          const {org_id} = req.query
          const balance = req.body.balance
          let newBalance = parseInt(balance)
      
          // Validate the balance is a positive number
          if (typeof newBalance !== 'number' || newBalance < 0) {
            return res.status(400).json({ message: 'Invalid balance value' });
          }
          newBalance = newBalance.toString()
          // Update the organization's wallet balance in the database using Prisma
          const organization = await prisma.organizationLunchWallet.update({
            where: { id: org_id },
            data: { balance: newBalance },
          });
      
          const response = {
            message: organization
              ? "Lunch Wallet successully updated"
              : `Lunch wallet not found`,
            statusCode: organization ? 200 : 404,
            data: organization
              ? {
                id: organization.id,
                org_id : organization.org_id,
                status: "success",
                balance: organization.balance,
                created_at: organization.created_at,
                }
              : null,
          };
      
          this.success(res, response.message, response.statusCode, response.data);
        }
}

module.exports = OrganizationController;