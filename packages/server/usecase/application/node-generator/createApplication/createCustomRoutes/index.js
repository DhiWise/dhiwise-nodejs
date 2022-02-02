/* global  _ */
const {
  forEach, isEmpty, has,
} = require('lodash');
const replace = require('key-value-replace');
const writeOperations = require('../../writeOperations');
const common = require('../utils/common');

const getRandomInt = (max) => Math.floor(Math.random() * max);

const transformControllerDetailsWithQueryBuilder = (routes) => {
  let isQueryBuilderAvailable = false;
  // eslint-disable-next-line no-restricted-syntax
  for (const route of routes) {
    if (Object.prototype.hasOwnProperty.call(route, 'queryBuilder')) {
      if (route.queryBuilder.length) {
        isQueryBuilderAvailable = true;
        const modelGroup = [...new Set(route.queryBuilder.map((item) => item.model))];
        route.cq_model = modelGroup.filter(Boolean);
        // eslint-disable-next-line no-restricted-syntax
        for (const qb of route.queryBuilder) {
          if (qb.queryMode === 'find') {
            if (Object.prototype.hasOwnProperty.call(qb, 'select')) {
              qb.select = (qb.select).join(' ');
            }
            if (Object.prototype.hasOwnProperty.call(qb, 'populate')) {
              qb.populate = common.transformSelect(qb.populate);
            }
          }
          if (!qb.outputVariable || qb.outputVariable === '') {
            qb.outputVariable = `outputVar_${getRandomInt(10000)}`;
          }
          qb.queryVarName = `query_${getRandomInt(10000)}`;
        }
      }
    }
  }
  return {
    routes,
    isQueryBuilderAvailable,
  };
};

function doesConContainsPath (con, path) {
  const conPaths = Object.values(con);
  if (conPaths.includes(path)) return true;
  return false;
}

