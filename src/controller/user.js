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

	async getUserProfile(req, res) {
		const { user_id } = req.params;

		const user = await prisma.user.findUnique({
			where: { id: user_id },
		});

		if (!user) {
			const errorData = {
				message: `User with id ${user_id} does not exist`,
			};
			this.error(res, "User Not Found", 404, errorData);
		} else {
			const userProfile = {
				data: {
					name: `${user.first_name} ${user.last_name}`,
					email: user.email,
					phonenumber: user.phonenumber,
					profile_picture: user.profile_picture,
					lunch_credit_balance: user.lunch_credit_balance,
				},
			};
			this.success(
				res,
				"User data fetched successfully",
				200,
				userProfile
			);
		}
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

    // retrieve all users within the organization
    async allUsers(req, res) {
        // authenticate request
        const organizationId = req.user.org_id;

        // Retrieve all users within the organization
        const users = await prisma.user.findMany({
          where: {
            organization: { id: organizationId },
        },
    });

      //response payload
      const payload = {
        message: "Successfully retrieved all users",
        statusCode: 200,
        data: users.map((user) => ({
          name: user.first_name + " " + user.last_name,
          email: user.email,
          profile_picture: user.profile_picture,
          user_id: user.id
        }))
      };
      // Send the response to the client
      this.success(res, payload.message, payload.statusCode, payload.data);
    }
}

module.exports = UserController;

