function makeValidator (schema) {
  return function validator (payload) {
    const { error } = schema.validate(payload, { abortEarly: false });
    if (error) {
      const message = error.details.map((el) => el.message).join('\n');
      return { error: message };
    }
    return { error: false };
  };
}

module.exports = makeValidator;
