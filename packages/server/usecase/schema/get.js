const {
  INVALID_REQUEST_PARAMS, OK, SERVER_ERROR, SCHEMA_DETAIL_NOT_FOUND,
} = require('../../constants/message').message;

const get = (schemaRepo) => async (id) => {
  try {
    if (!id) {
      return INVALID_REQUEST_PARAMS;
    }

    const filter = { find: { _id: id } };
    const schemaDetails = await schemaRepo.get(filter);
    if (!schemaDetails) {
      return SCHEMA_DETAIL_NOT_FOUND;
    }

    return {
      ...OK,
      data: schemaDetails,
    };
  } catch (err) {
    // console.log('error', err);
    return SERVER_ERROR;
  }
};

module.exports = get;
