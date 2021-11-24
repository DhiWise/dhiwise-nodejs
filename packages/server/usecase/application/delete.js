const mongoose = require('mongoose');
const deleteUseCase = require('./deleteDependency');
const {
  INVALID_REQUEST_PARAMS, SERVER_ERROR,
} = require('../../constants/message').message;

const deleteById = (applicationRepo) => async (params) => {
  try {
    if (!params.id) return INVALID_REQUEST_PARAMS;
    const isValidId = mongoose.Types.ObjectId.isValid(params.id);
    if (!isValidId) {
      return INVALID_REQUEST_PARAMS;
    }
    const response = await (deleteUseCase(applicationRepo))({ find: { _id: params.id } }, params.isHardDelete);
    return response;
  } catch (err) {
    // console.log('error', err);
    return SERVER_ERROR;
  }
};

module.exports = deleteById;
