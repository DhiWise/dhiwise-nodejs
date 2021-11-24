/* global _ */
const {
  INVALID_REQUEST_PARAMS, SERVER_ERROR, ALREADY_USED_POLICY, SCHEMA_NOT_FOUND, MIDDLEWARE_DELETED,
} = require('../../constants/message').message;

const SchemaDetailRepo = require('../../repo/schemaDetail');
const projectApplicationUpdate = require('../common/projectApplicationUpdate');
const SchemaRepo = require('../../repo/schema');
const ProjectRouteRepo = require('../../repo/projectRoute');

const schemaDetailRepository = new SchemaDetailRepo();
const schemaRepository = new SchemaRepo();
const projectRouteRepository = new ProjectRouteRepo();

const {
  additionalJsonObj, schemaJsonObj,
} = require('./util/dependentCond');

const deleteMany = (projectPolicyRepo, applicationRepo) => async (filter, isHardDelete = false) => {
  try {
    if (!filter) return INVALID_REQUEST_PARAMS;
    const response = await projectPolicyRepo.getDetails(filter);
    if (response && response.length) {
      const application = await applicationRepo.get({
        filter: { find: { _id: response?.[0]?.applicationId } },
        fields: ['isArchive', 'configInput', 'projectId'],
      });

      // Get applicationId from `Schema` collection.
      const getSchema = await schemaRepository.getDetails({
        find: { applicationId: response[0].applicationId },
        fields: ['_id'],
      });
      if (!getSchema) {
        return SCHEMA_NOT_FOUND;
      }
      const schemaIds = _.compact(_.map(getSchema, '_id'));

      const schemaJsonData = await schemaJsonObj(application, response[0]);
      const additionalJsonData = await additionalJsonObj(application, response[0]);

      const orCondArr = [...schemaJsonData, ...additionalJsonData];

      const schemaFilter = {
        find: { schemaId: schemaIds },
        or: orCondArr,
      };
      const schemaDetails = await schemaDetailRepository.getDetails(schemaFilter);
      if (schemaDetails && _.size(schemaDetails) > 0) {
        return ALREADY_USED_POLICY;
      }

      // Check policy dependency in `Project-Routes`.
      const projectRouteFilter = {
        find: {
          applicationId: response[0].applicationId,
          policies: response[0].fileName,
        },
      };
      const projectRoutes = await projectRouteRepository.getDetails(projectRouteFilter);
      if (projectRoutes && _.size(projectRoutes) > 0) {
        return ALREADY_USED_POLICY;
      }

      if (isHardDelete) {
        await projectPolicyRepo.deleteMany(filter);
      } else {
        const updateData = {
          filter,
          data: { isDeleted: true },
        };
        await projectPolicyRepo.updateMany(updateData);
      }
      projectApplicationUpdate({
        params: {
          projectId: application?.projectId,
          applicationId: response[0].applicationId,
        },
      });
    }
    return {
      ...MIDDLEWARE_DELETED,
      data: response,
    };
  } catch (err) {
    // console.log('error', err);
    return SERVER_ERROR;
  }
};

module.exports = deleteMany;
