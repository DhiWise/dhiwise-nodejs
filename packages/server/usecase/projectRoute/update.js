/* global MESSAGE,_ */
const mongoose = require('mongoose');
const { PROJECT_DEFINITION_CODE } = require('../../models/constants/projectDefinition');
const { getApplicationDetail } = require('../util/getApplicationData');
const {
  INVALID_REQUEST_PARAMS, OK, SERVER_ERROR, PROJECT_ROUTE_NOT_FOUND, ROUTE_UPDATED, SAME_ROUTES_EXISTS,
} = require('../../constants/message').message;

const QueryBuilderRepo = require('../../repo/queryBuilder');
const NestedQueryBuilderRepository = require('../../repo/nestedQueryBuilder');
const SchemaDetailRepository = require('../../repo/schemaDetail');

const queryBuilderRepo = new QueryBuilderRepo();
const schemaDetailRepo = new SchemaDetailRepository();
const nestedQueryBuilderRepo = new NestedQueryBuilderRepository();

const queryBuilderUseCase = require('../queryBuilder/insertMany');
const queryBuilderDeleteDependencyUseCase = require('../queryBuilder/deleteDependency');

const nestedQueryBuilderUseCase = require('../nestedQueryBuilder/insertMany');
const nestedQueryBuilderDeleteDependencyUseCase = require('../nestedQueryBuilder/deleteDependency');

const { TYPES } = require('../../constants/queryBuilder');
const { projectRouteUpdateValidation } = require('../util/validation/projectRoute');
const projectApplicationUpdate = require('../common/projectApplicationUpdate');

/**
 * Function used to create, delete and retrieve Query-builder.
 * @param  {} {applicationRepo
 * @param  {} params
 * @param  {} routeData
 * @param  {} }
 */
async function queryBuilderOperations ({
  applicationRepo, params, routeData,
}) {
  // Delete and create query-builder details.
  if (params.applicationId) {
    const isValidId = mongoose.Types.ObjectId.isValid(params.applicationId);
    if (!isValidId) {
      return INVALID_REQUEST_PARAMS;
    }
  }
  if (params && params.queryBuilder && _.size(params.queryBuilder) > 0) {
    _.each(params.queryBuilder, (val) => {
      if (val && val.filter) {
        val.filter = _.cloneDeep(JSON.stringify(val.filter));
      }

      val.applicationId = params.applicationId;
      val.referenceId = routeData._id;
      val.referenceType = TYPES.ROUTES;
      delete val._id;
    });

    // Delete old query-builder data.
    const deleteInput = {
      find: {
        applicationId: params.applicationId,
        referenceId: routeData._id,
        referenceType: TYPES.ROUTES,
      },
    };
    const deleteQueryBuilderData = await queryBuilderDeleteDependencyUseCase(queryBuilderRepo, applicationRepo)(deleteInput, true);
    if (!deleteQueryBuilderData.code || deleteQueryBuilderData.code !== OK.code) {
      return deleteQueryBuilderData;
    }
    // InsertMany query-builder.
    const queryBuilderData = await queryBuilderUseCase(queryBuilderRepo)(params.queryBuilder);
    if (!queryBuilderData.code || queryBuilderData.code !== OK.code) {
      return queryBuilderData;
    }
  }

  // Retrieved query-builder data.
  let queryBuilder = [];
  const qBuilderInput = {
    find: {
      applicationId: params.applicationId,
      referenceId: routeData._id,
      referenceType: TYPES.ROUTES,
    },
  };
  let qBuilderData = await queryBuilderRepo.getDetails(qBuilderInput);
  if (qBuilderData && _.size(qBuilderData) > 0) {
    qBuilderData = _.map(qBuilderData, (val) => {
      val = _.omit(val, ['createdAt', 'updatedAt', 'addedBy', 'updatedBy', 'isActive', 'isDeleted']);
      return val;
    });
    queryBuilder = qBuilderData;
  }

  return {
    ...OK,
    data: queryBuilder,
  };
}

/**
 * Function used to delete, create, and retrieved Nested-query-builder.
 * @param  {} {applicationRepo
 * @param  {} params
 * @param  {} routeData
 * @param  {} }
 */
