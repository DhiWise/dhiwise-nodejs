const {
  INVALID_REQUEST_PARAMS, SERVER_ERROR, ROLE_PERMISSIONS_DELETED,
} = require('../../constants/message').message;

const ApplicationRepository = require('../../repo/application');
const projectApplicationUpdate = require('../common/projectApplicationUpdate');

const applicationRepo = new ApplicationRepository();

const deleteMany = (projectRoleAccessPermissionsRepo) => async (filter, isHardDelete = false) => {
  try {
    if (!filter) return INVALID_REQUEST_PARAMS;
    const response = await projectRoleAccessPermissionsRepo.getDetails(filter);
    if (response && response.length) {
      const application = await applicationRepo.get({
        filter: { find: { _id: response[0].applicationId } },
        fields: ['isArchive', 'projectId'],
      });

      if (isHardDelete) {
        await projectRoleAccessPermissionsRepo.deleteMany(filter);
      } else {
        const updateData = {
          filter,
          data: { isDeleted: true },
        };
        await projectRoleAccessPermissionsRepo.updateMany(updateData);
      }
      projectApplicationUpdate({
        params: {
          applicationId: response[0].applicationId,
          projectId: application?.projectId,
        },
      });
    }
    return {
      ...ROLE_PERMISSIONS_DELETED,
      data: response,
    };
  } catch (err) {
    // console.log('error', err);
    return SERVER_ERROR;
  }
};

module.exports = deleteMany;
