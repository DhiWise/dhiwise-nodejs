const {
  SERVER_ERROR, PROJECT_NOT_FOUND, PROJECT_IS_ARCHIVED, PROJECT_IS_IN_ARCHIVE,
} = require('../../constants/message').message;

/**
 *
 * Function used for update project-config.
 * @return json
 */
const archiveProject = (projectRepo, applicationRepo) => async (id) => {
  try {
    // Validate Unique Criteria
    const filter = { find: { _id: id } };
    const projectData = await projectRepo.get(filter);

    if (!projectData) {
      return PROJECT_NOT_FOUND;
    }

    if (projectData?.isArchive === true) {
      return PROJECT_IS_IN_ARCHIVE;
    }

    const updateResponse = await projectRepo.update(id, { isArchive: true });
    const updateData = {
      filter: { find: { projectId: updateResponse._id } },
      data: { isArchive: true },
    };

    await applicationRepo.updateMany(updateData);

    return PROJECT_IS_ARCHIVED;
  } catch (err) {
    return SERVER_ERROR;
  }
};

module.exports = archiveProject;
