const Joi = require('joi');
const {
  validateSchema, validationCustomMessage,
} = require('../validation');

const accessPermissionCreateValidation = (params) => {
  const schema = Joi.object({
    permissionJson: Joi.array()
      .required()
      .messages(validationCustomMessage('Permission Json')),
  }).unknown(true);

  return validateSchema(schema, params);
};

module.exports = { accessPermissionCreateValidation };
