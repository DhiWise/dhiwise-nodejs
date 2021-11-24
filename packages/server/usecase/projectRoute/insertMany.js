/* global MESSAGE, */
const {
  INVALID_REQUEST_PARAMS, OK, SERVER_ERROR,
} = require('../../constants/message').message;
const { projectRouteInsertManyValidation } = require('../util/validation/projectRoute');

/**
 * Function used for create new user.
 * @return json
 */
const useCase = (projectRouteRepo) => async (params) => {
  try {
    const {
      value, error,
    } = projectRouteInsertManyValidation(params);
    if (error) {
      return {
        data: null,
        code: MESSAGE.BAD_REQUEST.code,
        message: error,
      };
    }
    params = value;
    const created = await projectRouteRepo.insertMany(params.routes);

    if (!created) {
      return INVALID_REQUEST_PARAMS;
    }
    return {
      ...OK,
      data: created,
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    // console.log('error', err);
    return SERVER_ERROR;
  }
};

module.exports = useCase;
