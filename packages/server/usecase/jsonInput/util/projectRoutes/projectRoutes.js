/* eslint-disable no-loop-func */
/* eslint-disable no-undef */
/* global  _ */
const { ROUTE_GENERATE_TYPE } = require('../../../../models/constants/project');
const { PROJECT_DEFINITION_CODE } = require('../../../../models/constants/projectDefinition');

const projectRouteCreateUseCase = require('../../../projectRoute/create');
const queryBuilderInsertManyUseCase = require('../../../queryBuilder/insertMany');

const ProjectRouteRepository = require('../../../../repo/projectRoute');
const SchemaRepository = require('../../../../repo/schema');
const ApplicationRepository = require('../../../../repo/application');
const QueryBuilderRepository = require('../../../../repo/queryBuilder');

const projectRouteRepo = new ProjectRouteRepository();
const schemaRepo = new SchemaRepository();
const applicationRepo = new ApplicationRepository();
const queryBuilderRepo = new QueryBuilderRepository();

const { OK } = require('../../../../constants/message').message;
const { TYPES } = require('../../../../constants/queryBuilder');

const projectRoutes = async ({ params }) => {
  const routesData = _.cloneDeep(params.data.routes);
  const applicationId = _.cloneDeep(params.data.applicationId);
  const definitionType = _.cloneDeep(params.data.definitionType);

  const errors = [];
  if (routesData?.apis && routesData?.apis.length > 0) {
    const modelNames = _.map(routesData.apis, 'model');
    const schemaData = await schemaRepo.getDetails({
      find: {
        applicationId,
        name: modelNames,
      },
    });

    for (let i = 0; i < routesData.apis.length; i += 1) {
      const routeDetails = _.cloneDeep(routesData.apis[i]);

      const input = {
        applicationId,
        type: ROUTE_GENERATE_TYPE.MANUAL,
      };

      const modelDetails = _.find(schemaData, { name: routeDetails.model });

      if (modelDetails?._id) {
        input.modelId = modelDetails._id;
      }
      if (routeDetails?.method) {
        input.method = routeDetails.method;
      }
      if (routeDetails?.api) {
        input.route = routeDetails.api;
      }
      if (routeDetails?.controller) {
        input.controller = routeDetails.controller;
      }
      if (routeDetails?.descriptions) {
        input.description = routeDetails.descriptions;
      }
      if (routeDetails?.platform) {
        input.platform = routeDetails.platform;
      }
      if (routeDetails?.functionName) {
        input.action = routeDetails.functionName;
      }
      if (routeDetails?.headers) {
        input.headers = routeDetails.headers;
      }
      if (routeDetails?.policies) {
        input.policies = routeDetails.policies;
      }
      if (definitionType) {
        input.definitionType = routeDetails.definitionType;
      } else {
        input.definitionType = PROJECT_DEFINITION_CODE.NODE_EXPRESS;
      }

      if (routeDetails?.queryBuilder && routeDetails.queryBuilder.length > 0) {
        // check fileUplaod query mode exist then store it in file upload operation
        const fileUploadObj = routeDetails?.queryBuilder.filter((data) => data.queryMode === 'fileUpload');
        if (fileUploadObj?.length > 0) {
          delete fileUploadObj.queryMode;
          input.fileUpload = { uploads: [fileUploadObj] };
        }
      }

      // eslint-disable-next-line no-await-in-loop
      const response = await projectRouteCreateUseCase(projectRouteRepo, applicationRepo)(input);

      if (response?.data?._id && routeDetails?.queryBuilder && routeDetails.queryBuilder.length > 0) {
        // eslint-disable-next-line no-await-in-loop
        await Promise.all(_.map(routeDetails.queryBuilder, async (qBuilder) => {
          const routeId = _.cloneDeep(response.data._id);
          const queryBuilderInput = [
            {
              applicationId,
              referenceId: routeId,
              referenceType: TYPES.ROUTES,
              code: qBuilder.code,
              queryMode: qBuilder.queryMode,
            },
          ];
          // eslint-disable-next-line no-await-in-loop
          const qBuilderRes = await queryBuilderInsertManyUseCase(queryBuilderRepo)(queryBuilderInput);
          if (qBuilderRes.code !== OK.code) {
            errors.push({
              message: qBuilderRes.message,
              data: qBuilderRes,
            });
          }
        }));
      }
      if (response.code !== OK.code) {
        errors.push({
          message: response.message,
          data: input,
        });
      }
    }
  }

  return {
    ...OK,
    data: { errors },
  };
};

module.exports = projectRoutes;
