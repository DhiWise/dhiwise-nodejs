const {
  OK, SERVER_ERROR,
} = require('../../constants/message').message;

const paginate = (projectRepo) => async (param) => {
  try {
    let params = param;
    if (!params) {
      params = {};
    }
    const filter = params;
    const response = {
      list: await projectRepo.getDetails(filter),
      count: await projectRepo.getCount(filter),
    };
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
