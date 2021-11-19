/* global MESSAGE */
// const validate = require('validate.js');
const mongoose = require('mongoose');
const {
  SERVER_ERROR, APPLICATION_NOT_FOUND, INVALID_REQUEST_PARAMS, APPLICATION_IS_ARCHIVED, APPLICATION_IS_UNARCHIVED,
} = require('../../constants/message').message;
const projectApplicationUpdate = require('../common/projectApplicationUpdate');
const { applicationUpsertValidation } = require('../util/validation/applicationUpsert');

/**
 *
 * Function used for update application-config.
 * @return json
 */
const upsert = (applicationRepo, projectRepo) => async ({
  id,
  params,
}) => {
  try {
    const {
      value, error,
    } = applicationUpsertValidation(params);
    if (error) {
      return {
        data: null,
        code: MESSAGE.BAD_REQUEST.code,
        message: error,
      };
    }
    params = value;

    if (id) {
      const isValidId = mongoose.Types.ObjectId.isValid(id);
      if (!isValidId) {
        return INVALID_REQUEST_PARAMS;
      }
    }
    const filter = { find: { _id: id } };
    const applicationData = await applicationRepo.get(filter);
    if (!applicationData) {
      return APPLICATION_NOT_FOUND;
    }
    if (!params.isArchive) {
      // Updated project isArchive to false
      await projectRepo.update(applicationData.projectId, { isArchive: false });
    }
    await applicationRepo.update(id, params);

    if (params.isArchive) {
      projectApplicationUpdate({ params: { projectId: applicationData?.projectId } });
      return APPLICATION_IS_ARCHIVED;
    }
    return APPLICATION_IS_UNARCHIVED;
  } catch (err) {
    return SERVER_ERROR;
  }
};

module.exports = upsert;
