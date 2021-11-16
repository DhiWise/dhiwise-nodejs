const Joi = require('joi');
const {
  validateSchema, validationCustomMessage,
} = require('../../../util-service/validation');
const { validation } = require('../../../constants/validation');

const projectRoleAccessPermissionValidation = (params) => {
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
      .messages(validationCustomMessage('name')),
    /*
     * description: Joi.string()
     * .min(validation.description.min)
     * .max(validation.description.max)
     * .trim()
     * .messages(validationCustomMessage('description')),
     */
    customJson: Joi.array()
      .required()
      .messages(validationCustomMessage('customJson')),
  }).unknown(true);

  return validateSchema(schema, params);
};

module.exports = { projectRoleAccessPermissionValidation };
