const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
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
}

module.exports = UserController;
