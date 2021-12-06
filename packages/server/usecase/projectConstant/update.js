/* global MESSAGE, */
const mongoose = require('mongoose');
const {
  RECORD_WITH_SAME_NAME_EXISTS, PROJECT_NOT_FOUND, SERVER_ERROR, CONSTANT_UPDATED, INVALID_REQUEST_PARAMS,
} = require('../../constants/message').message;
const { projectConstantValidation } = require('../util/validation/projectConstant');
const { getApplicationDetail } = require('../util/getApplicationData');
const projectApplicationUpdate = require('../common/projectApplicationUpdate');

/**
 *
 * Function used for update user.
 * @return json
 */
const update = (projectConstantRepo, applicationRepo) => async (id, params) => {
  try {
    const {
      value, error,
    } = projectConstantValidation(params);
    if (error) {
      return {
        data: null,
        code: MESSAGE.BAD_REQUEST.code,
        message: error,
      };
    }
    const isValidId = mongoose.Types.ObjectId.isValid(params.applicationId);
    if (!isValidId) {
      return INVALID_REQUEST_PARAMS;
    }
    params = value;
    const applicationData = await getApplicationDetail(applicationRepo)({ applicationId: params.applicationId });

    if (applicationData?.code !== MESSAGE.OK.code) {
      return applicationData;
    }

    const checkFilter = {
      or: [{ fileName: params.fileName }],
      ne: [{ _id: id }],
      find: {
        isActive: { $in: [true, false] },
        applicationId: params.applicationId,
      },
    };
    const checkProjectConstant = await projectConstantRepo.get({ filter: checkFilter });

    // Validate Unique Criteria
    if (checkProjectConstant) {
      return RECORD_WITH_SAME_NAME_EXISTS;
    }

    // Validate Unique Criteria
    const filter = {
      find: {
        _id: id,
        isActive: [true, false],
      },
    };
    const project = await projectConstantRepo.get({ filter });

    if (!project) {
      return PROJECT_NOT_FOUND;
    }

    const updateConstant = await projectConstantRepo.update(id, params);
    if (!updateConstant) {
      return SERVER_ERROR;
    }

    const updatedConstantData = await projectConstantRepo.get({
      find: {
        _id: updateConstant._id,
        isActive: [true, false],
      },
    });

    projectApplicationUpdate({
      params: { applicationId: params.applicationId },
      isProjectId: true,
    });
    return {
      ...CONSTANT_UPDATED,
      data: updatedConstantData,
    };
  } catch (err) {
    // console.log('error', err);
    return SERVER_ERROR;
  }
};

module.exports = update;
