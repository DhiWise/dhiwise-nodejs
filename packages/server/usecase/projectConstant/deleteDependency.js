const {
  INVALID_REQUEST_PARAMS, SERVER_ERROR, CONSTANT_DELETED,
} = require('../../constants/message').message;
const projectApplicationUpdate = require('../common/projectApplicationUpdate');

const deleteMany = (projectConstantRepo, applicationRepo) => async (filter, isHardDelete = false) => {
  try {
    if (!filter) return INVALID_REQUEST_PARAMS;
    const response = await projectConstantRepo.getDetails(filter);
    if (response && response.length) {
      const application = await applicationRepo.get({
        filter: { find: { _id: response?.[0]?.applicationId } },
        fields: ['isArchive', 'projectId'],
      });

      if (isHardDelete) {
        await projectConstantRepo.deleteMany(filter);
      } else {
        const updateData = {
          filter,
          data: { isDeleted: true },
        };
        await projectConstantRepo.updateMany(updateData);
      }
      projectApplicationUpdate({
        params: {
          applicationId: response?.[0]?.applicationId,
          projectId: application?.projectId,
        },
      });
    }
    return {
      ...CONSTANT_DELETED,
      data: null,
    };
  } catch (err) {
    // console.log('error', err);
    return SERVER_ERROR;
  }
};

module.exports = deleteMany;
