const Joi = require('joi');
const {
  validateSchema, validationCustomMessage,
} = require('../../../util-service/validation');
const {
  validation, VALIDATION_RULES,
} = require('../../../constants/validation');

const schemaCreateValidation = (params) => {
  const schema = Joi.object({
    applicationId: Joi.string()
      .trim()
      .required()
      .messages(validationCustomMessage('applicationId')),
    name: Joi.string()
      .min(validation.name.min)
      .max(validation.name.max)
      .trim()
      .required()
      .regex(VALIDATION_RULES.APPLICATION_FILE_NAME_WITHOUT_DASH)
      .messages(validationCustomMessage('name')),
  }).unknown(true);

  return validateSchema(schema, params);
};

const schemaUpdateValidation = (params) => {
  const schema = Joi.object({
    name: Joi.string()
      .min(validation.name.min)
      .max(validation.name.max)
      .trim()
      .required()
      .regex(VALIDATION_RULES.APPLICATION_FILE_NAME_WITHOUT_DASH)
      .messages(validationCustomMessage('name')),
  }).unknown(true);

  return validateSchema(schema, params);
};

const existingSchemaUpdateValidation = (params) => {
  const schema = Joi.object({
    applicationId: Joi.string()
      .trim()
      .required()
      .messages(validationCustomMessage('applicationId')),
    models: Joi.array()
      .required()
      .messages(validationCustomMessage('models')),
  }).unknown(true);

  return validateSchema(schema, params);
};

const sequelizeExistingSchemaUpdateValidation = (params) => {
  const schema = Joi.object({
    applicationId: Joi.string()
      .trim()
      .required()
      .messages(validationCustomMessage('applicationId')),
    models: Joi.array()
      .required()
      .messages(validationCustomMessage('models')),
  }).unknown(true);

  return validateSchema(schema, params);
};

const schemaSearchValidation = (params) => {
  const schema = Joi.object({
    applicationId: Joi.string()
      .trim()
      .required()
      .messages(validationCustomMessage('applicationId')),
    schemaName: Joi.string()
      .required()
      .messages(validationCustomMessage('schemaName')),
  }).unknown(true);

  return validateSchema(schema, params);
};

module.exports = {
  schemaCreateValidation,
  existingSchemaUpdateValidation,
  schemaUpdateValidation,
  sequelizeExistingSchemaUpdateValidation,
  schemaSearchValidation,
};
