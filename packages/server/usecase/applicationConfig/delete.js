const mongoose = require('mongoose');
const {
  INVALID_REQUEST_PARAMS,
  SERVER_ERROR,
} = require('../../constants/message').message;
const deleteApplicationConfigUseCase = require('./deleteDependency');

const deleteById = (applicationConfigRepo, applicationRepo) => async (
  params,
) => {
  try {
    if (!params.id) return INVALID_REQUEST_PARAMS;
    const isValidId = mongoose.Types.ObjectId.isValid(params.id);
    if (!isValidId) {
      return INVALID_REQUEST_PARAMS;
    }
    const response = await deleteApplicationConfigUseCase(
      applicationConfigRepo,
      applicationRepo,
    )(
      {
        find: {
          _id: params.id,
          isActive: { $in: [true, false] },
        },
      },
      params.isHardDelete,
    );
    return response;
  } catch (err) {
    return SERVER_ERROR;
  }
};

module.exports = deleteById;
