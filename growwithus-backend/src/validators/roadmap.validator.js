const Joi = require("joi");

const videoSchema = Joi.object({
  title: Joi.string().trim().required(),
  youtubeId: Joi.string().trim().required(),
  channel: Joi.string().trim().required()
});

const topicSchema = Joi.object({
  title: Joi.string().trim().required(),
  practiceTask: Joi.string().allow("").optional(),
  videos: Joi.array().items(videoSchema).min(1).required()
});

const projectSchema = Joi.object({
  title: Joi.string().trim().required()
});

const roadmapBodySchema = Joi.object({
  slug: Joi.string().trim().lowercase().required(),
  title: Joi.string().trim().required(),
  description: Joi.string().allow("").optional(),
  category: Joi.string().trim().required(),
  difficulty: Joi.string().trim().required(),
  estimatedDuration: Joi.string().trim().allow("").optional(),
  topics: Joi.array().items(topicSchema).min(1).required(),
  projects: Joi.array().items(projectSchema).optional()
});

const roadmapUpdateBodySchema = Joi.object({
  slug: Joi.string().trim().lowercase().optional(),
  title: Joi.string().trim().optional(),
  description: Joi.string().allow("").optional(),
  category: Joi.string().trim().optional(),
  difficulty: Joi.string().trim().optional(),
  estimatedDuration: Joi.string().trim().allow("").optional(),
  topics: Joi.array().items(topicSchema).optional(),
  projects: Joi.array().items(projectSchema).optional()
}).min(1);

const createRoadmapSchema = Joi.object({
  body: roadmapBodySchema.required(),
  params: Joi.object({}).optional(),
  query: Joi.object({}).optional()
});

const updateRoadmapSchema = Joi.object({
  body: roadmapUpdateBodySchema.required(),
  params: Joi.object({
    id: Joi.string().hex().length(24).required()
  }).required(),
  query: Joi.object({}).optional()
});

const roadmapIdParamSchema = Joi.object({
  body: Joi.object({}).optional(),
  params: Joi.object({
    id: Joi.string().hex().length(24).required()
  }).required(),
  query: Joi.object({}).optional()
});

const roadmapSlugParamSchema = Joi.object({
  body: Joi.object({}).optional(),
  params: Joi.object({
    slug: Joi.string().trim().required()
  }).required(),
  query: Joi.object({}).optional()
});

const getRoadmapsQuerySchema = Joi.object({
  body: Joi.object({}).optional(),
  params: Joi.object({}).optional(),
  query: Joi.object({
    category: Joi.string().trim().optional(),
    difficulty: Joi.string().trim().optional(),
    q: Joi.string().trim().optional()
  }).optional()
});

module.exports = {
  createRoadmapSchema,
  updateRoadmapSchema,
  roadmapIdParamSchema,
  roadmapSlugParamSchema,
  getRoadmapsQuerySchema
};

