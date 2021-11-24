/* global MESSAGE, _ */
const mongoose = require('mongoose');
const { getApplicationDetail } = require('../util/getApplicationData');
const {
  RECORD_WITH_SAME_NAME_EXISTS, SERVER_ERROR, ROLE_PERMISSIONS_CREATED, ROLE_PERMISSIONS_UPDATED, INVALID_REQUEST_PARAMS,
} = require('../../constants/message').message;

const ApplicationRepository = require('../../repo/application');
const { projectRoleAccessPermissionValidation } = require('../util/validation/projectRoleAccessPermission');
const projectApplicationUpdate = require('../common/projectApplicationUpdate');

const applicationRepo = new ApplicationRepository();

/**
 * Function used for create new user.
 * @return json
 */
const useCase = (projectRoleAccessPermissionsRepo) => async (params) => {
  try {
    // Validate Request

    const {
      value, error,
    } = projectRoleAccessPermissionValidation(params);
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
    if (params.id) {
      const isValidId = mongoose.Types.ObjectId.isValid(params.id);
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

    // Check already exists.
    const filter = {
      find: {
        name: params.name,
        applicationId: params.applicationId,
      },
    };
    if (params?.id) {
      filter.nin = [{ _id: params.id }];
    }
    const checkRolePermissions = await projectRoleAccessPermissionsRepo.get(filter);
    if (checkRolePermissions) {
      return RECORD_WITH_SAME_NAME_EXISTS;
    }

    let rolePermissionsData = {};
    if (params?.id) {
      const { id } = params;
      const updateFilter = _.cloneDeep(_.omit(params, 'id'));
      rolePermissionsData = await projectRoleAccessPermissionsRepo.update(id, updateFilter);
      projectApplicationUpdate({
        params: {
          applicationId: params.applicationId,
          projectId: applicationData?.data?.projectId,
        },
      });
      return {
        ...ROLE_PERMISSIONS_UPDATED,
        data: rolePermissionsData,
      };
    }
    rolePermissionsData = await projectRoleAccessPermissionsRepo.create(params);
    projectApplicationUpdate({
      params: {
        applicationId: params.applicationId,
        projectId: applicationData?.data?.projectId,
      },
    });
    return {
      ...ROLE_PERMISSIONS_CREATED,
      data: rolePermissionsData,
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    // console.log('error', err);
    return SERVER_ERROR;
  }
};

module.exports = useCase;
