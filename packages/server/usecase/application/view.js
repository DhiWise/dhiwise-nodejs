const mongoose = require('mongoose');
const {
  INVALID_REQUEST_PARAMS, OK, SERVER_ERROR,
} = require('../../constants/message').message;

const paginate = (applicationRepo, projectRepo) => async (params) => {
  try {
    if (!params.id) {
      return INVALID_REQUEST_PARAMS;
    }
    if (params.id) {
      const isValidId = mongoose.Types.ObjectId.isValid(params.id);
      if (!isValidId) {
        return INVALID_REQUEST_PARAMS;
      }
    }
    /*
     * params = {
     *     fields: "",
     *     find: {},
     *     page: 1,
     *     limit: 1
     * }
     */

    const filter = params;
    const response = {};
    response.application = await applicationRepo.getById(filter);
    if (response.application) {
      response.project = await projectRepo.getById({ id: response.application.projectId });
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
module.exports = paginate;
