const mongoose = require('mongoose');

const {
  INVALID_REQUEST_PARAMS, SERVER_ERROR, APPLICATION_CONFIG_NOT_FOUND, OK,
} = require('../../constants/message').message;
/**
 *
 * Function used for get user.
 * @return json
 */
const get = (applicationConfigRepo) => async (id) => {
  try {
    if (!id) {
      return INVALID_REQUEST_PARAMS;
    }
    if (id) {
      const isValidId = mongoose.Types.ObjectId.isValid(id);
      if (!isValidId) {
        return INVALID_REQUEST_PARAMS;
      }
    }
    // Validate Unique Criteria
    const filter = { filter: { find: { _id: id } } };
    const applicationConfig = await applicationConfigRepo.get(filter);

    if (!applicationConfig) {
      return APPLICATION_CONFIG_NOT_FOUND;
    }
    return {
      ...OK,
      data: applicationConfig,
    };
  } catch (err) {
    return SERVER_ERROR;
  }
};

module.exports = get;
