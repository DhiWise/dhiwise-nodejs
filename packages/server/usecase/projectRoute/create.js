/* global MESSAGE,_ */
const mongoose = require('mongoose');

const { PROJECT_DEFINITION_CODE } = require('../../models/constants/projectDefinition');
const { getApplicationDetail } = require('../util/getApplicationData');
const {
  INVALID_REQUEST_PARAMS, OK, SERVER_ERROR, ROUTE_CREATED, SAME_ROUTES_EXISTS,
} = require('../../constants/message').message;

const QueryBuilderRepo = require('../../repo/queryBuilder');
const NestedQueryBuilderRepo = require('../../repo/nestedQueryBuilder');

const projectApplicationUpdate = require('../common/projectApplicationUpdate');

const queryBuilderRepo = new QueryBuilderRepo();
const nestedQueryBuilderRepo = new NestedQueryBuilderRepo();

const queryBuilderUseCase = require('../queryBuilder/insertMany');
const nestedQueryBuilderUseCase = require('../nestedQueryBuilder/insertMany');
const { TYPES } = require('../../constants/queryBuilder');
const { projectRouteCreateValidation } = require('../util/validation/projectRoute');

/**
 * Function used to retrieve and store query-builder data.
 * @param  {} {params
 * @param  {} routeData
 * @param  {} projectOwner
 * @param  {} }
 */
async function getQueryBuilder ({
  params, routeData,
}) {
  // Store query-builder data.
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

    const queryBuilderData = await queryBuilderUseCase(queryBuilderRepo)(params.queryBuilder);
    if (!queryBuilderData.code || queryBuilderData.code !== OK.code) {
      return queryBuilderData;
    }
  }
  if (params.applicationId) {
    const isValidId = mongoose.Types.ObjectId.isValid(params.applicationId);
    if (!isValidId) {
      return INVALID_REQUEST_PARAMS;
    }
  }
  // Retrieved query-builder data.
  let queryBuilderData = [];
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
    queryBuilderData = _.cloneDeep(qBuilderData);
  }

  return {
    ...OK,
    data: queryBuilderData,
  };
}

/**
 * Function used to retrieve and store Nested-query-builder data.
 * @param  {} params
 * @param  {} routeData
 * @param  {} }
 */
async function getNestedQueryBuilder ({
  params, routeData,
}) {
  let nestedQueryBuilderData = [];

  // Store nested-query-builder data.
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

    const nqBuilderData = await nestedQueryBuilderUseCase(nestedQueryBuilderRepo)(params.nestedQueryBuilder);
    if (nqBuilderData.code !== OK.code) {
      return nqBuilderData;
    }
  }

  // Retrieve nested-query-builder data.
  const qBuilderInput = {
    find: {
      applicationId: params.applicationId,
      referenceId: routeData._id,
      referenceType: TYPES.ROUTES,
    },
  };
  let nqBuilderData = await nestedQueryBuilderRepo.getDetails(qBuilderInput);
  if (nqBuilderData && _.size(nqBuilderData) > 0) {
    nqBuilderData = _.map(nqBuilderData, (val) => {
      val = _.omit(val, ['createdAt', 'updatedAt', 'addedBy', 'updatedBy', 'isActive', 'isDeleted']);
      return val;
    });
    nestedQueryBuilderData = _.cloneDeep(nqBuilderData);
  }

  return {
    ...OK,
    data: nestedQueryBuilderData,
  };
}

/**
 * Function used for create new user.
 * @return json
 */
const useCase = (projectRouteRepo, applicationRepo) => async (params) => {
  try {
    // Validate Request

    let isNodeApp = false;
    if (params?.definitionType && params.definitionType === PROJECT_DEFINITION_CODE.NODE_EXPRESS) {
      isNodeApp = true;
    }

    const {
      value, error,
    } = projectRouteCreateValidation(params, isNodeApp);
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

    if (params?.controller) {
      params.controller = _.capitalize(params.controller);
    }

    const filter = {
      or: [{ route: params.route }],
      find: { applicationId: params.applicationId },
    };
    if (params?.controller && params?.action) {
      filter.or.push({
        action: params.action,
        controller: params.controller,
      });
    }
    const checkRoute = await projectRouteRepo.get({ filter });

    // Validate Unique Criteria
    if (checkRoute) {
      return SAME_ROUTES_EXISTS;
    }

    if (!params.modelId) {
      params.groupName = null;
    }

    const created = await projectRouteRepo.create(params);

    if (!created) {
      return INVALID_REQUEST_PARAMS;
    }

    // Store & Retrieve query-builder-data.
    const qBuilderData = await getQueryBuilder({
      params,
      routeData: created,
    });
    if (qBuilderData.code !== OK.code) {
      return qBuilderData;
    }
    const queryBuilderData = _.cloneDeep(qBuilderData.data);

    // Store & Retrieve nested-query-builder-data.
    const nqBuilderData = await getNestedQueryBuilder({
      params,
      routeData: created.toObject(),
    });
    if (nqBuilderData.code !== OK.code) {
      return nqBuilderData;
    }
    const nestedQueryBuilder = _.cloneDeep(nqBuilderData.data);

    const response = created.toObject();
    response.queryBuilder = queryBuilderData;
    response.nestedQueryBuilder = nestedQueryBuilder;
    projectApplicationUpdate({
      params: { applicationId: params.applicationId },
      isProjectId: true,
    });

    const responseMsg = ROUTE_CREATED;

    return {
      ...responseMsg,
      data: response,
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    // console.log('error', err);
    return SERVER_ERROR;
  }
};

module.exports = useCase;
