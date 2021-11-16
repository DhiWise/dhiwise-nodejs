const Joi = require('joi');
const {
  validationCustomMessage,
  validateSchema,
} = require('../../../util-service/validation');

const masterCreateValidation = (params) => {
  const schema = Joi.object({
    name: Joi.string()
      .trim()
      .min(1)
      .required()
      .messages(validationCustomMessage('Token')),
    code: Joi.string()
      .trim()
      .min(1)
      .required()
      .messages(validationCustomMessage('Otp')),
  }).unknown(true);

  return validateSchema(schema, params);
};

const masterCodeValidation = (params) => {
  const schema = Joi.object({
    parentCode: Joi.string()
      .trim()
      .messages(validationCustomMessage('Parent Code')),
    code: Joi.string()
      .trim()
      .messages(validationCustomMessage('Code')),
  }).unknown(true);

  return validateSchema(schema, params);
};

module.exports = {
  masterCreateValidation,
  masterCodeValidation,
};
