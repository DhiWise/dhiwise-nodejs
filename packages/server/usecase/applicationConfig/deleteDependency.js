const {
  INVALID_REQUEST_PARAMS, SERVER_ERROR, OK,
} = require('../../constants/message').message;

const deleteMany = (applicationConfigRepo) => async (filter, isHardDelete = false) => {
  try {
    if (!filter) return INVALID_REQUEST_PARAMS;
    const response = await applicationConfigRepo.getDetails(filter);
    if (response && response.length) {
      if (isHardDelete) {
        await applicationConfigRepo.deleteMany(filter);
      } else {
        const updateData = {
          filter,
          data: { isDeleted: true },
        };
        await applicationConfigRepo.updateMany(updateData);
      }
    }
    return {
      ...OK,
      data: response,
    };
  } catch (err) {
    return SERVER_ERROR;
  }
};

module.exports = deleteMany;