const makeCustomRoutes = async (makeCustomRouteObj) => {
  let shouldCopyQueryService = false;
  const packageDependencies = { dependencies: {} };
  // const PLATFORM = Object.keys(makeCustomRouteObj.platform);
  const PLATFORM = makeCustomRouteObj.platform;
  const {
    customRoutesPath, modelFolderPath, validationFolderPath,
  } = makeCustomRouteObj;
  const {
    routes, newModelConfig,
  } = makeCustomRouteObj;
  const finalCustomRoutes = {
    new: {},
    old: {},
  };
  const { models } = makeCustomRouteObj;
  const modelKey = Object.keys(models);
  const inputModel = Object.keys(models);

  // separate routes
  let routesWithModelAndPlatform = routes.apis.filter((route) => {
    if (!_.isEmpty(route.platform) && _.isEmpty(route.controllerFilePath) && _.isEmpty(route.routeFilePath)) {
      return true;
    }
    return false;
  });

  let routesWithCustomFilePath = routes.apis.filter((route) => {
    if (!_.isEmpty(route.controllerFilePath) && !_.isEmpty(route.routeFilePath) && !_.isEmpty(route.platform)) {
      return true;
    }
    return false;
  });
  routesWithCustomFilePath = routesWithCustomFilePath.filter(Boolean);

  routesWithModelAndPlatform = routesWithModelAndPlatform.filter(Boolean);
  routesWithModelAndPlatform = routesWithModelAndPlatform.filter((route) => {
    const modelConfigOfPlatform = newModelConfig[route.platform];
    const isModelConfigAvailable = has(modelConfigOfPlatform, route.model);
    if (!PLATFORM.includes(route.platform) || !modelKey.includes(route.controller) || !isModelConfigAvailable) {
      return true;
    }
    return false;
  });

  /*
   * const routesWithoutModel = routes.apis.filter((route) => {
   *   if (_.isEmpty(route.model)) {
   *     return true;
   *   }
   *   return false;
   * });
   * come here
   */

  /*
   * routes.apis = routes.apis.filter(Boolean);
   * api.route->map("controller")
   */
  const NEW_PLATFORM = [];
  if (!_.isEmpty(routesWithModelAndPlatform)) {
    const folderWise = _.groupBy(routesWithModelAndPlatform, 'platform');

    finalCustomRoutes.new.controllerNServiceNRoutes = {};
    finalCustomRoutes.new.routeIndex = {};
    finalCustomRoutes.old.controllerNServiceNRoutes = {};
    finalCustomRoutes.old.routeIndex = {};
    _.map(folderWise, (platformDetails, platform) => {
      if (!PLATFORM.includes(platform)) {
        finalCustomRoutes.new.controllerNServiceNRoutes[platform] = {};
        if (!NEW_PLATFORM.includes(platform)) {
          NEW_PLATFORM.push(platform);
        }
        const controllerGroup = _.groupBy(platformDetails, 'controller');
        const controllerPerPlatform = [];
        _.map(controllerGroup, (controllerDetails, controllerName) => {
          if (!controllerPerPlatform.includes(controllerName)) {
            controllerPerPlatform.push(controllerName);
          }
          const controller = writeOperations.loadTemplate(`${customRoutesPath}/controller.js`);
          const service = writeOperations.loadTemplate(`${customRoutesPath}/service.js`);
          const routesWithQueryMode = common.removeQueryBuilderWithoutQueryMode(controllerDetails, 'queryBuilder');
          const transformedControllerDetail = transformControllerDetailsWithQueryBuilder(_.cloneDeep(routesWithQueryMode));
          controller.locals.ROUTES = transformedControllerDetail.routes;
          const [UNIQ_TASK_MODELS, UNIQ_REQUIRE_VALIDATION_MODELS] = common.getUniqModelsFromTasks(transformedControllerDetail.routes, 'queryBuilder');
          [controller.locals.UNIQ_TASK_MODELS, controller.locals.UNIQ_REQUIRE_VALIDATION_MODELS] = [UNIQ_TASK_MODELS, UNIQ_REQUIRE_VALIDATION_MODELS];
          controller.locals.IS_CQ = transformedControllerDetail.isQueryBuilderAvailable;
          controller.locals.platform = platform;
          controller.locals.path = makeCustomRouteObj.generatedCustomRouteControllerPath;
          if (transformedControllerDetail.isQueryBuilderAvailable) shouldCopyQueryService = true;
          controller.locals.SERVICES = _.uniqBy(transformedControllerDetail.routes, 'service');
          controller.locals.SERVICE_NAME_FC = controllerName.charAt(0).toUpperCase() + controllerName.slice(1);
          service.locals.ROUTES = transformedControllerDetail.routes;
          finalCustomRoutes.new.controllerNServiceNRoutes[platform] = {};
          finalCustomRoutes.new.controllerNServiceNRoutes[platform][controllerName] = {
            controller,
            service,
          };
          const routeWithoutModel = controllerDetails.filter((cr) => {
            if (!_.isEmpty(cr.model)) {
              if (!inputModel.includes(cr.model)) {
                return true;
              }
              return false;
            }
            return false;
          });

          if (!_.isEmpty(routeWithoutModel)) {
            const route = writeOperations.loadTemplate(`${customRoutesPath}/route.js`);
            route.locals.POLICIES = common.getPolicyForCustomRoutes(routeWithoutModel);
            route.locals.PLATFORM = platform;
            route.locals.ROUTES = transformedControllerDetail.routes;
            route.locals.IMPORT = transformedControllerDetail.routes;
            route.locals.SERVICE_NAME = controllerName;
            finalCustomRoutes.new.controllerNServiceNRoutes[platform][controllerName] = {
              ...finalCustomRoutes.new.controllerNServiceNRoutes[platform][controllerName],
              route,
            };
          }
        });

        const indexRoute = writeOperations.loadTemplate(`${customRoutesPath}/platformIndexRoutes.js`);
        indexRoute.locals.CONTROLLERS = controllerPerPlatform;
        indexRoute.locals.PLATFORM = platform.toLowerCase();
        finalCustomRoutes.new.routeIndex[platform] = { indexRoute };
      } else {
        finalCustomRoutes.old.controllerNServiceNRoutes[platform] = {};
        const controllerGroup = _.groupBy(platformDetails, 'controller');
        const controllerPerPlatform = [];
        _.map(controllerGroup, (controllerDetails, controllerName) => {
          if (!controllerPerPlatform.includes(controllerName)) {
            controllerPerPlatform.push(controllerName);
          }
          const controller = writeOperations.loadTemplate(`${customRoutesPath}/controller.js`);
          const service = writeOperations.loadTemplate(`${customRoutesPath}/service.js`);
          // const route = writeOperations.loadTemplate(`${customRoutesPath}/route.js`);
          const routesWithQueryMode = common.removeQueryBuilderWithoutQueryMode(controllerDetails, 'queryBuilder');
          const transformedControllerDetail = transformControllerDetailsWithQueryBuilder(_.cloneDeep(routesWithQueryMode));
          controller.locals.ROUTES = transformedControllerDetail.routes;
          const [UNIQ_TASK_MODELS, UNIQ_REQUIRE_VALIDATION_MODELS] = common.getUniqModelsFromTasks(transformedControllerDetail.routes, 'queryBuilder');
          [controller.locals.UNIQ_TASK_MODELS, controller.locals.UNIQ_REQUIRE_VALIDATION_MODELS] = [UNIQ_TASK_MODELS, UNIQ_REQUIRE_VALIDATION_MODELS];
          controller.locals.IS_CQ = transformedControllerDetail.isQueryBuilderAvailable;
          controller.locals.platform = platform;
          controller.locals.path = makeCustomRouteObj.generatedCustomRouteControllerPath;
          if (transformedControllerDetail.isQueryBuilderAvailable) shouldCopyQueryService = true;
          controller.locals.SERVICES = _.uniqBy(transformedControllerDetail.routes, 'service');
          controller.locals.SERVICE_NAME_FC = controllerName.charAt(0).toUpperCase() + controllerName.slice(1);
          service.locals.ROUTES = transformedControllerDetail.routes;
          if (isEmpty(finalCustomRoutes.old.controllerNServiceNRoutes[platform])) {
            finalCustomRoutes.old.controllerNServiceNRoutes[platform] = {};
          }
          // finalCustomRoutes.new.controllerNServiceNRoutes[platform] = {};
          Object.assign(finalCustomRoutes.old.controllerNServiceNRoutes[platform], {
            [controllerName]: {
              controller,
              service,
            },
          });
          // finalCustomRoutes.new.controllerNServiceNRoutes[platform][controllerName] = { controller, service };
          const routeWithoutModel = controllerDetails.filter((cr) => {
            if (!_.isEmpty(cr.model)) {
              if (!inputModel.includes(cr.model)) {
                return true;
              }
              return false;
            }
            return true;
          });
          if (!_.isEmpty(routeWithoutModel)) {
            const route = writeOperations.loadTemplate(`${customRoutesPath}/route.js`);
            route.locals.POLICIES = common.getPolicyForCustomRoutes(routeWithoutModel);
            route.locals.PLATFORM = platform;
            route.locals.ROUTES = transformedControllerDetail.routes;
            route.locals.IMPORT = transformedControllerDetail.routes;
            route.locals.SERVICE_NAME = controllerName;
            finalCustomRoutes.old.controllerNServiceNRoutes[platform][controllerName] = {
              ...finalCustomRoutes.old.controllerNServiceNRoutes[platform][controllerName],
              route,
            };
          }
        });

        finalCustomRoutes.old.routeIndex[platform] = { platformExistIndexRoutes: _.uniqBy(platformDetails, 'controller') };
      }
    });
  }

  // handling custom routes having custom file path
  const customRoutesWithPath = {};
  if (!_.isEmpty(routesWithCustomFilePath)) {
    // controller
    const controllers = {};
    const groupByControllerPath = _.groupBy(routesWithCustomFilePath, 'controllerFilePath');
    forEach(groupByControllerPath, (routes2, controllerFilePath) => {
      const groupByControllerFile = _.groupBy(routes2, 'controllerFileName');
      let controllerFiles = [];
      forEach(groupByControllerFile, (route3, controllerFile) => {
        const controller = writeOperations.loadTemplate(`${customRoutesPath}/controller.js`);
        const routesWithQueryMode = common.removeQueryBuilderWithoutQueryMode(route3, 'queryBuilder');
        const transformedControllerDetail = transformControllerDetailsWithQueryBuilder(_.cloneDeep(routesWithQueryMode));
        controller.locals.ROUTES = transformedControllerDetail.routes;
        const [UNIQ_TASK_MODELS, UNIQ_REQUIRE_VALIDATION_MODELS] = common.getUniqModelsFromTasks(transformedControllerDetail.routes, 'queryBuilder');
        const MODEL_PATHS = common.getRelativePaths(UNIQ_TASK_MODELS, `${modelFolderPath}`, `${controllerFilePath}/${controllerFile}.js`, makeCustomRouteObj.destinationFolder);
        const VALIDATION_PATHS = common.getRelativePaths(UNIQ_REQUIRE_VALIDATION_MODELS, `${validationFolderPath}`, `${controllerFilePath}/${controllerFile}.js`, makeCustomRouteObj.destinationFolder);
        controller.locals.MODEL_PATHS = MODEL_PATHS;
        controller.locals.VALIDATION_PATH = VALIDATION_PATHS;
        controller.locals.IS_CQ = transformedControllerDetail.isQueryBuilderAvailable;
        controller.locals.path = controllerFilePath;
        controller.locals.name = controllerFile;
        if (transformedControllerDetail.isQueryBuilderAvailable) shouldCopyQueryService = true;
        controllerFiles.push(controller);
      });
      Object.assign(controllers, { [controllerFilePath]: controllerFiles });
      controllerFiles = [];
    });
    customRoutesWithPath.controllers = controllers;

    // routes
    const routesC = {};
    const customRoutesInIndex = [];
    const groupByRoutePath = _.groupBy(routesWithCustomFilePath, 'routeFilePath');
    forEach(groupByRoutePath, (r, routeFilePath) => {
      // const routePath = `${routeFilePath}`;
      const groupByRouteFileName = _.groupBy(r, 'routeFileName');
      const routeFileNames = [...new Set(Object.keys(groupByRouteFileName))];
      for (let i = 0; i < routeFileNames.length; i += 1) {
        const p2 = `${routeFilePath}/${routeFileNames[i]}`;
        const p = common.createRelativePathFromAbsolutePath(`${makeCustomRouteObj.destinationFolder}${makeCustomRouteObj.routeFolderPath}/index.js`, `${makeCustomRouteObj.destinationFolder}${p2}`);
        customRoutesInIndex.push(p);
      }
      let routeFiles = [];

      forEach(groupByRouteFileName, (r2, routeFile) => {
        const route = writeOperations.loadTemplate(`${customRoutesPath}/route.js`);
        route.locals.POLICIES = common.getPolicyForCustomRoutes(r2);
        const con = {};
        // const allImportPaths=[]
        forEach(r2, (r1) => {
          const currentFile = `${makeCustomRouteObj.destinationFolder}${r1.controllerFilePath}/${r1.controllerFileName}.js`;
          const destinationFile = `${makeCustomRouteObj.destinationFolder}${r1.routeFilePath}/${r1.routeFileName}.js`;
          const path = common.createRelativePathFromAbsolutePath(destinationFile, currentFile);
          // allImportPaths.push(path)
          let obj = { [r1.controllerFileName]: path };
          if (`${r1.controllerFileName}` in con && !doesConContainsPath(con, path)) {
            // const originalControllerFileName=r1.controllerFileName
            r1.controllerFileName = `${r1.controllerFileName}${common.getRandomIntByMax(1000)}`;
            obj = { [r1.controllerFileName]: path };
          }
          Object.assign(con, obj);
        });
        route.locals.ROUTES = r2;
        route.locals.CONTROLLER_IMPORTS = con;
        route.locals.name = routeFile;
        routeFiles.push(route);
      });
      Object.assign(routesC, { [routeFilePath]: routeFiles });
      routeFiles = [];
    });
    customRoutesWithPath.routes = routesC;
    customRoutesWithPath.mainIndexRoute = customRoutesInIndex;
  }

  if (NEW_PLATFORM.length) {
    finalCustomRoutes.new.platform = NEW_PLATFORM;
  }

  // route index where model was not there
  const customRouteIndex = routes.apis.filter((route) => route.createNewFile);
  const customRouteByPlatform = _.groupBy(customRouteIndex, 'platform');
  return [finalCustomRoutes, shouldCopyQueryService, packageDependencies, customRoutesWithPath, customRouteByPlatform];
};

