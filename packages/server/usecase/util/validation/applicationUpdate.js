const Joi = require('joi');
const {
  validateSchema, validationCustomMessage,
} = require('../../../util-service/validation');
const { VALIDATION_RULES } = require('../../../constants/validation');

const applicationUpdateValidation = (params) => {
  const schema = Joi.object({
    name: Joi.string()
      .trim()
      .required()
      .min(VALIDATION_RULES.APPLICATION.NAME.MIN)
      .max(VALIDATION_RULES.APPLICATION.NAME.MAX)
      .regex(VALIDATION_RULES.APPLICATION.NAME.REGEX)
      .messages(validationCustomMessage('Name')),
    description: Joi.string()
      .trim()
      .optional()
      .allow('')
      .max(VALIDATION_RULES.DESCRIPTION.MAX)
      .messages(validationCustomMessage('description')),
    configInput: Joi.object({
      port: Joi.string().optional().regex(VALIDATION_RULES.PORT_REGEX).messages(validationCustomMessage('Port')),
      databaseName: Joi.string()
        .min(VALIDATION_RULES.APPLICATION.NAME.MIN)
        .max(VALIDATION_RULES.APPLICATION.NAME.MAX)
        .optional()
        .regex(VALIDATION_RULES.APPLICATION.NAME.REGEX)
        .messages(validationCustomMessage('Database Name')),
      loginAccess: Joi.object(),
      platform: Joi.array()
        .items(Joi.string()
          .regex(VALIDATION_RULES.APPLICATION.NAME.REGEX)
          .min(VALIDATION_RULES.APPLICATION.NAME.MIN)
          .max(VALIDATION_RULES.APPLICATION.NAME.MAX)).messages(validationCustomMessage('Platform')),
      noPlatform: Joi.array()
        .messages(validationCustomMessage('noPlatform')),
      types: Joi.array()
        .items(Joi.string()
          .regex(VALIDATION_RULES.APPLICATION.NAME.REGEX)
          .min(VALIDATION_RULES.APPLICATION.NAME.MIN)
          .max(VALIDATION_RULES.APPLICATION.NAME.MAX)).messages(validationCustomMessage('Types')),
      isAuthentication: Joi.boolean(),
      applicationToken: Joi.string().optional(),
      authModel: Joi.string().optional(),
    }),
    stepInput: Joi.object({
      packageName: Joi
        .string()
        .regex(VALIDATION_RULES.APPLICATION.PACKAGE_NAME.REGEX)
        .trim()
        .optional()
        .messages(validationCustomMessage('package name')),
    }).unknown(true),
  }).unknown(true);

  return validateSchema(schema, params);
};

const applicationUploadFolderUpdate = (params) => {
  const schema = Joi.object({
    applicationId: Joi.string()
      .trim()
      .required()
      .messages(validationCustomMessage('Application Id')),
    dirStructure: Joi.object()
      .required()
      .messages(validationCustomMessage('Dir Structure')),
  }).unknown(true);

  return validateSchema(schema, params);
};

module.exports = {
  applicationUpdateValidation,
  applicationUploadFolderUpdate,
};
