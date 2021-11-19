const Joi = require('joi');
const {
  validateSchema, validationCustomMessage,
} = require('../validation');

const actionValidationValidation = (params) => {
  const schema = Joi.object({
    applicationId: Joi.string()
      .trim()
      .required()
      .messages(validationCustomMessage('Application Id')),
    screenId: Joi.string()
      .trim()
      .required()
      .messages(validationCustomMessage('screen Id')),
    customJson: Joi.object()
      .required()
      .messages(validationCustomMessage('custom Json')),
  }).unknown(true);

  return validateSchema(schema, params);
};

module.exports = { actionValidationValidation };
