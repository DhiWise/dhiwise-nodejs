const mongoose = require('mongoose');
const {
  INVALID_REQUEST_PARAMS, SERVER_ERROR,
} = require('../../constants/message').message;

const deleteSchemaDetailUseCase = require('./deleteDependency');

const deleteById = (schemaDetailRepo) => async (params) => {
  try {
    if (!params.id) return INVALID_REQUEST_PARAMS;
    const isValidId = mongoose.Types.ObjectId.isValid(params.id);
    if (!isValidId) {
      return INVALID_REQUEST_PARAMS;
    }
    const response = await (deleteSchemaDetailUseCase(schemaDetailRepo))({ find: { _id: params.id } }, params.isHardDelete);
    return response;
  } catch (err) {
    // console.log('error', err);
    return { ...SERVER_ERROR };
    // return { ...SERVER_ERROR, data: err.toString() };
  }
};

module.exports = deleteById;
