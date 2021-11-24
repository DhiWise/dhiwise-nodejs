const mongoose = require('mongoose');

const {
  INVALID_REQUEST_PARAMS, SCHEMA_NOT_FOUND, OK, SERVER_ERROR,
} = require('../../constants/message').message;

/**
 *
 * Function used for update user.
 * @return json
 */
const update = (schemaDetailRepo) => async (id, params) => {
  try {
    // Validate Unique Criteria
    const filter = { _id: id };
    if (id) {
      const isValidId = mongoose.Types.ObjectId.isValid(id);
      if (!isValidId) {
        return INVALID_REQUEST_PARAMS;
      }
    }
    const schema = await schemaDetailRepo.get({ filter });

    if (!schema) {
      return SCHEMA_NOT_FOUND;
    }

    const updateResponse = await schemaDetailRepo.update(id, params);
    return {
      ...OK,
      data: updateResponse,
    };
  } catch (err) {
    // console.log('error', err);
    return { ...SERVER_ERROR };
    // return { ...SERVER_ERROR, data: err.toString() };
  }
};

module.exports = update;
