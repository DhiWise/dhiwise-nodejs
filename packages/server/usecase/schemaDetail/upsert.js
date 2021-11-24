/* global _ */
const { ROUTE_GENERATE_TYPE } = require('../../models/constants/project');

const ProjectRouteRepo = require('../../repo/projectRoute');
const ApplicationRepo = require('../../repo/application');
const SchemaRepo = require('../../repo/schema');

const projectRouteRepo = new ProjectRouteRepo();
const applicationRepo = new ApplicationRepo();
const schemaRepo = new SchemaRepo();

const RouteDeleteUseCase = require('../projectRoute/deleteDependency');
const getPermissionWiseRoute = require('../util/getPermissionWiseRoute');
const routeInsertManyUseCase = require('../projectRoute/insertMany');
const projectApplicationUpdate = require('../common/projectApplicationUpdate');

const {
  INVALID_REQUEST_PARAMS, SERVER_ERROR, MODEL_PERMISSION_UPDATED,
} = require('../../constants/message').message;

const upsert = (schemaDetailRepo) => async (params) => {
  try {
    if (!params || !params.data || !params.data.length) {
      return INVALID_REQUEST_PARAMS;
    }
    let applicationId = null;
    let existsData = await schemaDetailRepo.getDetails({ find: { _id: { $in: _.map(params.data, '_id') } } });
    existsData = _.groupBy(existsData, '_id');
    const response = {
      success: [],
      failed: [],
    };
    let applicationDetails = null;
    let definitionDetails = null;

    await Promise.all(_.map(params.data, async (detail) => {
      if (detail._id && existsData[detail._id]) {
        await schemaDetailRepo.update(detail._id, _.omit(detail, ['_id', 'createdAt', 'updatedAt']));

        if (detail.schemaJson) {
          const filter = {
            filter: {
              find: {
                _id: detail.schemaId,
                isActive: { $in: [true, false] },
              },
            },
            fields: ['_id', 'name', 'applicationId'],
          };
          const schemaDetail = await schemaRepo.get(filter);

          if (schemaDetail && schemaDetail.applicationId) {
            applicationId = schemaDetail.applicationId;

            if (!applicationDetails) {
              applicationDetails = await applicationRepo.get({ find: { _id: applicationId } });
              if (applicationDetails) {
                definitionDetails = {};// await getProjectDefinition({ _id: applicationDetails.definitionId });
              }
            }

            // update route based on permission
            await (RouteDeleteUseCase(projectRouteRepo, applicationRepo))({
              find: {
                modelId: detail.schemaId,
                type: ROUTE_GENERATE_TYPE.AUTO,
              },
            }, true);
            // create route based on permission
            const allRouts = getPermissionWiseRoute(detail.schemaJson, schemaDetail, definitionDetails?.code);
            await (routeInsertManyUseCase(projectRouteRepo))({ routes: allRouts });
          }
        }

        response.success.push(detail);
      } else {
        response.failed.push(detail);
      }
      return true;
    }));
    projectApplicationUpdate({
      params: { applicationId },
      isProjectId: true,
    });
    return {
      ...MODEL_PERMISSION_UPDATED,
      data: response,
    };
  } catch (err) {
    // console.log('error', err);
    return { ...SERVER_ERROR };
    // return { ...SERVER_ERROR, data: err.toString() };
  }
};
module.exports = upsert;
