const {
  APPLICATION_NOT_FOUND, OK, SERVER_ERROR,
} = require('../../constants/message').message;

/**
 *
 * Function used for get user.
 * @return json
 */
const get = (applicationRepo) => async () => {
  try {
    const filter = { _id: -1 };
    const application = await applicationRepo.getAll(filter);

    if (!application.length) {
      return APPLICATION_NOT_FOUND;
    }

    return {
      ...OK,
      data: application[0],
    };
  } catch (err) {
    return SERVER_ERROR;
  }
};

module.exports = get;
