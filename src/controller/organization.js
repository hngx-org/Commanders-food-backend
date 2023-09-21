const BaseController = require("./base");
const { passwordManager } = require("../helper/index");
const { StaffSignupSchema, organizationInvite } = require("../helper/validate");
const { sendEMail } = require('../helper/sendemail');
const otpGenerator = require('otp-generator');


class OrganizationController extends BaseController {
    constructor() {
        super();
    }
    async createOrganizationInvite(req, res) {
      const { error } = organizationInvite.validate(req.body);

      if (error) {
        return this.error(res, error.message, 400);
      }
        const { email } = req.body;

        const emailExists = await prisma.user.findFirst({ where: { email: email } });
        if (emailExists !== null) {
            return this.error(res, "User already exists", 400);
        }
        const otp = otpGenerator.generate(6,
          { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });

        const subject = 'Invitation to Join Free Lunch Organization';
        const body = `
          You've been invited to join an organization on Free Lunch!

          Use the OTP below to accept the invitation:
          ${otp}`;

        // Send email using helper function
        const sendmail = await sendMail({to: email, subject, text: body});
        return this.success(res, "success", 200);
    };
}

module.exports = OrganizationController;