const {
  INVALID_REQUEST_PARAMS, SERVER_ERROR, ROUTE_DELETED, OK,
} = require('../../constants/message').message;
const projectApplicationUpdate = require('../common/projectApplicationUpdate');
const { TYPES } = require('../../constants/queryBuilder');
const QueryBuilderRepository = require('../../repo/queryBuilder');
const NestedQueryBuilderRepository = require('../../repo/nestedQueryBuilder');

const queryBuilderRepo = new QueryBuilderRepository();
const nestedQueryBuilderRepo = new NestedQueryBuilderRepository();

const deleteMany = (projectRouteRepo, applicationRepo) => async (filter, isHardDelete = false) => {
  try {
    if (!filter) return INVALID_REQUEST_PARAMS;
    const response = await projectRouteRepo.getDetails(filter);
    if (response && response.length) {
      const application = await applicationRepo.get({
        filter: { find: { _id: response?.[0]?.applicationId } },
        fields: ['isArchive', 'projectId'],
      });

      if (isHardDelete) {
        // Delete query-builder
        await queryBuilderRepo.deleteMany({
          find: {
            referenceId: filter.find._id,
            referenceType: TYPES.ROUTES,
          },
        });
        await nestedQueryBuilderRepo.deleteMany({
          find: {
            referenceId: filter.find._id,
            referenceType: TYPES.ROUTES,
          },
        });
        await projectRouteRepo.deleteMany(filter);
      } else {
        // `Soft-delete` query-builder data.
        const updateQueryBuilderData = {
          filter: {
            find: {
              referenceId: filter.find._id,
              referenceType: TYPES.ROUTES,
            },
          },
          data: { isDeleted: true },
        };
        await queryBuilderRepo.updateMany(updateQueryBuilderData);
        // `Soft-delete` nested-query-builder data.
        const updateNestedQueryBuilderData = {
          filter: {
            find: {
              referenceId: filter.find._id,
              referenceType: TYPES.ROUTES,
            },
          },
          data: { isDeleted: true },
        };
        await nestedQueryBuilderRepo.updateMany(updateNestedQueryBuilderData);
        // `Soft-delete` project-route.
        const updateData = {
          filter,
          data: { isDeleted: true },
        };
        await projectRouteRepo.updateMany(updateData);
      }
      projectApplicationUpdate({
        params: {
          applicationId: response?.[0]?.applicationId,
          projectId: application?.projectId,
        },
      });
    }

    let responseMsg = OK;
    responseMsg = ROUTE_DELETED;

    return {
      ...responseMsg,
      data: null,
    };
  } catch (err) {
    // console.log('error', err);
    return SERVER_ERROR;
  }
};

module.exports = deleteMany;
