/* global MESSAGE */
const dayjs = require('dayjs');

const ApplicationRepository = require('../../repo/application');
const ProjectRepository = require('../../repo/project');

const ApplicationRepo = new ApplicationRepository();
const ProjectRepo = new ProjectRepository();

/**
 *
 * Function used for update user.
 * @return json
 */
const projectApplicationUpdate = async ({
  params, isProjectId,
}) => {
  try {
    const updateData = { updatedAt: dayjs().toISOString() };

    if (params.applicationId) {
      const application = await ApplicationRepo.update(params.applicationId, updateData);

      if (isProjectId) {
        params.projectId = application?.projectId;
      }
    }

    if (params.projectId) {
      await ProjectRepo.update(params.projectId, updateData);
    }

    return MESSAGE.OK;
  } catch (err) {
    // console.log('err', err);
    return MESSAGE.SERVER_ERROR;
  }
};

module.exports = projectApplicationUpdate;
