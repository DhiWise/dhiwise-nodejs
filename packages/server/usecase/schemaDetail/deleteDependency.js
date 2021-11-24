const {
  INVALID_REQUEST_PARAMS, OK, SERVER_ERROR,
} = require('../../constants/message').message;

// {  find: { schemaId: params.id } }
const deleteMany = (schemaDetailRepo) => async (filter, isHardDelete = false) => {
  try {
    if (!filter) return INVALID_REQUEST_PARAMS;
    const response = await schemaDetailRepo.getDetails(filter);
    if (response && response.length) {
      if (isHardDelete) {
        await schemaDetailRepo.deleteMany(filter);
      } else {
        const updateData = {
          filter,
          data: { isDeleted: true },
        };
        await schemaDetailRepo.updateMany(updateData);
      }
    }
    return {
      ...OK,
      data: response,
    };
  } catch (err) {
    // console.log('error', err);
    return SERVER_ERROR;
  }
};

module.exports = deleteMany;