const makeControllerIndexForCustomRoutes = (makeCustomRouteObj, userDirectoryStructure) => {
  const PLATFORM = makeCustomRouteObj.platform;
  const { customRoutesPath } = makeCustomRouteObj;
  const { routes } = makeCustomRouteObj;
  const { models } = makeCustomRouteObj;
  const modelKey = Object.keys(models);
  routes.apis = routes.apis.map((route) => {
    if (!PLATFORM.includes(route.platform) || !modelKey.includes(route.controller)) {
      return route;
    }
    return undefined;
  });
  routes.apis = routes.apis.filter(Boolean);
  const folderWise = _.groupBy(routes.apis, 'platform');
  const controllerIndexes = [];
  let controllerPath = '';
  _.map(folderWise, (platformDetails, platform) => {
    const controllerGroup = _.groupBy(platformDetails, 'controller');
    _.map(controllerGroup, (controllerDetails, controllerName) => {
      const controllerIndex = writeOperations.loadTemplate(`${customRoutesPath}/controllerIndex.js`);
      const routesWithQueryMode = common.removeQueryBuilderWithoutQueryMode(controllerDetails, 'queryBuilder');
      const transformedControllerDetail = common.transformControllerDetailsWithQueryBuilder(_.cloneDeep(routesWithQueryMode));
      const [UNIQ_TASK_MODELS, UNIQ_REQUIRE_VALIDATION_MODELS] = common.getUniqModelsFromTasks(_.cloneDeep(transformedControllerDetail.routes), 'queryBuilder');
      [controllerIndex.locals.UNIQ_TASK_MODELS, controllerIndex.locals.UNIQ_REQUIRE_VALIDATION_MODELS] = [UNIQ_TASK_MODELS, UNIQ_REQUIRE_VALIDATION_MODELS];
      controllerIndex.locals.SERVICE_NAME = controllerName;
      controllerIndex.locals.SERVICE_NAME_FC = controllerName.charAt(0).toUpperCase() + controllerName.slice(1);
      controllerIndex.locals.PLATFORM = platform;
      controllerIndex.locals.CONTROLLER = controllerName;
      controllerIndex.locals.IS_CQ = transformedControllerDetail.isQueryBuilderAvailable;
      controllerIndex.locals.ROUTES = transformedControllerDetail.routes;
      controllerPath = userDirectoryStructure.generatedCustomRouteControllerPath;
      controllerPath = replace(controllerPath, {
        platform,
        controller: controllerName,
      });
      const controllerFolderPath = controllerPath.substring(0, controllerPath.lastIndexOf('/'));
      const controllerIndexFilePath = `${controllerFolderPath}/index.js`;
      controllerIndex.locals.indexPath = controllerIndexFilePath;
      controllerIndex.locals.controllerFolder = controllerFolderPath;

      controllerIndex.locals.DATA_ACCESS_PATH = common.getImportPath(controllerFolderPath, userDirectoryStructure.dataAccessFolderPath);
      controllerIndex.locals.VALIDATION_PATH = common.getImportPath(controllerFolderPath, userDirectoryStructure.validationFolderPath);
      controllerIndex.locals.USECASE_PATH = common.getImportPath(controllerFolderPath, userDirectoryStructure.useCaseFolderPath);
      controllerIndexes.push(controllerIndex);
    });
  });
  return controllerIndexes;
};

