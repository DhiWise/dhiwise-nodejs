/* global _ */
const { ROUTE_GENERATE_TYPE } = require('../../../models/constants/project');

const {
  OK, SERVER_ERROR,
} = require('../../../constants/message').message;

const ProjectRouteRepository = require('../../../repo/projectRoute');
const QueryBuilderRepository = require('../../../repo/queryBuilder');
const NestedQueryBuilderRepository = require('../../../repo/nestedQueryBuilder');
const ApplicationConfigRepository = require('../../../repo/applicationConfig');

const projectRouteRepo = new ProjectRouteRepository();
const queryBuilderRepo = new QueryBuilderRepository();
const nestedQueryBuilderRepo = new NestedQueryBuilderRepository();
const applicationConfigRepo = new ApplicationConfigRepository();

/**
 * Function used to update schema related details in `project-route`.
 * @param  {} {updatedSchema
 * @param  {} }
 */
async function updateProjectRoute ({
  oldSchema, updatedSchema,
}) {
  try {
    const filter = {
      find: {
        applicationId: updatedSchema.applicationId,
        modelId: updatedSchema._id,
      },
    };
    const routeData = await projectRouteRepo.getDetails(filter);
    if (routeData && routeData.length > 0) {
      await Promise.all(routeData.map(async (route) => {
        const updateData = {};
        if (route.type === ROUTE_GENERATE_TYPE.AUTO) {
          const updateRoute = route.route.replace(oldSchema.name.toLowerCase(), updatedSchema.name.toLowerCase());
          updateData.route = updateRoute;
        }
        updateData.groupName = updatedSchema.name;
        await projectRouteRepo.update(route._id, updateData);
      }));
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
 * Function used to update schema related details in `query-builder`.
 * @param  {} {updatedSchema
 * @param  {} }
 */
async function updateQueryBuilder ({ updatedSchema }) {
  try {
    const filter = {
      find: {
        applicationId: updatedSchema.applicationId,
        modelId: updatedSchema._id,
      },
    };
    const queryBuilderData = await queryBuilderRepo.getDetails(filter);
    if (queryBuilderData && queryBuilderData.length > 0) {
      const ids = _.map(queryBuilderData, '_id');
      const updateFilter = {
        filter: { find: { _id: ids } },
        data: { model: updatedSchema.name },
      };
      await queryBuilderRepo.updateMany(updateFilter);
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
 * Function used to update schema related details in `nested-query-builder`.
 * @param  {} {updatedSchema
 * @param  {} }
 */
async function updateNestedQueryBuilder ({ updatedSchema }) {
  try {
    const filter = {
      find: {
        applicationId: updatedSchema.applicationId,
        modelId: updatedSchema._id,
      },
    };
    const nQueryBuilderData = await nestedQueryBuilderRepo.getDetails(filter);
    if (nQueryBuilderData && nQueryBuilderData.length > 0) {
      const ids = _.map(nQueryBuilderData, '_id');
      const updateFilter = {
        filter: { find: { _id: ids } },
        data: { model: updatedSchema.name },
      };
      await nestedQueryBuilderRepo.updateMany(updateFilter);
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
 * Function used to update schema related details in `application-config`.
 * @param  {} {updatedSchema
 * @param  {} }
 */
async function updateApplicationConfig ({ updatedSchema }) {
  try {
    const appConfigFilter = {
      find: {
        applicationId: updatedSchema.applicationId,
        authModuleId: updatedSchema._id,
      },
    };
    const appConfig = await applicationConfigRepo.get(appConfigFilter);
    if (appConfig) {
      const appConfigUpdateData = { authModule: updatedSchema.name };
      await applicationConfigRepo.update(appConfig._id, appConfigUpdateData);
    }
    return OK;
  } catch (err) {
    return {
      ...SERVER_ERROR,
      data: err.toString(),
    };
  }
}

const updateSchemaReferences = async ({
  oldSchema, updatedSchema,
}) => {
  try {
    // Update model reference in `Project-Route`.
    const routeRes = await updateProjectRoute({
      oldSchema,
      updatedSchema,
    });
    if (routeRes?.code !== OK.code) {
      throw new Error(routeRes.data);
    }

    // Update model reference in `Query-Builder`.
    const queryBuilderRes = await updateQueryBuilder({ updatedSchema });
    if (queryBuilderRes?.code !== OK.code) {
      throw new Error(queryBuilderRes.data);
    }

    // Update model reference in `Nested-Query-Builder`.
    const nQueryBuilderRes = await updateNestedQueryBuilder({ updatedSchema });
    if (nQueryBuilderRes?.code !== OK.code) {
      throw new Error(nQueryBuilderRes.data);
    }

    // Update model reference in `Application-Config`.
    const appConfigRes = await updateApplicationConfig({ updatedSchema });
    if (appConfigRes?.code !== OK.code) {
      throw new Error(appConfigRes.data);
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

module.exports = updateSchemaReferences;
