/* global  _ */
const mongoose = require('mongoose');
const {
  INVALID_REQUEST_PARAMS, OK, SERVER_ERROR,
} = require('../../../constants/message').message;

const RemoveModelDetails = (projectRoleAccessPermissionsRepo) => async (params) => {
  try {
    if (!params.applicationId) {
      return INVALID_REQUEST_PARAMS;
    }
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
    const filter = {
      find: {
        applicationId: params.applicationId,
        customJson: { $elemMatch: { modelId: params.modelId } },
      },
    };

    const rolePermissions = await projectRoleAccessPermissionsRepo.getDetails(filter);
    if (rolePermissions && rolePermissions.length > 0) {
      for (let i = 0; i < rolePermissions.length; i += 1) {
        const roleAccessPermission = _.cloneDeep(rolePermissions[i]);
        let { customJson } = roleAccessPermission;

        customJson = _.map(customJson, (v) => {
          if (v.modelId && v.modelId.toString() !== params.modelId.toString()) {
            return v;
          }
          return {};
        });
        customJson = _.reject(customJson, _.isEmpty);
        // eslint-disable-next-line no-await-in-loop
        await projectRoleAccessPermissionsRepo.update(roleAccessPermission._id, { customJson });
      }
    }
    return OK;
  } catch (err) {
    // eslint-disable-next-line no-console
    // console.log('error', err);
    return SERVER_ERROR;
  }
};
module.exports = RemoveModelDetails;