const makeServiceForNonExistingService = async (makeCustomRouteObj) => {
  const { customRoutesPath } = makeCustomRouteObj;
  const { routes } = makeCustomRouteObj;
  const { models } = makeCustomRouteObj;
  const modelKey = Object.keys(models);
  routes.apis = routes.apis.map((route) => {
    if (modelKey.includes(route.controller)) {
      return route;
    }
    return undefined;
  });
  routes.apis = routes.apis.filter(Boolean);
  const folderWise = _.groupBy(routes.apis, 'platform');
  const services = [];
  _.map(folderWise, (platformDetails, platform) => {
    const controllerGroup = _.groupBy(platformDetails, 'controller');
    _.map(controllerGroup, (controllerDetails, controllerName) => {
      const service = writeOperations.loadTemplate(`${customRoutesPath}/service.js`);
      const routesWithQueryMode = common.removeQueryBuilderWithoutQueryMode(controllerDetails, 'queryBuilder');
      service.locals.ROUTES = routesWithQueryMode;
      service.locals.SERVICE_NAME = controllerName;
      service.locals.SERVICE_NAME_FC = controllerName.charAt(0).toUpperCase() + controllerName.slice(1);
      service.locals.PLATFORM = platform;
      service.locals.CONTROLLER = controllerName;
      services.push(service);
    });
  });
  return services;
};

