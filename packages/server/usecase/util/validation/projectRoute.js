const Joi = require('joi');
const {
  validateSchema, validationCustomMessage,
} = require('../../../util-service/validation');

const {
  validation, VALIDATION_RULES,
} = require('../../../constants/validation');

const projectRouteCreateValidation = (params, isNodeApp) => {
  const schema = Joi.object({
    method: Joi.string()
      .min(validation.method.min)
      .max(validation.method.max)
      .trim()
      .required()
      .messages(validationCustomMessage('method')),
    route: Joi.string()
      .trim()
      .min(validation.route.min)
      .max(validation.route.max)
      .required()
      .regex(isNodeApp ? VALIDATION_RULES.ROUTE_REGEX : VALIDATION_RULES.URL_REGEX)
      .messages(validationCustomMessage('route')),
    controller: Joi.string()
      .min(validation.controller.min)
      .max(validation.controller.max)
      .trim()
      .optional()
      .regex(VALIDATION_RULES.APPLICATION_FILE_NAME_WITHOUT_DASH)
      .messages(validationCustomMessage('controller')),
    action: Joi.string()
      .trim()
      .optional()
      .regex(VALIDATION_RULES.APPLICATION_FILE_NAME_WITHOUT_DASH)
      .messages(validationCustomMessage('action')),
    /*
     * description: Joi.string()
     * .min(validation.description.min)
     * .max(validation.description.max)
     * .trim()
     * .optional()
     * .messages(validationCustomMessage('description')),
     */
    applicationId: Joi.string()
      .trim()
      .required()
      .messages(validationCustomMessage('applicationId')),
    params: Joi.array()
      .optional()
      .messages(validationCustomMessage('params')),
    request: Joi.object()
      .optional()
      .messages(validationCustomMessage('request')),
    response: Joi.object()
      .optional()
      .messages(validationCustomMessage('response')),
    queryBuilder: Joi.array()
      .optional()
      .messages(validationCustomMessage('queryBuilder')),
  }).unknown(true);

  return validateSchema(schema, params);
};

const projectRouteUpdateValidation = (params, isNodeApp) => {
  const schema = Joi.object({
    method: Joi.string()
      .min(validation.method.min)
      .max(validation.method.max)
      .trim()
      .messages(validationCustomMessage('method')),
    route: Joi.string()
      .trim()
      .min(validation.route.min)
      .max(validation.route.max)
      .regex(isNodeApp ? VALIDATION_RULES.ROUTE_REGEX : VALIDATION_RULES.URL_REGEX)
      .messages(validationCustomMessage('route')),
    controller: Joi.string()
      .min(validation.controller.min)
      .max(validation.controller.max)
      .trim()
      .optional()
      .messages(validationCustomMessage('controller')),
    action: Joi.string()
      .trim()
      .optional()
      .messages(validationCustomMessage('action')),
    /*
     * description: Joi.string()
     * .min(validation.description.min)
     * .max(validation.description.max)
     * .trim()
     * .optional()
     * .messages(validationCustomMessage('description')),
     */
    applicationId: Joi.string()
      .trim()
      .required()
      .messages(validationCustomMessage('applicationId')),
    params: Joi.array()
      .optional()
      .messages(validationCustomMessage('params')),
    request: Joi.object()
      .optional()
      .messages(validationCustomMessage('request')),
    response: Joi.object()
      .optional()
      .messages(validationCustomMessage('response')),
    queryBuilder: Joi.array()
      .optional()
      .messages(validationCustomMessage('queryBuilder')),
  }).unknown(true);

  return validateSchema(schema, params);
};

const projectRouteInsertManyValidation = (params) => {
  const schema = Joi.object({
    routes: Joi.array()
      .required()
      .messages(validationCustomMessage('routes')),
  }).unknown(true);

  return validateSchema(schema, params);
};

const projectRouteRequestApiValidation = (params) => {
  const schema = Joi.object({
    url: Joi.string()
      .required()
      .messages(validationCustomMessage('Url')),
    method: Joi.string()
      .required()
      .messages(validationCustomMessage('method')),
  }).unknown(true);

  return validateSchema(schema, params);
};

module.exports = {
  projectRouteCreateValidation,
  projectRouteInsertManyValidation,
  projectRouteUpdateValidation,
  projectRouteRequestApiValidation,
};
