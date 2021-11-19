/* global MESSAGE, */
const mongoose = require('mongoose');

const {
  INVALID_REQUEST_PARAMS, PROJECT_NOT_FOUND,
} = require('../../constants/message').message;

/**
 *
 * Function used for get user.
 * @return json
 */
const get = (projectRepo) => async (id) => {
  try {
    if (!id) {
      return INVALID_REQUEST_PARAMS;
    }
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidId) {
      return INVALID_REQUEST_PARAMS;
    }

    // Validate Unique Criteria
    const filter = {
      filter: { find: { _id: id } },
      fields: ['name', 'description', 'isArchive'],
    };
    const project = await projectRepo.get(filter);

    if (!project) {
      return PROJECT_NOT_FOUND;
    }

    return {
      ...MESSAGE.OK,
      data: project,
    };
  } catch (err) {
    return MESSAGE.SERVER_ERROR;
  }
};

module.exports = get;
