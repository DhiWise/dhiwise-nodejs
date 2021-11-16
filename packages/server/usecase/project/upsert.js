/* global MESSAGE */
const mongoose = require('mongoose');
const dayjs = require('dayjs');
const {
  SERVER_ERROR, PROJECT_NOT_FOUND, INVALID_REQUEST_PARAMS,
  PROJECT_IS_ARCHIVED, PROJECT_IS_UNARCHIVED,
} = require('../../constants/message').message;
const { projectUpsertValidation } = require('../util/validation/projectUpsert');

/**
 *
 * Function used for update project-config.
 * @return json
 */
const archiveProject = (projectRepo, applicationRepo) => async (id, params) => {
  try {
    if (params.isOver) { params.isPublicConsent = params.isOver; }
    // const errors = await validateData(params);

    /*
     * if (errors) {
     *   return { ...INVALID_REQUEST_PARAMS, data: errors };
     * }
     */
    const {
      value, error,
    } = projectUpsertValidation(params);
    if (error) {
      return {
        data: null,
        code: MESSAGE.BAD_REQUEST.code,
        message: error,
      };
    }
    params = value;

    // Validate Unique Criteria
    const filter = { find: { _id: id } };
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidId) {
      return INVALID_REQUEST_PARAMS;
    }
    const projectData = await projectRepo.get(filter);

    if (!projectData) {
      return PROJECT_NOT_FOUND;
    }

    params.selfUpdatedAt = dayjs().toISOString();
    const updateResponse = await projectRepo.update(id, params);
    const updateData = {
      filter: { find: { projectId: updateResponse._id } },
      data: {
        isArchive: params.isArchive,
        isPublicConsent: params.isPublicConsent,
      },
    };

    await applicationRepo.updateMany(updateData);

    if (params.isArchive) {
      return {
        ...PROJECT_IS_ARCHIVED,
        data: updateResponse,
      };
    }

    return {
      ...PROJECT_IS_UNARCHIVED,
      data: updateResponse,
    };
  } catch (err) {
    return SERVER_ERROR;
  }
};

module.exports = archiveProject;
