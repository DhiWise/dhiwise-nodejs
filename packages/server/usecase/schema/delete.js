const mongoose = require('mongoose');
const deleteSchemaUseCase = require('./deleteDependency');

const {
  INVALID_REQUEST_PARAMS, SERVER_ERROR,
} = require('../../constants/message').message;

const deleteById = (schemaRepo, applicationRepo) => async (params) => {
  try {
    if (!params.id) return INVALID_REQUEST_PARAMS;
    const isValidId = mongoose.Types.ObjectId.isValid(params.id);
    if (!isValidId) {
      return INVALID_REQUEST_PARAMS;
    }
    const response = await (deleteSchemaUseCase(schemaRepo, applicationRepo))(params);
    return response;
  } catch (err) {
    return { ...SERVER_ERROR };
    // return { ...SERVER_ERROR, data: err.toString() };
  }
};

module.exports = deleteById;
