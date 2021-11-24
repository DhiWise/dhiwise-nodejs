/* global MESSAGE,_ */
const dayjs = require('dayjs');
const ApplicationRepo = require('../../repo/application');

const applicationRepo = new ApplicationRepo();

const deleteApplicationUseCase = require('../application/deleteDependency')(applicationRepo);

const {
  INVALID_REQUEST_PARAMS, PROJECT_DELETED,
} = require('../../constants/message').message;

const deleteMany = (projectRepo) => async (filter, isHardDelete = false) => {
  try {
    if (!filter) return INVALID_REQUEST_PARAMS;
    const response = await projectRepo.getDetails(filter);
    if (response && response.length) {
      if (isHardDelete) {
        await projectRepo.deleteMany(filter);
      } else {
        const updateData = {
          filter,
          data: {
            isDeleted: true,
            selfUpdatedAt: dayjs().toISOString(),
          },
        };
        await projectRepo.updateMany(updateData);
      }
      await deleteApplicationUseCase({ find: { projectId: _.map(response, '_id') } }, isHardDelete);
    }
    return PROJECT_DELETED;
  } catch (err) {
    // console.log('error', err);
    return MESSAGE.SERVER_ERROR;
  }
};

module.exports = deleteMany;
