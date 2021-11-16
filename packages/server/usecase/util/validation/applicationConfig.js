const Joi = require('joi');
const {
  validateSchema, validationCustomMessage,
} = require('../../../util-service/validation');

const appConfigCreateValidation = (params) => {
  const schema = Joi.object({
    responseFormatter: Joi.array().items(Joi.object({
      isAllModels: Joi.boolean().required().messages(validationCustomMessage('responseFormatter.isAllModels')),
      modelId: Joi.any().when('isAllModels',
        {
          is: false,
          then: Joi.string().required().messages(validationCustomMessage('responseFormatter.modelId')),
        }),
      dataType: Joi.string().required().messages(validationCustomMessage('responseFormatter.dataType')),
      targetAttr: Joi.string().messages(validationCustomMessage('responseFormatter.targetAttr')),
      operator: Joi.string().messages(validationCustomMessage('responseFormatter.operator')),
      attribute: Joi.any().required().messages(validationCustomMessage('responseFormatter.attribute')),
      title: Joi.string().required().messages(validationCustomMessage('responseFormatter.title')),
    })).unique().messages(validationCustomMessage('responseFormatter')),
    socialPlatform: Joi.array().optional().items(Joi.object({
      credential: Joi.object({
        isGoogle: Joi.boolean().optional().messages(validationCustomMessage('socialPlatform.isGoogle')),
        isFacebook: Joi.boolean().optional().messages(validationCustomMessage('socialPlatform.isFacebook')),
        callbackUrl: Joi.string().optional().messages(validationCustomMessage('socialPlatform.callbackUrl')),
        errorUrl: Joi.string().optional().messages(validationCustomMessage('socialPlatform.errorUrl')),
      }),
      type: Joi.string().messages(validationCustomMessage('socialPlatform.type')),
      typeId: Joi.string().messages(validationCustomMessage('socialPlatform.typeId')),
      platform: Joi.array().optional().messages(validationCustomMessage('socialPlatform.platform')),
      isChecked: Joi.boolean().optional().messages(validationCustomMessage('socialPlatform.isChecked')),
    })),
  }).unknown(true);

  return validateSchema(schema, params);
};

const appConfigUpdateValidation = (params) => {
  const schema = Joi.object({
    responseFormatter: Joi.array().items(Joi.object({
      isAllModels: Joi.boolean().required().messages(validationCustomMessage('responseFormatter.isAllModels')),
      modelId: Joi.any().when('isAllModels',
        {
          is: false,
          then: Joi.string().required().messages(validationCustomMessage('responseFormatter.modelId')),
        }),
      dataType: Joi.string().required().messages(validationCustomMessage('responseFormatter.dataType')),
      targetAttr: Joi.string().messages(validationCustomMessage('responseFormatter.targetAttr')),
      operator: Joi.string().messages(validationCustomMessage('responseFormatter.operator')),
      attribute: Joi.any().required().messages(validationCustomMessage('responseFormatter.attribute')),
      title: Joi.string().required().messages(validationCustomMessage('responseFormatter.title')),
    })).unique().messages(validationCustomMessage('responseFormatter')),
    socialPlatform: Joi.array().optional().items(Joi.object({
      credential: Joi.object({
        isGoogle: Joi.boolean().optional().messages(validationCustomMessage('socialPlatform.isGoogle')),
        isFacebook: Joi.boolean().optional().messages(validationCustomMessage('socialPlatform.isFacebook')),
        callbackUrl: Joi.string().optional().messages(validationCustomMessage('socialPlatform.callbackUrl')),
        errorUrl: Joi.string().optional().messages(validationCustomMessage('socialPlatform.errorUrl')),
      }),
      type: Joi.string().messages(validationCustomMessage('socialPlatform.type')),
      typeId: Joi.string().messages(validationCustomMessage('socialPlatform.typeId')),
      platform: Joi.array().optional().messages(validationCustomMessage('socialPlatform.platform')),
      isChecked: Joi.boolean().optional().messages(validationCustomMessage('socialPlatform.isChecked')),
    })),
  }).unknown(true);

  return validateSchema(schema, params);
};

module.exports = {
  appConfigUpdateValidation,
  appConfigCreateValidation,
};
