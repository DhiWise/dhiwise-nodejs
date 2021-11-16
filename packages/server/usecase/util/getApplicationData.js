const mongoose = require('mongoose');
/* global MESSAGE */

const getApplicationDetail = (applicationRepo) => async ({
  applicationId, fields, isAllFields = false,
}) => {
  if (!applicationId) {
    return MESSAGE.BAD_REQUEST;
  }
  const isValidId = mongoose.Types.ObjectId.isValid(applicationId);
  if (!isValidId) {
    return MESSAGE.BAD_REQUEST;
  }

  let newFields = ['isArchive', 'isDeleted', 'definitionId', 'generatedId', 'name', 'tempGeneratedId'];
  if (fields) {
    newFields = [...newFields, ...fields];
  }

  if (isAllFields) {
    newFields = [];
  }

  const application = await applicationRepo.get({
    filter: {
      find: {
        _id: applicationId,
        isDeleted: [true, false],
      },
    },
    fields: newFields,
  });

  if (!application) {
    return MESSAGE.NOT_FOUND;
  }
  if (application?.isDeleted === true) {
    return MESSAGE.APPLICATION_IS_DELETED;
  }

  return {
    ...MESSAGE.OK,
    data: application,
  };
};

/**
 * Function used to get application detail
 * @param {*} applicationRepo
 * @returns
 */
const getApplicationDetailById = (applicationRepo) => async ({ applicationId }) => {
  if (!applicationId) {
    return MESSAGE.BAD_REQUEST;
  }

  const filter = { id: applicationId };

  const application = await applicationRepo.getById(filter);

  if (!application) {
    return MESSAGE.NOT_FOUND;
  }
  if (application?.isDeleted === true) {
    return MESSAGE.APPLICATION_IS_DELETED;
  }

  return {
    ...MESSAGE.OK,
    data: application,
  };
};

module.exports = {
  getApplicationDetail,
  getApplicationDetailById,
};
