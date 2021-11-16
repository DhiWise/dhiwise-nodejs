export const validationMsg = {
  required: (alias) => `${alias} is required.`,
  select: (alias) => `Please select ${alias}.`,
  minLength: (alias) => `Minimum limit is ${alias} characters`,
  maxLength: (alias) => `Maximum limit is ${alias} characters`,
  min: (alias) => `Minimum limit is ${alias}`,
  max: (alias) => `Maximum limit is ${alias}`,
  pattern: (alias) => `${alias}`,
  validate: (alias) => `${alias}`,
};

export const getError = (errors = {}, keyName, alias) => (errors[keyName] ? validationMsg[errors[keyName].type](alias) : '');
