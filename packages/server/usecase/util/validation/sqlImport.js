const Joi = require('joi');
const {
  validateSchema, validationCustomMessage,
} = require('../validation');

const sqlImportValidation = (params) => {
  const schema = Joi.object({
    applicationId: Joi.string()
      .required()
      .messages(validationCustomMessage('applicationId')),
  }).unknown(true);

  return validateSchema(schema, params);
};

const sqlInsertManyValidation = (params) => {
  const schema = Joi.object({
    applicationId: Joi.string()
      .required()
      .messages(validationCustomMessage('applicationId')),
    schemaJson: Joi.array()
      .required()
      .messages(validationCustomMessage('schemaJson')),
  }).unknown(true);

  return validateSchema(schema, params);
};

module.exports = {
  sqlImportValidation,
  sqlInsertManyValidation,
};
