/* global MESSAGE, */
const mongoose = require('mongoose');

const {
  INVALID_REQUEST_PARAMS, RECORD_WITH_SAME_NAME_EXISTS, SERVER_ERROR, CONSTANT_CREATED,
} = require('../../constants/message').message;
const { projectConstantValidation } = require('../util/validation/projectConstant');
const { getApplicationDetail } = require('../util/getApplicationData');
const projectApplicationUpdate = require('../common/projectApplicationUpdate');

/**
 * Function used for create new user.
 * @return json
 */
const useCase = (projectConstantRepo, applicationRepo) => async (params) => {
  try {
    // Validate Request
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
    params = value;
    if (params.applicationId) {
      const isValidId = mongoose.Types.ObjectId.isValid(params.applicationId);
      if (!isValidId) {
        return INVALID_REQUEST_PARAMS;
      }
    }
    if (params.modelId) {
      const isValidId = mongoose.Types.ObjectId.isValid(params.modelId);
      if (!isValidId) {
        return INVALID_REQUEST_PARAMS;
      }
    }
    const applicationData = await getApplicationDetail(applicationRepo)({ applicationId: params.applicationId });

    if (applicationData?.code !== MESSAGE.OK.code) {
      return applicationData;
    }

    const filter = {
      or: [{ fileName: params.fileName }],
      find: {
        isActive: { $in: [true, false] },
        applicationId: params.applicationId,
      },
    };
    const checkProjectConstant = await projectConstantRepo.get({ filter });

    // Validate Unique Criteria
    if (checkProjectConstant) {
      return RECORD_WITH_SAME_NAME_EXISTS;
    }

    const created = await projectConstantRepo.create(params);

    if (!created) {
      return INVALID_REQUEST_PARAMS;
    }
    projectApplicationUpdate({
      params: { applicationId: params.applicationId },
      isProjectId: true,
    });
    return {
      ...CONSTANT_CREATED,
      data: created,
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    // console.log('error', err);
    return SERVER_ERROR;
  }
};

module.exports = useCase;
