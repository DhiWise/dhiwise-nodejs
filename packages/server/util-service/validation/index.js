const { ObjectID } = require('mongodb').ObjectID;

const validationCustomMessage = (label, customMessage) => {
  const lowerLabel = label?.toLowerCase();
  let rulesMessage = {
    'any.required': `Please enter ${lowerLabel}.`,
    'string.empty': `Please enter ${lowerLabel}.`,
    'string.alphanum': `Please enter only characters in ${lowerLabel}`,
    'string.min': `${label} should have a minimum length of {#limit}`,
    'string.max': `${label} should have a maximum length of {#limit}`,
    'string.base': `${label} must be a string.`,
    'string.email': `Please enter valid ${lowerLabel}.`,
    'string.pattern.base': `Please enter valid ${lowerLabel}.`,
    'object.unknown': `${label} is not allowed.`,
    'any.only': `Please enter valid ${lowerLabel}.`,
    'number.base': `${label} must be a number.`,
    'object.base': `${label} must be a object.`,
    'boolean.base': `${label} must be a boolean.`,
    'array.unique': `${label} contains a duplicate value.`,
  };

  if (customMessage && typeof customMessage === 'object') {
    rulesMessage = {
      ...rulesMessage,
      ...customMessage,
    };
  }
  return rulesMessage;
};

const validationErrorMessage = (error) => {
  const [first] = error?.details?.map((i) => i?.message);
  return first;
};

const validateSchema = (schema, params) => {
  let { error } = schema.validate(params);
  const { value } = schema.validate(params);
  if (error) {
    error = validationErrorMessage(error);
  }
  return {
    value,
    error,
  };
};

const validateMongoId = (label) => (value, helpers) => {
  if (ObjectID.isValid(value)) {
    return value;
  }
  const lowerLabel = label?.toLowerCase();
  return helpers.message({ custom: `Enter valid value for ${lowerLabel}` });
};

module.exports = {
  validationCustomMessage,
  validateSchema,
  validateMongoId,
};
