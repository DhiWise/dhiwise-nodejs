/* global MESSAGE, */
const { message } = require('../../constants/message');
const { masterCodeValidation } = require('../util/validation/masterValidation');

const paginate = (masterRepo) => async (params) => {
  try {
    const {
      value, error,
    } = masterCodeValidation(params);
    if (error) {
      return {
        data: null,
        code: MESSAGE.BAD_REQUEST.code,
        message: error,
      };
    }
    params = value;

    const filter = { find: params };

    const response = {
      list: await masterRepo.getDetails(filter),
      count: await masterRepo.getCount(filter),
    };

    return {
      ...message.OK,
      data: response,
    };
  } catch (err) {
    // console.log('error', err);
    return {
      data: err,
      code: message.SERVER_ERROR.code,
    };
  }
};
module.exports = paginate;
