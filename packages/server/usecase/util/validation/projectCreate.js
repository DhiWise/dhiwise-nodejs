const Joi = require('joi');
const {
  validateSchema, validationCustomMessage,
} = require('../../../util-service/validation');
const { VALIDATION_RULES } = require('../../../constants/validation');

const projectCreationValidation = (params) => {
  const schema = Joi.object({
    name: Joi.string()
      .trim()
      .required()
      .min(VALIDATION_RULES.PROJECT_NAME.MIN)
      .max(VALIDATION_RULES.PROJECT_NAME.MAX)
      .regex(VALIDATION_RULES.PROJECT_NAME.REGEX)
      .messages(validationCustomMessage('Name')),
    description: Joi.string()
      .trim()
      // .required()
      .min(VALIDATION_RULES.DESCRIPTION.MIN)
      .max(VALIDATION_RULES.DESCRIPTION.MAX)
      .messages(validationCustomMessage('Description')),
  }).unknown(true);

  return validateSchema(schema, params);
};

module.exports = { projectCreationValidation };
