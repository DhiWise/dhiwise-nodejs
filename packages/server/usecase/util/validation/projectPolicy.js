const Joi = require('joi');
const {
  validateSchema, validationCustomMessage,
} = require('../../../util-service/validation');

const {
  validation, VALIDATION_RULES,
} = require('../../../constants/validation');

const projectPolicyCreateValidation = (params) => {
  const schema = Joi.object({
    applicationId: Joi.string()
      .trim()
      .required()
      .messages(validationCustomMessage('Application Id')),
    fileName: Joi.string()
      .trim()
      .min(validation.fileName.min)
      .max(validation.fileName.max)
      .required()
      .regex(VALIDATION_RULES.APPLICATION_FILE_NAME)
      .messages(validationCustomMessage('File Name')),
    customJson: Joi
      .optional()
      .messages(validationCustomMessage('Custom Json')),
    /*
     * description: Joi.string()
     * .min(validation.description.min)
     * .max(validation.description.max)
     * .trim()
     * .required()
     * .messages(validationCustomMessage('Description')),
     */
  }).unknown(true);

  return validateSchema(schema, params);
};

const projectPolicyUpdateValidation = (params) => {
  const schema = Joi.object({
    applicationId: Joi.string()
      .trim()
      .required()
      .messages(validationCustomMessage('Application Id')),
    fileName: Joi.string()
      .trim()
      .min(validation.fileName.min)
      .max(validation.fileName.max)
      .required()
      .regex(VALIDATION_RULES.APPLICATION_FILE_NAME)
      .messages(validationCustomMessage('File Name')),
    customJson: Joi
      .required()
      .messages(validationCustomMessage('Custom Json')),
    /*
     * description: Joi.string()
     * .min(validation.description.min)
     * .max(validation.description.max)
     * .trim()
     * .required()
     * .messages(validationCustomMessage('Description')),
     */
  }).unknown(true);

  return validateSchema(schema, params);
};

module.exports = {
  projectPolicyCreateValidation,
  projectPolicyUpdateValidation,
};
