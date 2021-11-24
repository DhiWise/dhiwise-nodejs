const {
  DATA_TYPES_SUGGESTIONS, SERVER_ERROR,
} = require('../../constants/message').message;

/**
 *
 * Function used for update user.
 * @return json
 */
const dataTypeSuggestions = (dataTypeSuggestionsRepo) => async () => {
  try {
    const dataTypes = await dataTypeSuggestionsRepo.get({});
    return {
      ...DATA_TYPES_SUGGESTIONS,
      data: dataTypes,
    };
  } catch (err) {
    // console.log('error', err);
    return SERVER_ERROR;
  }
};

module.exports = dataTypeSuggestions;
