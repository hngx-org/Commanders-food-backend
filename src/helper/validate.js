const Joi = require("joi");

const UserSignupSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().min(6).required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  phone_number: Joi.string().required(),
});

const StaffSignupSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().min(6).required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  phone_number: Joi.string().required(),
  otp_token: Joi.string().required(),
});

const LoginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().min(6).required(),
});

const organizationInvite = Joi.object({
  email: Joi.string().required(),
});

const WithdrawalRequestSchema = Joi.object({
  bank_name: Joi.string().required(),
  bank_number: Joi.string().required(),
  bank_code: Joi.string().required(),
  amount: Joi.number().required(),
});

const SendLunchSchema = Joi.object({
  receivers: Joi.array().items(Joi.number()),
  quantity: Joi.number().required(),
  note: Joi.string().required(),
});

const UpdateLunchPriceSchema = Joi.object({
  lunch_price: Joi.number().min(1).required(),
});

const saveBankInfoShema = Joi.object({
  bank_name: Joi.string().required(),
  bank_number: Joi.string().required(),
  bank_code: Joi.string().required(),
  bank_region: Joi.string().required(),
});

const OrganizationUpdateSchema = Joi.object({
  organization_name: Joi.string().required(),
  lunch_price: Joi.number().required(),
});

const passwordResetSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().min(6).required(),
});

module.exports = {
  UserSignupSchema,
  LoginSchema,
  organizationInvite,
  WithdrawalRequestSchema,
  StaffSignupSchema,
  SendLunchSchema,
  UpdateLunchPriceSchema,
  saveBankInfoShema,
  OrganizationUpdateSchema,
  passwordResetSchema,
};
