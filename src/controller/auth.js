const prisma = require("../config/prisma");
const {
  randomId,
  passwordManager,
  JwtTokenManager,
  genRandomIntId,
} = require("../helper");
const { UserSignupSchema, LoginSchema,passwordResetSchema } = require("../helper/validate");
const BaseController = require("./base");
const shortId = require("short-uuid");

class AuthController extends BaseController {
  constructor() {
    super();
  }

  async userSignup(req, res) {
    const payload = req.body;
    const { error } = UserSignupSchema.validate(payload);
    if (error) {
      return this.error(res, error.message, 400);
    }

    const { email, password, first_name, last_name, phone_number } = payload;

    // check if user exists of not
    const userExists = await prisma.user.findMany({ where: { email } });

    if (userExists.length > 0) {
      return this.error(res, "user with this email already exists.", 400);
    }

    const profilePic = `https://api.dicebear.com/7.x/micah/svg?seed=${first_name}`;
    const pwdHash = passwordManager.hash(password);
    const user_id = genRandomIntId();
    const org_id = genRandomIntId();
    const defaultCurrency = "NGN";

    // resaon of generating this, is the auth_token would be used later when
    // updating organization info
    const refreshToken = JwtTokenManager.genRefreshToken({
      user_id,
      org_id,
    });
    const accessToken = JwtTokenManager.genRefreshToken({
      user_id,
      org_id,
    });

    const createUser = prisma.user.create({
      data: {
        id: user_id,
        first_name,
        last_name,
        profile_pic: profilePic,
        phone: phone_number,
        password_hash: pwdHash,
        refresh_token: refreshToken,
        is_admin: true,
        email,
        org_id,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    // create organization
    const createOrganization = prisma.organization.create({
      data: {
        lunch_price: 1000,
        id: org_id,
        currency_code: defaultCurrency,
      },
    });

    // create organization default wallet
    const createOrgWallet = prisma.organizationLunchWallet.create({
      data: {
        id: genRandomIntId(),
        balance: 10000,
        org_id,
      },
    });

    await prisma.$transaction([
      createOrganization,
      createUser,
      createOrgWallet,
    ]);

    this.success(res, "successfully", 200, {
      access_token: accessToken,
      refresh_token: refreshToken,
      id: user_id,
      name: `${first_name} ${last_name}`,
    });
  }

  async login(req, res) {
    const payload = req.body;
    const { error } = LoginSchema.validate(payload);
    if (error) {
      return this.error(res, error.message, 400);
    }

    const { email, password } = payload;

    // check if user exists of not
    const userExists = await prisma.user.findFirst({ where: { email } });

    if (userExists === null) {
      return this.error(res, "Account notfound.", 400);
    }

    // compare password
    if (
      passwordManager.comparePwd(password, userExists.password_hash) === false
    ) {
      this.error(res, "Credentials Missmatch", 400);
      return;
    }

    const { id, org_id, first_name, last_name, isAdmin } = userExists;

    // resaon of generating this, is the auth_token would be used later when
    // updating organization info
    const refreshToken = JwtTokenManager.genRefreshToken({
      user_id: id,
      org_id,
    });
    const accessToken = JwtTokenManager.genRefreshToken({
      user_id: id,
      org_id,
    });

    // update refresh token
    await prisma.user.update({
      where: { id },
      data: {
        refresh_token: refreshToken,
      },
    });

    // send response
    this.success(res, "Successfully logged in", 201, {
      access_token: accessToken,
      refresh_token: refreshToken,
      id,
      name: `${first_name} ${last_name}`,
      isAdmin,
    });
  }

  async passwordReset(req, res) {
    const payload = req.body;
    

    const { error } = passwordResetSchema.validate(payload);
    if (error) {
      return this.error(res, error.message, 400);
    }

    const { email, password } = payload;
    console.log(email,password)

    const user = await prisma.user.findUnique({
      where: { email: email },
    });
    const errorData = {
      message: `User with id ${user.email} does not exist`,
    };
    if (!user) this.error(res, "User not found", 404, errorData);
    const hashedPasswword = passwordManager.hash(password);

    const updatedPassword = await prisma.user.update({
      where: { id: user.id },
      data: { password_hash: hashedPasswword },
    });
    this.success(
      res,
      "passwords updated successfully",
      200,
      'Password reset successfully, Kindly login.'
    );
  }
}

module.exports = AuthController;
