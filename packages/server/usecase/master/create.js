/* global MESSAGE,_ */
const { message } = require('../../constants/message');
const { masterCreateValidation } = require('../util/validation/masterValidation');

/**
 * Function used for create new user.
 * @return json
 */
const useCase = (masterRepo) => async (params) => {
  try {
    const {
      value, error,
    } = masterCreateValidation(params);
    if (error) {
      return {
        data: null,
        code: MESSAGE.BAD_REQUEST.code,
        message: error,
      };
    }
    params = value;
    const existsFilter = {
      code: params.code,
      isActive: [true, false],
    };
    if (params && params.parentCode) {
      existsFilter.parentCode = params.parentCode;
    }

    const filter = { find: existsFilter };
    const alreadyExists = await masterRepo.getDetails(filter);
    if (alreadyExists && _.size(alreadyExists) > 0) {
      return {
        code: message.ALREADY_EXISTS.code,
        message: message.ALREADY_EXISTS.message,
      };
    }

    const created = await masterRepo.create(params);

    if (!created) {
      return message.SERVER_ERROR;
    }
    return {
      data: created,
      code: message.OK.code,
    };
  } catch (err) {
    // console.log(err);
    return {
      data: err,
      code: message.SERVER_ERROR.code,
    };
  }
};

module.exports = useCase;
