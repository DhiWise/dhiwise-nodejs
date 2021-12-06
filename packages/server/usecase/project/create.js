/* global MESSAGE, _ */
const {
  PROJECT_FAILED_CREATE, SERVER_ERROR, NEW_PROJECT_CREATED,
} = require('../../constants/message').message;
const { projectCreationValidation } = require('../util/validation/projectCreate');

/**
 * Function used for create new user.
 * @return json
 */
const useCase = (projectRepo) => async (params) => {
  try {
    // Validate Request
    const actualName = params.name;
    if (params.name) {
      let nameTemp = params.name;
      nameTemp = nameTemp.replace(/-/g, '');
      nameTemp = nameTemp.replace(/_/g, '');
      params.name = nameTemp;
      const {
        value, error,
      } = projectCreationValidation(params);
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
    /*
     * const existingValidation = await projectRepo.get({ find: { name: params.name } });
     * if (existingValidation) {
     *   return { ...BAD_REQUEST, message: 'Project exists with same name.' };
     * }
     */

    const created = await projectRepo.create(params);

    if (!created) {
      return PROJECT_FAILED_CREATE;
    }

    return {
      ...NEW_PROJECT_CREATED,
      data: _.pick(created, ['_id']),
    };
  } catch (err) {
    // console.log('error', err);
    return SERVER_ERROR;
  }
};

module.exports = useCase;