const makeCustomRoutesUsecase = async (customRouteObj) => {
  const {
    customRoutes, models, userDirectoryStructure, templateRegistry, templateFolderName,
  } = customRouteObj;
  let modelNames = [];
  const useCaseForCustomRoutes = [];
  if (!_.isEmpty(models)) {
    modelNames = Object.keys(models);
  }
  let useCaseFolderPath = '';
  let useCaseFilePath = '';
  let modelName = '';
  _.forEach(customRoutes, (customRoute) => {
    if (!_.isEmpty(customRoute.model) && modelNames.includes(customRoute.model)) {
      modelName = customRoute.model;
      useCaseFilePath = replace(userDirectoryStructure.useCaseFilePath, {
        model: customRoute.model,
        fileName: customRoute.functionName,
      });
      useCaseFolderPath = (useCaseFilePath).substring(0, (useCaseFilePath).lastIndexOf('/'));
    } else {
      modelName = '';
      useCaseFilePath = replace(userDirectoryStructure.useCaseFilePath, {
        model: 'customRoutes',
        fileName: customRoute.functionName,
      });
      useCaseFolderPath = (useCaseFilePath).substring(0, (useCaseFilePath).lastIndexOf('/'));
    }
    const useCase = writeOperations.loadTemplate(`${templateFolderName}${templateRegistry.useCaseFolderPath}/customRouteOfModel.js`);
    useCase.locals.FUNCTION_NAME = customRoute.functionName;
    useCase.locals.MODEL_NAME = modelName;
    useCase.locals.path = useCaseFilePath;
    useCase.locals.folderPath = useCaseFolderPath;
    const queryBuilderForModel = customRoute.queryBuilder?.length ? customRoute.queryBuilder.filter((q) => q.queryMode === 'find') : [];
    useCase.locals.MODELS = [...new Set(queryBuilderForModel.map((q) => `${q.model}Db`))];
    useCase.locals.QUERY = queryBuilderForModel;
    useCaseForCustomRoutes.push(useCase);
  });
  return useCaseForCustomRoutes;
};

module.exports = {
  makeCustomRoutes,
  makeControllerIndexForCustomRoutes,
  makeServiceForNonExistingService,
  makeCustomRoutesUsecase,
};
