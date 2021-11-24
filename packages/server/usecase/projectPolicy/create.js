/* global MESSAGE, */
const mongoose = require('mongoose');
const { getApplicationDetail } = require('../util/getApplicationData');
const projectApplicationUpdate = require('../common/projectApplicationUpdate');
const {
  INVALID_REQUEST_PARAMS, RECORD_WITH_SAME_NAME_EXISTS, SERVER_ERROR, MIDDLEWARE_CREATED,
} = require('../../constants/message').message;
const { projectPolicyCreateValidation } = require('../util/validation/projectPolicy');

/**
 * Function used for create new user.
 * @return json
 */
const useCase = (projectPolicyRepo, applicationRepo) => async (params) => {
  try {
    // Validate Request

    const {
      value, error,
    } = projectPolicyCreateValidation(params);
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
    const applicationData = await getApplicationDetail(applicationRepo)({
      applicationId: params.applicationId,
      fields: ['projectId'],
    });

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
    const checkProjectPolicy = await projectPolicyRepo.get({ filter });

    // Validate Unique Criteria
    if (checkProjectPolicy) {
      return RECORD_WITH_SAME_NAME_EXISTS;
    }

    const created = await projectPolicyRepo.create(params);

    if (!created) {
      return INVALID_REQUEST_PARAMS;
    }
    projectApplicationUpdate({
      params: {
        projectId: applicationData?.data?.projectId,
        applicationId: params.applicationId,
      },
    });
    return {
      ...MIDDLEWARE_CREATED,
      data: created,
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    // console.log('error', err);
    return SERVER_ERROR;
  }
};

module.exports = useCase;
