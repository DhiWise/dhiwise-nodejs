/* global */
const Joi = require('joi');
const {
  validateSchema, validationCustomMessage, validateMongoId,
} = require('../../../util-service/validation');
const { PROJECT_DEFINITION_CODE } = require('../../../models/constants/projectDefinition');
const {
  ORM_TYPE, DATABASE_TYPE,
} = require('../../../models/constants/applicationConfig');

const {
  validation, VALIDATION_RULES,
} = require('../../../constants/validation');

const applicationCreationValidation = (params) => {
  const schema = Joi.object({
    projectDefinitionCode: Joi.string()
      .trim()
      .required()
      .regex(VALIDATION_RULES.PROJECT_DEFINITION_CODE)
      .valid(...Object.values(PROJECT_DEFINITION_CODE))
      .messages(validationCustomMessage('Project definition code')),
    definitionId: Joi.string()
      .trim()
      .required()
      .custom(validateMongoId('Definition Id'))
      .messages(validationCustomMessage('Definition id'))
      .allow(null, ''),
    projectId: Joi.string()
      .trim()
      .custom(validateMongoId('Project Id'))
      .optional()
      .messages(validationCustomMessage('Project id'))
      .allow(null, ''),
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
      .messages(validationCustomMessage('Description')),
  }).unknown(true);

  return validateSchema(schema, params);
};

const nodeExpressValidation = (params) => {
  if (params?.stepInput?.ormType === ORM_TYPE.MONGOOSE) {
    params.stepInput.databaseType = DATABASE_TYPE.MONGODB;
  }

  const databaseTypeWithMongoDb = Object.values(DATABASE_TYPE).filter((i) => i !== DATABASE_TYPE.MONGODB);

  const schema = Joi.object({
    authModel: Joi.number()
      .min(validation.authModel.min)
      .max(validation.authModel.max)
      .messages(validationCustomMessage('Auth model')),
    configInput: Joi.object({

      databaseName: Joi.string()
        .trim()
        .required()
        .min(validation.databaseName.min)
        .max(validation.databaseName.max)
        .messages(validationCustomMessage('Database name')),
      port: Joi.string()
        .trim()
        .required()
        /*
         * .min(validation.port.min)
         * .max(validation.port.max)
         */
        .messages(validationCustomMessage('port')),
      types: Joi.array()
        .messages(validationCustomMessage('types')),
      platform: Joi.array()
        .messages(validationCustomMessage('platform')),
      noPlatform: Joi.array()
        .messages(validationCustomMessage('noPlatform')),
      isAuthentication: Joi.boolean()
        .optional()
        .messages(validationCustomMessage('isAuthentication')),
      loginAccess: Joi.object({
        User: Joi.array()
          .optional()
          .messages(validationCustomMessage('User')),
      })
        .optional()
        .messages(validationCustomMessage('loginAccess'))
        .unknown(true),
    }).required()
      .messages(validationCustomMessage('configInput')),
    stepInput: Joi.object({
      ormType: Joi.number()
        .required()
        .valid(...Object.values(ORM_TYPE))
        .messages(validationCustomMessage('ORM type')),
      databaseType: Joi.number()
        .when('ormType', {
          is: ORM_TYPE.MONGOOSE,
          then: Joi.optional().valid(DATABASE_TYPE.MONGODB),
          otherwise: Joi.required().valid(...databaseTypeWithMongoDb),
        })
        .messages(validationCustomMessage('Database type')),
    }).required()
      .messages(validationCustomMessage('Step input')),
  }).unknown(true);

  return validateSchema(schema, params);
};

const applicationCreationV2Validation = (params) => {
  const schema = Joi.object({
    projectDefinitionCode: Joi.string()
      .trim()
      .required()
      .valid(...Object.values(PROJECT_DEFINITION_CODE))
      .messages(validationCustomMessage('Project definition code')),
    definitionId: Joi.string()
      .trim()
      .required()
      .messages(validationCustomMessage('Definition id')),
    projectId: Joi.string()
      .trim()
      .optional()
      .messages(validationCustomMessage('Project id')),
    name: Joi.string()
      .trim()
      .required()
      .min(validation.name.min)
      .max(validation.name.max)
      .messages(validationCustomMessage('Name')),
    description: Joi.string()
      .trim()
      .optional()
      .allow('')
      .max(VALIDATION_RULES.DESCRIPTION.MAX)
      .messages(validationCustomMessage('Description')),
  }).unknown(true);

  return validateSchema(schema, params);
};

module.exports = {
  applicationCreationValidation,
  nodeExpressValidation,
  applicationCreationV2Validation,
};
