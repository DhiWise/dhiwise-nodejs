/* global MESSAGE,_ */
const mongoose = require('mongoose');
// const validate = require('validate.js');
const dayjs = require('dayjs');
const {
  INVALID_REQUEST_PARAMS, PROJECT_NOT_FOUND, SERVER_ERROR, PROJECT_UPDATED,
} = require('../../constants/message').message;
const { projectUpdateValidation } = require('../util/validation/projectUpdate');

// Validation

/**
 *
 * Function used for update user.
 * @return json
 */
const update = (projectRepo) => async (id, params) => {
  try {
    /*
     * Validate Request
     * const errors = await validateData(params);
     */
    const actualName = params.name;
    if (params.name) {
      let nameTemp = params.name;
      nameTemp = nameTemp.replace(/-/g, '');
      nameTemp = nameTemp.replace(/_/g, '');
      params.name = nameTemp;
      const {
        value, error,
      } = projectUpdateValidation(params);
      if (error) {
        return {
          data: null,
          code: MESSAGE.BAD_REQUEST.code,
          message: error,
        };
      }
      params = value;
    }
    params.name = actualName;

    if (!id) {
      return INVALID_REQUEST_PARAMS;
    }
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidId) {
      return INVALID_REQUEST_PARAMS;
    }
    // Validate Unique Criteria
    const filter = { _id: id };
    const project = await projectRepo.get({ filter });

    if (!project) {
      return PROJECT_NOT_FOUND;
    }

    params.selfUpdatedAt = dayjs().toISOString();
    const updateResponse = await projectRepo.update(id, _.pick(params, ['name', 'description']));
    return {
      ...PROJECT_UPDATED,
      data: _.pick(updateResponse, ['name', 'description']),
    };
  } catch (err) {
    // console.log('error', err);
    return SERVER_ERROR;
  }
};

module.exports = update;
