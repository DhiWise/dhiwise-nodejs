const joi = require('joi');

exports.validateParamsWithJoi = (body, schemaKeys) => {
  const schema = joi.object(schemaKeys);

  try {
    const {
      error, value,
    } = schema.validate(body, { abortEarly: false });

    if (error && error.details) {
      const data = {
        error: true,
        details: error.details,
      };
      return data;
    }
    return value;
  } catch (err) {
    const data = {
      error: true,
      details: err,
    };
    return data;
  }
};
