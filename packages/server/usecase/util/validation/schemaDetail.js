const Joi = require('joi');
const {
  validateSchema, validationCustomMessage,
} = require('../validation');

const schemaDetailCreateValidation = (params) => {
  const schema = Joi.object({
    schemaId: Joi.string()
      .required()
      .messages(validationCustomMessage('schemaId')),
  }).unknown(true);

  return validateSchema(schema, params);
};

module.exports = { schemaDetailCreateValidation };
