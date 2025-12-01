import Joi from "joi";

export const validationSchemas = {
  category: {
    create: Joi.object({
      name: Joi.string().min(3).max(200).required(),
      description: Joi.string().max(1000).allow("", null).optional(),
    }),
    update: Joi.object({
      name: Joi.string().min(3).max(200).optional(),
      description: Joi.string().max(1000).allow("", null).optional(),
    }),
  },
  post: {
    create: Joi.object({
      title: Joi.string().min(5).max(300).required(),
      content: Joi.string().required(),
      category_id: Joi.string().guid().optional(),
      series_id: Joi.string().guid().optional(),
      status: Joi.string().valid("Draft", "Published", "Archived").optional(),
    }),
    update: Joi.object({
      title: Joi.string().min(5).max(300).optional(),
      content: Joi.string().optional(),
      category_id: Joi.string().guid().optional(),
      series_id: Joi.string().guid().optional(),
      status: Joi.string().valid("Draft", "Published", "Archived").optional(),
    }),
  },
  series: {
    create: Joi.object({
      name: Joi.string().min(3).max(200).required(),
      description: Joi.string().max(1000).allow("", null).optional(),
      status: Joi.string().valid("Active", "Inactive").optional(),
    }),
    update: Joi.object({
      name: Joi.string().min(3).max(200).optional(),
      description: Joi.string().max(1000).allow("", null).optional(),
      status: Joi.string().valid("Active", "Inactive").optional(),
    }),
  },
  user: {
    create: Joi.object({
      username: Joi.string().alphanum().min(3).max(100).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      role_id: Joi.string().guid().optional(),
    }),
    update: Joi.object({
      username: Joi.string().alphanum().min(3).max(100).optional(),
      email: Joi.string().email().optional(),
      password: Joi.string().min(6).optional(),
      role_id: Joi.string().guid().optional(),
    }),
  },
  role: {
    create: Joi.object({
      name: Joi.string().min(3).max(100).required(),
      description: Joi.string().max(500).allow("", null).optional(),
    }),
    update: Joi.object({
      name: Joi.string().min(3).max(100).optional(),
      description: Joi.string().max(500).allow("", null).optional(),
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
