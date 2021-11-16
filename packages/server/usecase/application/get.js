const mongoose = require('mongoose');

const {
  INVALID_REQUEST_PARAMS, APPLICATION_NOT_FOUND, OK, SERVER_ERROR,
} = require('../../constants/message').message;

/**
 *
 * Function used for get user.
 * @return json
 */
const get = (applicationRepo) => async (id) => {
  try {
    if (!id) {
      return INVALID_REQUEST_PARAMS;
    }
    // Validate Unique Criteria
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidId) {
      return APPLICATION_NOT_FOUND;
    }
    const filter = {
      filter: { find: { _id: id } },
      fields: ['name', 'description', 'image', 'stepInput.packageName', 'stepInput.bundleId'],
    };
    const application = await applicationRepo.get(filter);

    if (!application) {
      return APPLICATION_NOT_FOUND;
    }

    return {
      ...OK,
      data: application,
    };
  } catch (err) {
    return SERVER_ERROR;
  }
};

module.exports = get;
