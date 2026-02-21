const Joi = require("joi");

const upsertProgressSchema = Joi.object({
  body: Joi.object({
    roadmapId: Joi.string().hex().length(24).required(),
    completedModules: Joi.array().items(Joi.string().trim()).optional(),
    completionPercent: Joi.number().min(0).max(100).optional()
  }).required(),
  params: Joi.object({}).optional(),
  query: Joi.object({}).optional()
});

module.exports = { upsertProgressSchema };
