const mongoose = require('mongoose');

const {
  SERVER_ERROR,
  PROJECT_NOT_FOUND,
  PROJECT_IS_UNARCHIVED,
  PROJECT_NOT_IN_ARCHIVE,
  INVALID_REQUEST_PARAMS,
} = require('../../constants/message').message;

/**
 *
 * Function used for update project-config.
 * @return json
 */
const unArchiveProject = (projectRepo, applicationRepo) => async (
  id,
) => {
  try {
    // Validate Unique Criteria
    const filter = { find: { _id: id } };
    if (id) {
      const isValidId = mongoose.Types.ObjectId.isValid(id);
      if (!isValidId) {
        return INVALID_REQUEST_PARAMS;
      }
    }
    const projectData = await projectRepo.get(filter);

    if (!projectData) {
      return PROJECT_NOT_FOUND;
    }

    if (projectData?.isArchive === false) {
      return PROJECT_NOT_IN_ARCHIVE;
    }

    const updateResponse = await projectRepo.update(
      id,
      { isArchive: false },
    );
    const updateData = {
      filter: { find: { projectId: updateResponse._id } },
      data: { isArchive: false },
    };

    await applicationRepo.updateMany(updateData);

    return PROJECT_IS_UNARCHIVED;
  } catch (err) {
    return SERVER_ERROR;
  }
};

module.exports = unArchiveProject;
