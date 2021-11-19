const Joi = require('joi');
const {
  validateSchema, validationCustomMessage,
} = require('../../../util-service/validation');

const defaultInsertModels = (params) => {
  const schema = Joi.object({
    applicationId: Joi.string()
      .required()
      .messages(validationCustomMessage('applicationId')),
    models: Joi.array().items(Joi.object({
      modelName: Joi.string().trim().required().messages(validationCustomMessage('models.modelName')),
      description: Joi.string().trim().optional().messages(validationCustomMessage('models.description')),
      schemaJson: Joi.object().messages(validationCustomMessage('models.schemaJson')),
      hooks: Joi.array().messages(validationCustomMessage('models.hooks')),
      modelIndexes: Joi.array().messages(validationCustomMessage('models.modelIndexes')),
    }))
      .required()
      .messages(validationCustomMessage('models')),
  }).unknown(true);

  return validateSchema(schema, params);
};

module.exports = { defaultInsertModels };
