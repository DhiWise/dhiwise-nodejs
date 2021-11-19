/* global _ */
const {
  OK, INVALID_REGEXP,
} = require('../../../constants/message').message;
const isRegExp = require('./isRegExp');

/**
 * Function used to validate regExp;
 * @param  {} key
 * @param  {} pattern
 */
async function isValidRegExp (key, pattern) {
  try {
    const match = isRegExp(pattern);
    if (!match) {
      return {
        flag: false,
        msg: `${key} - Invalid regular expression - ${pattern}`,
      };
    }
    return { flag: true };
  } catch (err) {
    return {
      flag: false,
      msg: `${key} - Invalid regular expression - ${pattern}`,
    };
  }
}

const validateRegEx = async (schemaJson) => {
  const error = [];

  const keys = _.keys(schemaJson);
  for (let i = 0; i < keys.length; i += 1) {
    const field = schemaJson[keys[i]];
    if (typeof field === 'object' && field?.match) {
      // eslint-disable-next-line no-await-in-loop
      const validate = await isValidRegExp(keys[i], field.match);
      if (!validate.flag) {
        error.push(validate.msg);
      }
    }

    // JSON type attribute.
    if (_.isObject(field) && !_.isArray(field)) {
      const jsonTypeKeys = _.keys(field);
      for (let jKey = 0; jKey < jsonTypeKeys.length; jKey += 1) {
        const jsonField = field[jsonTypeKeys[jKey]];
        if (typeof jsonField === 'object' && jsonField?.match) {
          // eslint-disable-next-line no-await-in-loop
          const validate = await isValidRegExp(`${keys[i]}.${jsonTypeKeys[jKey]}`, jsonField.match);
          if (!validate.flag) {
            error.push(validate.msg);
          }
        }
      }
    }

    // ARRAY type attribute.
    if (_.isObject(field) && _.isArray(field)) {
      if (field[0]) {
        const jsonTypeKeys = _.keys(field[0]);
        for (let jKey = 0; jKey < jsonTypeKeys.length; jKey += 1) {
          const jsonField = field[0][jsonTypeKeys[jKey]];
          if (typeof jsonField === 'object' && jsonField?.match) {
          // eslint-disable-next-line no-await-in-loop
            const validate = await isValidRegExp(`${keys[i]}.${jsonTypeKeys[jKey]}`, jsonField.match);
            if (!validate.flag) {
              error.push(validate.msg);
            }
          }
        }
      }
    }
  }

  if (error && error.length > 0) {
    return {
      ...INVALID_REGEXP,
      data: error,
    };
  }

  return OK;
};

module.exports = validateRegEx;
