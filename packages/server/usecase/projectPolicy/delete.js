const mongoose = require('mongoose');
const deletePolicyUseCase = require('./deleteDependency');
const {
  INVALID_REQUEST_PARAMS, SERVER_ERROR,
} = require('../../constants/message').message;

const deleteById = (projectPolicyRepo, applicationRepo) => async (params) => {
  try {
    if (!params.id) return INVALID_REQUEST_PARAMS;
    const isValidId = mongoose.Types.ObjectId.isValid(params.id);
    if (!isValidId) {
      return INVALID_REQUEST_PARAMS;
    }
    const response = await (deletePolicyUseCase(projectPolicyRepo, applicationRepo))({
      find: {
        _id: params.id,
        isActive: { $in: [true, false] },
      },
    }, params.isHardDelete);
    return response;
  } catch (err) {
    // console.log('error', err);
    return SERVER_ERROR;
  }
};

module.exports = deleteById;
