/**
 * validateRequest.js
 * @description :: exports methods for validating parameters of request body using joi validation.
 */

/**
 * @description : validate request body parameter with joi.
 * @param {object} payload : body from request.
 * @param {object} schemaKeys : model wise schema keys. ex. user validation.
 * @returns : returns validation with message {isValid, message}
 */
exports.validateParamsWithJoi = (payload, schemaKeys) => {
  const { error } = schemaKeys.validate(payload, { abortEarly: false });
  if (error) {
    const message = error.details.map((el) => el.message).join('\n');
    return {
      isValid: false,
      message,
    };
  }
  return { isValid: true };
};
