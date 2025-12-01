import Joi from "joi";

export const validationSchemas = {
  category: {
    create: Joi.object({
      name: Joi.string().required(),
      description: Joi.string().allow("", null).optional(),
    }),
    update: Joi.object({
      name: Joi.string().optional(),
      description: Joi.string().allow("", null).optional(),
    }),
  },
  post: {
    create: Joi.object({
      title: Joi.string().required(),
      content: Joi.string().required(),
      category_id: Joi.number().integer().optional(),
      series_id: Joi.number().integer().optional(),
      status: Joi.string().optional(),
    }),
    update: Joi.object({
      title: Joi.string().optional(),
      content: Joi.string().optional(),
      category_id: Joi.number().integer().optional(),
      series_id: Joi.number().integer().optional(),
      status: Joi.string().optional(),
    }),
  },
  series: {
    create: Joi.object({
      name: Joi.string().required(),
      description: Joi.string().allow("", null).optional(),
    }),
    update: Joi.object({
      name: Joi.string().optional(),
      description: Joi.string().allow("", null).optional(),
    }),
  },
  user: {
    create: Joi.object({
      username: Joi.string().required(),
      email: Joi.string().required(),
      password: Joi.string().required(),
      role_id: Joi.number().integer().optional(),
    }),
    update: Joi.object({
      username: Joi.string().optional(),
      email: Joi.string().optional(),
      password: Joi.string().optional(),
      role_id: Joi.number().integer().optional(),
    }),
  },
  role: {
    create: Joi.object({
      name: Joi.string().required(),
      description: Joi.string().allow("", null).optional(),
    }),
    update: Joi.object({
      name: Joi.string().optional(),
      description: Joi.string().allow("", null).optional(),
    }),
  },
};

export function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        details: error.details.map((d) => d.message),
      });
    }
    req.validated = value;
    next();
  };
}
