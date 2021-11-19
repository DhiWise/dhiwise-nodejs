const Joi = require('joi');
const {
  validateSchema, validationCustomMessage,
} = require('../../../util-service/validation');

const applicationIdValidation = (params) => {
  const schema = Joi.object({
    applicationId: Joi.string()
      .required()
      .messages(validationCustomMessage('applicationId')),
  }).unknown(true);

  return validateSchema(schema, params);
};

module.exports = { applicationIdValidation };
