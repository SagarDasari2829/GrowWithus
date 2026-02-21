const Joi = require("joi");

const registerSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().trim().min(2).max(80).required(),
    email: Joi.string().trim().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid("student", "admin").optional(),
    year: Joi.number().integer().min(1).max(4).optional()
  }).required(),
  params: Joi.object({}).optional(),
  query: Joi.object({}).optional()
});

const loginSchema = Joi.object({
  body: Joi.object({
    email: Joi.string().trim().email().required(),
    password: Joi.string().required()
  }).required(),
  params: Joi.object({}).optional(),
  query: Joi.object({}).optional()
});

module.exports = { registerSchema, loginSchema };
