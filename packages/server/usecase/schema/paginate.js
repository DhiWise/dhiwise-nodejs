const mongoose = require('mongoose');
const {
  INVALID_REQUEST_PARAMS, OK, SERVER_ERROR,
} = require('../../constants/message').message;

const paginate = (schemaRepo) => async (param) => {
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
    if (!params.find) {
      params.find = {};
    }
    params.find.applicationId = params.applicationId;

    /*
     * params = {
     *     fields: "",
     *     find: {},
     *     page: 1,
     *     limit: 1
     * }
     */
    const filter = params;
    const response = {
      list: await schemaRepo.getDetails(filter),
      count: await schemaRepo.getCount(filter),
    };

    return {
      ...OK,
      data: response,
    };
  } catch (err) {
    // console.log('error', err);
    return { ...SERVER_ERROR };
    // return { ...SERVER_ERROR, data: err.toString() };
  }
};

module.exports = paginate;
