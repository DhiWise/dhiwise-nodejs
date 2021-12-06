const joi = require('joi');

exports.validateParamsWithJoi = (body, schemaKeys) => {
  const schema = joi.object(schemaKeys);

  const { error } = schema.validate(body, { abortEarly: false });

  if (error && error.details) {
    const message = error.details.map((el) => el.message).join('\n');
    return {
      isValid: false,
      message,
    };
  }
  return { isValid: true };
};
