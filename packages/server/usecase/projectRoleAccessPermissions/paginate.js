const mongoose = require('mongoose');
const {
  INVALID_REQUEST_PARAMS, SERVER_ERROR, ROLE_PERMISSIONS_RETRIEVED,
} = require('../../constants/message').message;

const paginate = (projectRoleAccessPermissionsRepo) => async (params) => {
  try {
    if (!params.applicationId) {
      return INVALID_REQUEST_PARAMS;
    }
    const filter = { find: { applicationId: params.applicationId } };
    if (params.applicationId) {
      const isValidId = mongoose.Types.ObjectId.isValid(params.applicationId);
      if (!isValidId) {
        return INVALID_REQUEST_PARAMS;
      }
    }
    const list = await projectRoleAccessPermissionsRepo.getDetails(filter);
    const response = {
      list,
      count: await projectRoleAccessPermissionsRepo.getCount(filter),
    };
    return {
      ...ROLE_PERMISSIONS_RETRIEVED,
      data: response,
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    // console.log('error', err);
    return SERVER_ERROR;
  }
};
module.exports = paginate;
