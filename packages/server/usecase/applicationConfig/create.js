/* global _ */
const { appConfigCreateValidation } = require('../util/validation/applicationConfig');
const {
  INVALID_REQUEST_PARAMS, SERVER_ERROR, APPLICATION_CONFIG_CREATED, BAD_REQUEST,
} = require('../../constants/message').message;

/**
 * Function used for create application config.
 * @return json
 */
const useCase = (applicationConfigRepo) => async (params) => {
  try {
    const {
      value, error,
    } = appConfigCreateValidation(params);
    if (error) {
      return {
        ...BAD_REQUEST,
        message: error,
      };
    }
    params = _.cloneDeep(value);

    const created = await applicationConfigRepo.create(params);

    if (!created) {
      return INVALID_REQUEST_PARAMS;
    }
    return {
      ...APPLICATION_CONFIG_CREATED,
      data: created,
    };
  } catch (err) {
    // console.log(err);
    return SERVER_ERROR;
  }
};

module.exports = useCase;
