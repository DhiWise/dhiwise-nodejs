/* global  _ */
const mongoose = require('mongoose');
const {
  INVALID_REQUEST_PARAMS, OK, SERVER_ERROR,
} = require('../../constants/message').message;
const { TYPES } = require('../../constants/queryBuilder');
const QueryBuilderRepository = require('../../repo/queryBuilder');
const SchemaDetailRepository = require('../../repo/schemaDetail');
const NestedQueryBuilderRepository = require('../../repo/nestedQueryBuilder');

const QueryBuilderRepo = new QueryBuilderRepository();
const schemaDetailRepo = new SchemaDetailRepository();
const nestedQueryBuilderRepo = new NestedQueryBuilderRepository();

/**
 * Function used to get query-builder data.
 * @param  {} {listData
 * @param  {} applicationId
 * @param  {} projectRouteIds
 * @param  {} }
 */
async function getQueryBuilderDetails ({
  listData, applicationId, projectRouteIds,
}) {
  const queryInput = {
    find: {
      applicationId,
      referenceId: projectRouteIds,
      referenceType: TYPES.ROUTES,
    },
  };
  let queryBuilderData = await QueryBuilderRepo.getDetails(queryInput);
  if (queryBuilderData && _.size(queryBuilderData) > 0) {
    queryBuilderData = _.map(queryBuilderData, (val) => {
      val = _.omit(val, ['createdAt', 'updatedAt', 'addedBy', 'updatedBy', 'isActive', 'isDeleted']);
      return val;
    });
    queryBuilderData = _.cloneDeep(_.groupBy(queryBuilderData, 'referenceId'));
    _.each(listData, (val) => {
      val.queryBuilder = queryBuilderData[val._id];
    });
  }
  return listData;
}

/**
 * Function used to get nested-query-builder-data.
 * @param  {} {listData
 * @param  {} applicationId
 * @param  {} projectRouteIds
 * @param  {} }
 */
async function getNestedQueryBuilderDetails ({
  listData, applicationId, projectRouteIds,
}) {
  const queryInput = {
    find: {
      applicationId,
      referenceId: projectRouteIds,
      referenceType: TYPES.ROUTES,
    },
  };
  let nqBuilderData = await nestedQueryBuilderRepo.getDetails(queryInput);
  if (nqBuilderData && _.size(nqBuilderData) > 0) {
    nqBuilderData = _.map(nqBuilderData, (val) => {
      val = _.omit(val, ['createdAt', 'updatedAt', 'addedBy', 'updatedBy', 'isActive', 'isDeleted']);
      return val;
    });
    nqBuilderData = _.cloneDeep(_.groupBy(nqBuilderData, 'referenceId'));
    _.each(listData, (val) => {
      val.nestedQueryBuilder = nqBuilderData[val._id];
    });
  }
  return listData;
}

const paginate = (projectRouteRepo) => async (param) => {
  try {
    let params = param;
    if (!params) {
      params = {};
    }

    if (!params.applicationId) {
      return INVALID_REQUEST_PARAMS;
    }
    if (params.applicationId) {
      const isValidId = mongoose.Types.ObjectId.isValid(params.applicationId);
      if (!isValidId) {
        return INVALID_REQUEST_PARAMS;
      }
    }

    /*
     * params = {
     *     fields: "",
     *     find: {},
     *     page: 1,
     *     limit: 1
     * }
     */
    if (!params.find) {
      params.find = {};
    }
    params.find.applicationId = params.applicationId;
    const filter = params;
    let list = await projectRouteRepo.getDetails(filter);

    if (list && _.size(list) > 0) {
      const projectRouteIds = _.map(list, '_id');
      // Get query-builder details.
      list = await getQueryBuilderDetails({
        listData: list,
        applicationId: params.applicationId,
        projectRouteIds,
      });

      // Get nested-query-builder details.
      list = await getNestedQueryBuilderDetails({
        listData: list,
        applicationId: params.applicationId,
        projectRouteIds,
      });

      // Get schemaDetails data.
      const modelsIds = _.map(list, 'modelId');
      const schemaDetailsData = await schemaDetailRepo.getDetails({ find: { schemaId: modelsIds } });
      if (schemaDetailsData && schemaDetailsData.length > 0) {
        _.map(list, (route) => {
          const scDetails = _.find(schemaDetailsData, { schemaId: route.modelId });
          if (scDetails) {
            route.permissionData = _.pick(scDetails, ['_id', 'schemaJson', 'additionalJson']);
          }
        });
      }
    }

    list = _.cloneDeep(_.orderBy(list, ['createdAt'], ['desc']));
    const response = {
      list,
      count: await projectRouteRepo.getCount(filter),
    };
    return {
      ...OK,
      data: response,
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    // console.log('error', err);
    return SERVER_ERROR;
  }
};
module.exports = paginate;
