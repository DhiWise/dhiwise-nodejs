/* global MESSAGE, */
const {
  FAILED_TO_CREATE, OK, SERVER_ERROR,
} = require('../../constants/message').message;
const { schemaDetailCreateValidation } = require('../util/validation/schemaDetail');

/**
 * Function used for create new user.
 * @return json
 */
const useCase = (schemaDetailRepo) => async (params) => {
  try {
    const {
      value, error,
    } = schemaDetailCreateValidation(params);
    if (error) {
      return {
        data: null,
        code: MESSAGE.BAD_REQUEST.code,
        message: error,
      };
    }
    params = value;
    const created = await schemaDetailRepo.create(params);

    if (!created) {
      return FAILED_TO_CREATE;
    }
    return {
      ...OK,
      data: created,
    };
  } catch (err) {
    // console.log('error', err);
    return { ...SERVER_ERROR };
    // return { ...SERVER_ERROR, data: err.toString() };
  }
};

module.exports = useCase;
