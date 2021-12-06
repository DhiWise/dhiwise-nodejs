const {
  INVALID_REQUEST_PARAMS, OK, SERVER_ERROR,
} = require('../../constants/message').message;
// {  find: { schemaId: params.id } }
const deleteMany = (generatorRepo) => async (filter, isHardDelete = false) => {
  try {
    if (!filter) return INVALID_REQUEST_PARAMS;
    const response = await generatorRepo.getDetails(filter);
    if (response && response.length) {
      if (isHardDelete) {
        await generatorRepo.deleteMany(filter);
      } else {
        const updateData = {
          filter,
          data: { isDeleted: true },
        };
        await generatorRepo.updateMany(updateData);
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
