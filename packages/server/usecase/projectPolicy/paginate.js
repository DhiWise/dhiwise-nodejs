const mongoose = require('mongoose');
const {
  INVALID_REQUEST_PARAMS, OK, SERVER_ERROR,
} = require('../../constants/message').message;

const paginate = (projectPolicyRepo) => async (param) => {
  try {
    let params = param;
    if (!params) {
      params = {};
    }

    if (!params.applicationId) {
      return INVALID_REQUEST_PARAMS;
    }
    if (params.applicationId) {
      const isValidId = mongoose.Types.ObjectId.isValid(params.applicationId);
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
    if (!params.find) {
      params.find = {};
    }
    params.find.applicationId = params.applicationId;
    const filter = params;
    const list = await projectPolicyRepo.getDetails(filter);
    const response = {
      list,
      count: await projectPolicyRepo.getCount(filter),
    };
    return {
      ...OK,
      data: response,
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    // console.log('error', err);
    return SERVER_ERROR;
  }
};
module.exports = paginate;
