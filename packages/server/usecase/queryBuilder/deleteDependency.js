/* global _ */

const {
  INVALID_REQUEST_PARAMS, OK, SERVER_ERROR,
} = require('../../constants/message').message;

const deleteMany = (queryBuilderRepo) => async (filter, isHardDelete = false) => {
  try {
    if (!filter) return INVALID_REQUEST_PARAMS;
    const response = await queryBuilderRepo.getDetails(filter);
    if (response && _.size(response) > 0) {
      if (response && response.length) {
        if (isHardDelete) {
          await queryBuilderRepo.deleteMany(filter);
        } else {
          const updateData = {
            filter,
            data: { isDeleted: true },
          };
          await queryBuilderRepo.updateMany(updateData);
        }
      }
    }
    return {
      ...OK,
      data: null,
    };
  } catch (err) {
    // console.log('error', err);
    return SERVER_ERROR;
  }
};

module.exports = deleteMany;
