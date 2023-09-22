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

const OrganizationSchema = Joi.object({
  organization_name: Joi.string().required(),
  lunch_price: Joi.number().required()
})

module.exports = {
  UserSignupSchema,
  LoginSchema,
  OrganizationSchema,
};
