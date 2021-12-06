/* global _ */
const SchemaRepo = require('../../repo/schema');
const ProjectConstantRepo = require('../../repo/projectConstant');
const ProjectRouteRepo = require('../../repo/projectRoute');
const ProjectPolicyRepo = require('../../repo/projectPolicy');
const ApplicationRepo = require('../../repo/application');

const schemaRepo = new SchemaRepo();
const projectConstantRepo = new ProjectConstantRepo();
const projectRouteRepo = new ProjectRouteRepo();
const projectPolicyRepo = new ProjectPolicyRepo();
const applicationRepository = new ApplicationRepo();

const deleteSchemaDetailUseCase = require('../schema/deleteDependency')(schemaRepo, applicationRepository);
const deleteProjectConstantUseCase = require('../projectConstant/deleteDependency')(projectConstantRepo, applicationRepository);
const deleteProjectRouteUseCase = require('../projectRoute/deleteDependency')(projectRouteRepo, applicationRepository);
const deleteProjectPolicyUseCase = require('../projectPolicy/deleteDependency')(projectPolicyRepo, applicationRepository);

const {
  INVALID_REQUEST_PARAMS, APPLICATION_DELETED, SERVER_ERROR, NOT_FOUND,
} = require('../../constants/message').message;

// { filter: { find: { applicationId: params.id } } }
const deleteMany = (applicationRepo) => async (filter, isHardDelete = false) => {
  try {
    if (!filter) return INVALID_REQUEST_PARAMS;
    const response = await applicationRepo.getDetails(filter);

    if (!response.length) {
      return NOT_FOUND;
    }

    if (response && response.length) {
      if (isHardDelete) {
        await applicationRepo.deleteMany(filter);
      } else {
        const updateData = {
          filter,
          data: { isDeleted: true },
        };
        await applicationRepo.updateMany(updateData);
      }

      // delete dependency
      await deleteSchemaDetailUseCase({ find: { applicationId: _.map(response, '_id') } });
      await deleteProjectConstantUseCase({ find: { applicationId: _.map(response, '_id') } }, isHardDelete);
      await deleteProjectRouteUseCase({ find: { applicationId: _.map(response, '_id') } }, isHardDelete);
      await deleteProjectPolicyUseCase({ find: { applicationId: _.map(response, '_id') } }, isHardDelete);
    }
    return APPLICATION_DELETED;
  } catch (err) {
    // console.log('error', err);
    return SERVER_ERROR;
  }
};
module.exports = deleteMany;
