const Joi = require('joi');
const {
  validateSchema, validationCustomMessage,
} = require('../validation');

const apiIntegrationValidation = (params) => {
  const schema = Joi.object({
    applicationId: Joi.string()
      .trim()
      .required()
      .messages(validationCustomMessage('Application Id')),
    screenId: Joi.string()
      .trim()
      .required()
      .messages(validationCustomMessage('screen Id')),
    routeId: Joi.string()
      .trim()
      .required()
      .messages(validationCustomMessage('route Id')),
    apis: Joi.object({
      requestBinding: Joi.object({
        body: Joi.array().items(Joi.object({
          type: Joi.string().trim().required().messages(validationCustomMessage('requestBinding-body-type')),
          viewId: Joi.string().trim().allow('').messages(validationCustomMessage('requestBinding-body-viewId')),
          apiKey: Joi.array().required().messages(validationCustomMessage('requestBinding-body-apiKey')),
          rectCords: Joi.object().optional().messages(validationCustomMessage('requestBinding-body-rectCords')),
        }).unknown(true)),
        params: Joi.array().items(Joi.object({
          type: Joi.string().trim().required().messages(validationCustomMessage('requestBinding-params-type')),
          viewId: Joi.string().trim().allow('').messages(validationCustomMessage('requestBinding-params-viewId')),
          apiKey: Joi.array().required().messages(validationCustomMessage('requestBinding-params-apiKey')),
          rectCords: Joi.object().optional().messages(validationCustomMessage('requestBinding-params-rectCords')),
        }).unknown(true)),
      })
        .unknown(true)
        .required()
        .messages(validationCustomMessage('requestBinding')),
      responseBinding: Joi.array().items(Joi.object({
        type: Joi.string().trim().required().messages(validationCustomMessage('type')),
        // viewId: Joi.string().trim().messages(validationCustomMessage('viewId')),
        apiKey: Joi.array().required().messages(validationCustomMessage('apiKey')),
        // rectCords: Joi.object().required().messages(validationCustomMessage('rectCords')),
      }).unknown(true))
        .required()
        .messages(validationCustomMessage('responseBinding')),
    })
      .required()
      .messages(validationCustomMessage('apis')),
  }).unknown(true);

  return validateSchema(schema, params);
};

module.exports = { apiIntegrationValidation };
