/* global _ */

const {
  INVALID_REQUEST_PARAMS, OK, SERVER_ERROR,
} = require('../../constants/message').message;

const deleteMany = (nestedQueryBuilderRepo) => async (filter, isHardDelete = false) => {
  try {
    if (!filter) return INVALID_REQUEST_PARAMS;
    const response = await nestedQueryBuilderRepo.getDetails(filter);
    if (response && _.size(response) > 0) {
      if (response && response.length) {
        if (isHardDelete) {
          await nestedQueryBuilderRepo.deleteMany(filter);
        } else {
          const updateData = {
            filter,
            data: { isDeleted: true },
          };
          await nestedQueryBuilderRepo.updateMany(updateData);
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
