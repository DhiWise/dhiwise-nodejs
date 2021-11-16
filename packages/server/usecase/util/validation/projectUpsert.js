const Joi = require('joi');
const {
  validateSchema, validationCustomMessage,
} = require('../validation');

const projectUpsertValidation = (params) => {
  const schema = Joi.object({
    isArchive: Joi.boolean()
      .required()
      .messages(validationCustomMessage('isArchive')),
  }).unknown(true);

  return validateSchema(schema, params);
};

module.exports = { projectUpsertValidation };
