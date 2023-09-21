const Joi = require("joi");

const UserSignupSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().min(6).required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  phonenumber: Joi.string().required(),
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

module.exports = {
  UserSignupSchema,
  LoginSchema,
  WithdrawalRequestSchema,
};
