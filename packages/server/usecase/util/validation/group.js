const Joi = require('joi');
const {
  validateSchema, validationCustomMessage,
} = require('../validation');
const { validation } = require('../../../constants/validation');

const groupValidation = (params) => {
  const schema = Joi.object({
    name: Joi.string()
      .trim()
      .required()
      .min(validation.name.min)
      .max(validation.name.max)
      .messages(validationCustomMessage('name')),
  }).unknown(true);

  return validateSchema(schema, params);
};

module.exports = { groupValidation };
