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

const WithdrawalRequestSchema = Joi.object({
  bank_name: Joi.string().required() , 
  bank_number: Joi.number().required(), 
  bank_code: Joi.number().required(), 
  amount: Joi.number().required(),
});

const saveBankInfoShema = Joi.object({
  bank_name: Joi.string().required(),
  bank_number: Joi.string().required(),
  bank_code: Joi.string().required(),
  bank_region: Joi.string().required(),
});

module.exports = {
  UserSignupSchema,
  LoginSchema,
  WithdrawalRequestSchema,
  StaffSignupSchema,
  saveBankInfoShema,
};
