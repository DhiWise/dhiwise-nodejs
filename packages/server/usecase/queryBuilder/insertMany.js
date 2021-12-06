/* global  _ */
const {
  INVALID_REQUEST_PARAMS, OK, SERVER_ERROR,
} = require('../../constants/message').message;

/**
 * Function used for create new user.
 * @return json
 */
const useCase = (queryBuilderRepo) => async (params) => {
  try {
    params = _.cloneDeep(_.map(params, (val) => val));
    const created = await queryBuilderRepo.insertMany(params);

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
