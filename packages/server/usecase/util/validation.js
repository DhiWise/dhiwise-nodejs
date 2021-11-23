const validationCustomMessage = (label) => {
  const lowerLabel = label?.toLowerCase();
  return {
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
    'array.base': `${label} must be a array.`,
  };
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

module.exports = {
  validationCustomMessage,
  validateSchema,
};