async function nestedQueryBuilderOperations ({
  applicationRepo, params, routeData,
}) {
  // Delete and create query-builder details.
  if (params && params.nestedQueryBuilder && _.size(params.nestedQueryBuilder) > 0) {
    _.each(params.nestedQueryBuilder, (val) => {
      if (val && val.filter) {
        val.filter = _.cloneDeep(JSON.stringify(val.filter));
      }

      val.applicationId = params.applicationId;
      val.referenceId = routeData._id;
      val.referenceType = TYPES.ROUTES;
      delete val._id;
    });

    // Delete old query-builder data.
    const deleteInput = {
      find: {
        applicationId: params.applicationId,
        referenceId: routeData._id,
        referenceType: TYPES.ROUTES,
      },
    };
    const deleteNqBuilderData = await nestedQueryBuilderDeleteDependencyUseCase(nestedQueryBuilderRepo, applicationRepo)(deleteInput, true);
    if (deleteNqBuilderData.code !== OK.code) {
      return deleteNqBuilderData;
    }
    // InsertMany query-builder.
    const nqBuilderData = await nestedQueryBuilderUseCase(nestedQueryBuilderRepo)(params.nestedQueryBuilder);
    if (nqBuilderData.code !== OK.code) {
      return nqBuilderData;
    }
  }

  // Retrieved query-builder data.
  let nestedQueryBuilder = [];
  const qBuilderInput = {
    find: {
      applicationId: params.applicationId,
      referenceId: routeData._id,
      referenceType: TYPES.ROUTES,
    },
  };
  let qBuilderData = await nestedQueryBuilderRepo.getDetails(qBuilderInput);
  if (qBuilderData && _.size(qBuilderData) > 0) {
    qBuilderData = _.map(qBuilderData, (val) => {
      val = _.omit(val, ['createdAt', 'updatedAt', 'addedBy', 'updatedBy', 'isActive', 'isDeleted']);
      return val;
    });
    nestedQueryBuilder = _.cloneDeep(qBuilderData);
  }
  return {
    ...OK,
    data: nestedQueryBuilder,
  };
}

/**
 *
 * Function used for update user.
 * @return json
 */
const update = (projectRouteRepo, applicationRepo) => async (id, params) => {
  try {
    let isNodeApp = false;
    if (params?.definitionType && params.definitionType === PROJECT_DEFINITION_CODE.NODE_EXPRESS) {
      isNodeApp = true;
    }

    const {
      value, error,
    } = projectRouteUpdateValidation(params, isNodeApp);
    if (error) {
      return {
        data: null,
        code: MESSAGE.BAD_REQUEST.code,
        message: error,
      };
    }
    params = value;

    const applicationData = await getApplicationDetail(applicationRepo)({ applicationId: params.applicationId });

    if (applicationData?.code !== MESSAGE.OK.code) {
      return applicationData;
    }

    const filter = { find: { _id: id } };
    const project = await projectRouteRepo.get({ filter });

    if (!project) {
      return PROJECT_ROUTE_NOT_FOUND;
    }

    if (params?.controller) {
      params.controller = _.capitalize(params.controller);
    }

    const checkFilter = {
      or: [{ route: params.route }],
      ne: [{ _id: id }],
      find: { applicationId: params.applicationId },
    };
    if (params?.controller && params?.action) {
      checkFilter.or.push({
        action: params.action,
        controller: params.controller,
      });
    }
    const checkProjectRoute = await projectRouteRepo.get({ filter: checkFilter });

    // Validate Unique Criteria
    if (checkProjectRoute) {
      return SAME_ROUTES_EXISTS;
    }

    if (!params.modelId) {
      params.groupName = null;
    }

    const updateResponse = await projectRouteRepo.update(id, params);

    const response = updateResponse.toObject();

    // Update Query-builder data.
    const qBuilderData = await queryBuilderOperations({
      applicationRepo,
      params,
      routeData: response,
    });
    if (qBuilderData.code !== OK.code) {
      return qBuilderData;
    }
    const queryBuilder = _.cloneDeep(qBuilderData.data);

    response.queryBuilder = queryBuilder;

    // Update nested-query-builder.
    const nqBuilder = await nestedQueryBuilderOperations({
      applicationRepo,
      params,
      routeData: response,
    });
    if (nqBuilder.code !== OK.code) {
      return nqBuilder;
    }
    response.nestedQueryBuilder = _.cloneDeep(nqBuilder.data);

    // Update schemaDetails data.
    if (params?.permissionData?._id) {
      const schemaDetail = await schemaDetailRepo.get({ find: { _id: params.permissionData._id } });
      if (schemaDetail) {
        delete params.permissionData._id;
        const schemaDetails = await schemaDetailRepo.update(schemaDetail._id, params.permissionData);
        response.permissionData = _.pick(schemaDetails.toObject(), ['_id', 'schemaJson', 'additionalJson']);
      }
    }

    projectApplicationUpdate({
      params: { applicationId: params.applicationId },
      isProjectId: true,
    });

    let responseMsg = OK;
    responseMsg = ROUTE_UPDATED;

    return {
      ...responseMsg,
      data: response,
    };
  } catch (err) {
    // console.log('error', err);
    return SERVER_ERROR;
  }
};

module.exports = update;
