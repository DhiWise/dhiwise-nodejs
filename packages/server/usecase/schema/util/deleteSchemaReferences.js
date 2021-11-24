/* global _ */
const {
  OK, SERVER_ERROR,
} = require('../../../constants/message').message;

const ProjectRouteRepository = require('../../../repo/projectRoute');
const QueryBuilderRepository = require('../../../repo/queryBuilder');
const NestedQueryBuilderRepository = require('../../../repo/nestedQueryBuilder');
const SchemaDetailRepository = require('../../../repo/schemaDetail');

const projectRouteRepo = new ProjectRouteRepository();
const queryBuilderRepo = new QueryBuilderRepository();
const nestedQueryBuilderRepo = new NestedQueryBuilderRepository();
const schemaDetailRepo = new SchemaDetailRepository();

/**
 * Function used to delete schema related details in `project-route`.
 * @param  {} {schemaData
 * @param  {} isHardDelete
 * @param  {} }
 */
async function delProjectRoute ({
  schemaData, isHardDelete,
}) {
  try {
    const filter = {
      find: {
        applicationId: schemaData.applicationId,
        modelId: schemaData._id,
      },
    };
    const routeData = await projectRouteRepo.getDetails(filter);
    if (routeData && routeData.length > 0) {
      const ids = _.map(routeData, '_id');
      if (isHardDelete) {
        await projectRouteRepo.deleteMany({ find: { _id: ids } });
      } else {
        const updateFilter = {
          filter: { find: { _id: ids } },
          data: { isDeleted: true },
        };
        await projectRouteRepo.updateMany(updateFilter);
      }
    }
    return OK;
  } catch (err) {
    return {
      ...SERVER_ERROR,
      data: err.toString(),
    };
  }
}

/**
 * Function used to delete schema related details in `query-builder`.
 * @param  {} {schemaData
 * @param  {} isHardDelete
 * @param  {} }
 */
async function delQueryBuilder ({
  schemaData, isHardDelete,
}) {
  try {
    const filter = {
      find: {
        applicationId: schemaData.applicationId,
        modelId: schemaData._id,
      },
    };
    const queryBuilderData = await queryBuilderRepo.getDetails(filter);
    if (queryBuilderData && queryBuilderData.length > 0) {
      const ids = _.map(queryBuilderData, '_id');
      if (isHardDelete) {
        await queryBuilderRepo.deleteMany({ find: { _id: ids } });
      } else {
        const updateFilter = {
          filter: { find: { _id: ids } },
          data: { isDeleted: true },
        };
        await queryBuilderRepo.updateMany(updateFilter);
      }
    }
    return OK;
  } catch (err) {
    return {
      ...SERVER_ERROR,
      data: err.toString(),
    };
  }
}

/**
 * Function used to delete schema related details in `nested-query-builder`.
 * @param  {} {schemaData
 * @param  {} isHardDelete
 * @param  {} }
 */
async function delNestedQueryBuilder ({
  schemaData, isHardDelete,
}) {
  try {
    const filter = {
      find: {
        applicationId: schemaData.applicationId,
        modelId: schemaData._id,
      },
    };
    const nQueryBuilderData = await nestedQueryBuilderRepo.getDetails(filter);
    if (nQueryBuilderData && nQueryBuilderData.length > 0) {
      const ids = _.map(nQueryBuilderData, '_id');
      if (isHardDelete) {
        await nestedQueryBuilderRepo.deleteMany({ find: { _id: ids } });
      } else {
        const updateFilter = {
          filter: { find: { _id: ids } },
          data: { isDeleted: true },
        };
        await nestedQueryBuilderRepo.updateMany(updateFilter);
      }
    }
    return OK;
  } catch (err) {
    return {
      ...SERVER_ERROR,
      data: err.toString(),
    };
  }
}

/**
 * Function used to delete schema related details in `schema-details`.
 * @param  {} {schemaData
 * @param  {} isHardDelete
 * @param  {} }
 */
async function deleteSchemaDetails ({
  schemaData, isHardDelete,
}) {
  try {
    const filter = { find: { schemaId: schemaData._id } };
    const schemaDetails = await schemaDetailRepo.getDetails(filter);
    if (schemaDetails && schemaDetails.length > 0) {
      const ids = _.map(schemaDetails, '_id');
      if (isHardDelete) {
        await schemaDetailRepo.deleteMany({ find: { _id: ids } });
      } else {
        const updateFilter = {
          filter: { find: { _id: ids } },
          data: { isDeleted: true },
        };
        await schemaDetailRepo.updateMany(updateFilter);
      }
    }
    return OK;
  } catch (err) {
    return {
      ...SERVER_ERROR,
      data: err.toString(),
    };
  }
}

const deleteSchemaReferences = async ({
  schemaData, isHardDelete,
}) => {
  try {
    // Delete schema reference in `Project-Route`.
    const routeRes = await delProjectRoute({
      schemaData,
      isHardDelete,
    });
    if (routeRes?.code !== OK.code) {
      throw new Error(routeRes.data);
    }

    // Delete schema reference in `Query-Builder`.
    const queryBuilderRes = await delQueryBuilder({
      schemaData,
      isHardDelete,
    });
    if (queryBuilderRes?.code !== OK.code) {
      throw new Error(queryBuilderRes.data);
    }

    // Delete schema reference in `Nested-Query-Builder`.
    const nQueryBuilderRes = await delNestedQueryBuilder({
      schemaData,
      isHardDelete,
    });
    if (nQueryBuilderRes?.code !== OK.code) {
      throw new Error(nQueryBuilderRes.data);
    }

    // Delete schema reference in `Schema-Details`.
    const schemaDetailsRes = await deleteSchemaDetails({
      schemaData,
      isHardDelete,
    });
    if (schemaDetailsRes?.code !== OK.code) {
      throw new Error(schemaDetailsRes.data);
    }

    return OK;
  } catch (err) {
    // console.log('err: ', err);
    return {
      ...SERVER_ERROR,
      data: err.toString(),
    };
  }
};

module.exports = deleteSchemaReferences;
