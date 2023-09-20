const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient
const BaseController = require("./base");

class UserController extends BaseController {
  constructor() {
    super();
  }
  async getUser(req, res) {
    const userdata = [
      {
        name: "john doe",
        email: "john@mail.com",
      },
      {
        name: "brain tracy",
        email: "brian@mail.com",
      },
    ];
    this.success(res, "user data fetched successfully", 200, userdata);
  }
  
  async updateUserBankDetails(req, res) {
    // Assuming you have a route parameter for user ID
    const userId = req.params.id;
    //Assuming the updated bank details are sent in the request body
    const updatedBankDetails = req.body; 
  
    // Check if the user with the specified ID exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });
    
    if (!existingUser) {
      return this.error(res, "User not found", 404);
    }
  
    // Update the user's bank details
    const updatedUser = await prisma.user.update({
      where: { id: userId },
    // Assuming the bank details properties match the Prisma User model  
      data: updatedBankDetails, 
    });
    this.success(res, "User bank details updated successfully", 200, updatedUser);
  }
}
  
  module.exports = UserController;

