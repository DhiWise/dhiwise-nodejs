const Joi = require('joi');
const {
  validateSchema, validationCustomMessage,
} = require('../../../util-service/validation');

const {
  validation, VALIDATION_RULES,
} = require('../../../constants/validation');

const projectConstantValidation = (params) => {
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
      .regex(VALIDATION_RULES.CONSTANT_FILE_NAME)
      .messages(validationCustomMessage('File Name')),
    /*
     * description: Joi.string()
     * .min(validation.description.min)
     * .max(validation.description.max)
     * .trim()
     * .required()
     * .messages(validationCustomMessage('Description')),
     */
    /*
     * customJson: Joi
     *   .object()
     *   .messages(validationCustomMessage('Custom Json')),
     */
  }).unknown(true);

  return validateSchema(schema, params);
};

module.exports = { projectConstantValidation };
