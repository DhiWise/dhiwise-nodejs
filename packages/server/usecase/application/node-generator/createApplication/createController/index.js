/* eslint-disable linebreak-style */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const {
  isEmpty, cloneDeep, forEach, groupBy, uniq,
} = require('lodash');
const writeOperations = require('../../writeOperations');
const commonService = require('../utils/common');
const {
  APIS, ORM_PROVIDERS,
} = require('../../constants/constant');
const { getSQLRelationshipDependencies } = require('../getDeleteDependency');

async function getFieldSelection (model, platform, fieldSelectionObj) {
  let fieldSelection = false;
  if (!isEmpty(fieldSelectionObj) && !isEmpty(fieldSelectionObj[platform]) && !isEmpty(fieldSelectionObj[platform][model])) {
    forEach(fieldSelectionObj[platform][model], (value, key) => {
      if (APIS.includes(key) && value.selected) {
        fieldSelection = fieldSelectionObj[platform][model];
      }
    });
  }
  return fieldSelection;
}
async function getNotification (model, modelNotifications) {
  let notificationObj = false;
  if (!isEmpty(modelNotifications) && !isEmpty(modelNotifications[model])) {
    forEach(modelNotifications[model], (value, key) => {
      if (APIS.includes(key) && value.selected) {
        notificationObj = modelNotifications[model];
      }
    });
  }
  return notificationObj;
}

async function individualNotification (notificationObj) {
  const notification = {};
  let email = []; let sms = []; let webNotification = [];
  forEach(notificationObj, (val) => {
    email.push(val.post ? val.post.email === true : val.pre.email === true);
    sms.push(val.post ? val.post.sms === true : val.pre.sms === true);
    webNotification.push(val.post ? val.post.webNotification === true : val.pre.webNotification === true);
  });
  email = email.filter((e) => e === true);
  sms = sms.filter((e) => e === true);
  webNotification = webNotification.filter((e) => e === true);
  if (email.length) Object.assign(notification, { email: true });
  if (sms.length) Object.assign(notification, { sms: true });
  if (webNotification.length) Object.assign(notification, { webNotification: true });
  return notification;
}

async function getDeleteDependentModel (model, deleteDependency) {
  let deleteModels = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const k in deleteDependency) {
    if (k === model) {
      deleteModels = deleteDependency[k];
      break;
    } else {
      deleteModels = [];
    }
  }
  return deleteModels;
}

const getRandomInt = (max) => Math.floor(Math.random() * max);

const transformRouteWithQueryBuilder = async (routes) => {
  forEach(routes, async (route) => {
    if (route.method === 'customQuery') {
      if (Object.prototype.hasOwnProperty.call(route, 'select')) {
        route.select = (route.select).join(' ');
      }
      if (!route.outputVariable || route.outputVariable === '') {
        route.outputVariable = `outputVar_${getRandomInt(100000)}`;
      }
      route.queryVarName = `query_${getRandomInt(100000)}`;
      if (Object.prototype.hasOwnProperty.call(route, 'populate')) {
        route.populate = commonService.transformSelect(route.populate);
      }
    }
  });
  return { routes };
};

async function findAndTransformQueryBuilderInNestedCall (nestedCall) {
  forEach(nestedCall, async (nestedCallArray, preAndPost) => {
    const temp = await transformRouteWithQueryBuilder(nestedCallArray);
    nestedCall[preAndPost] = temp.routes;
  });
  return nestedCall;
}

async function generateController (apis, platformName, controllers, ormProvider, models) {
  const returnController = {};
  const packageDependencies = { dependencies: {} };
  const customRoutes = (controllers?.jsonData?.routes?.apis?.length) ? controllers.jsonData.routes.apis : [];
  const customRoutesOfPlatform = groupBy(customRoutes, 'platform')[platformName];

  for (const [model, element] of Object.entries(apis)) {
    if (!isEmpty(element)) {
      const isFieldSelection = await getFieldSelection(model, platformName, controllers.jsonData.fieldSelection);
      const deleteDependency = await getDeleteDependentModel(model, controllers.deleteDependency);
      const controllerName = model;
      const customRoutesOfModel = groupBy(customRoutesOfPlatform, 'controller')[controllerName];
      const api = writeOperations.loadTemplate(`${controllers.controllerFilePath}/controller.js`);
      api.locals.path = controllers.controllerGeneratedPath;
      if (controllers.auth.isAuth && controllers.auth.userModel === model) {
        api.locals.USER_MODEL = true;
      }
      api.locals.VIRTUAL = controllers.jsonData.virtualRelationship?.[model];
      api.locals.SUPPORT_API = [];
      if (controllers.auth.isAuth && controllers.auth.userModel === model) {
        api.locals.IS_AUTH = true;
      } else {
        api.locals.IS_AUTH = false;
      }
      api.locals.DB_MODEL = model;
      api.locals.DB_MODEL_FC = model.charAt(0).toUpperCase() + model.slice(1);
      api.locals.DELETE_DEPENDENT_MODEL = deleteDependency.length ? deleteDependency : false;

      for (const [key, value] of Object.entries(element)) {
        if (APIS.includes(key) && value.selected) {
          const apiObject = {
            method: key,
            isAuth: value.isAuth,

          };
          let associatedSqlModels = {};
          if (key === 'findAll' && ormProvider === ORM_PROVIDERS.SEQUELIZE) {
            // ? find sql relationships
            associatedSqlModels = getSQLRelationshipDependencies(models);
          }
          let associatedModelsArray = [];
          if (Object.keys(associatedSqlModels).length > 0) {
            Object.keys(associatedSqlModels).forEach((m) => {
              associatedModelsArray.push(m);
            });
          }

          if (associatedModelsArray.length > 0) {
            associatedModelsArray = associatedModelsArray.filter((d) => d !== model);
            api.locals.ASSOCIATED_MODELS = associatedModelsArray;
          }

          // ? for field selection
          if (isFieldSelection && Object.keys(isFieldSelection).includes(key)) {
            Object.assign(apiObject, {
              fieldSelection: true,
              fields: isFieldSelection[key].fields,
            });
          } else {
            Object.assign(apiObject, { fieldSelection: false });
          }

          // ? filter By LoggedInUser
          Object.assign(apiObject, {
            isLogin: value.isAuth && controllers.auth.isAuth,
            addedBy: 'addedBy',
            login: controllers.auth.userModel,
          });

          // ? nested calls for particular API
          if (controllers.jsonData.nestedCall && controllers.jsonData.nestedCall[platformName] && (controllers.jsonData.nestedCall[platformName][model])) {
            if ((controllers.jsonData.nestedCall[platformName])[model][key]) {
              const nestedCallOfMethod = await findAndTransformQueryBuilderInNestedCall(cloneDeep(controllers.jsonData.nestedCall[platformName])[model][key]);
              Object.assign(apiObject, {
                IS_NESTED_CALL: true,
                NESTED_CALLS: nestedCallOfMethod,
              });
            } else {
              Object.assign(apiObject, { IS_NESTED_CALL: false });
            }
          } else {
            Object.assign(apiObject, { IS_NESTED_CALL: false });
          }

          // ? add variable to EJS
          api.locals.SUPPORT_API.push(apiObject);
        }
      }

      // ? custom route
      let uniqueTaskModels = [];
      let uniqueRequireValidationModels = [];
      api.locals.MODULE = platformName;

      // ? if Controller of any route is same as model name then it will add method in same controller
      if (customRoutesOfModel) {
        const routesWithQueryMode = commonService.removeQueryBuilderWithoutQueryMode(customRoutesOfModel, 'queryBuilder');
        const transformedControllerDetail = commonService.transformControllerDetailsWithQueryBuilder(cloneDeep(routesWithQueryMode));
        api.locals.CUSTOM_ROUTES = transformedControllerDetail.routes;
        const servicesToImport = (transformedControllerDetail.routes).map(((obj) => obj.service));
        api.locals.SERVICES_TO_IMPORT = uniq(servicesToImport);
        [uniqueTaskModels, uniqueRequireValidationModels] = commonService.getUniqModelsFromTasks(transformedControllerDetail.routes, 'queryBuilder');
        [api.locals.UNIQ_TASK_MODELS, api.locals.UNIQ_REQUIRE_VALIDATION_MODELS] = [uniqueTaskModels, uniqueRequireValidationModels];
        api.locals.IS_CQ = transformedControllerDetail.isQueryBuilderAvailable;
      } else {
        api.locals.CUSTOM_ROUTES = null;
        api.locals.IS_CQ = false;
        api.locals.UNIQ_TASK_MODELS = undefined;
        api.locals.UNIQ_REQUIRE_VALIDATION_MODELS = undefined;
        api.locals.SERVICES_TO_IMPORT = undefined;
      }
      let modelsToImport = [];
      // ? for finding models which need to be imported in controller
      const uniqModels = [];
      if (uniqModels && uniqModels.length) {
        modelsToImport = modelsToImport.concat(uniqModels);
      }
      if (uniqueTaskModels && uniqueTaskModels.length) {
        modelsToImport = modelsToImport.concat(uniqueTaskModels);
      }
      modelsToImport = uniq(modelsToImport.filter(Boolean));
      api.locals.UNIQ_TASK_MODELS = modelsToImport;
      returnController[model] = api;
    } else {
      const controllerName = model;
      const customRoutesOfModel = groupBy(customRoutesOfPlatform, 'controller')[controllerName];
      if (customRoutesOfModel) {
        const api = writeOperations.loadTemplate(`${controllers.controllerFilePath}/controller.js`);
        api.locals.path = controllers.controllerGeneratedPath;
        api.locals.DB_MODEL = model;
        api.locals.DB_MODEL_FC = model.charAt(0).toUpperCase() + model.slice(1);
        api.locals.SUPPORT_API = [];
        api.locals.DELETE_DEPENDENT_MODEL = false;
        api.locals.MODULE = platformName;
        if (controllers.auth.isAuth && controllers.auth.userModel === model) {
          api.locals.IS_AUTH = true;
        } else {
          api.locals.IS_AUTH = false;
        }
        const routesWithQueryMode = commonService.removeQueryBuilderWithoutQueryMode(customRoutesOfModel, 'queryBuilder');
        const transformedControllerDetail = commonService.transformControllerDetailsWithQueryBuilder(cloneDeep(routesWithQueryMode));
        api.locals.CUSTOM_ROUTES = transformedControllerDetail.routes;
        const servicesToImport = (transformedControllerDetail.routes).map(((obj) => obj.service));
        api.locals.SERVICES_TO_IMPORT = uniq(servicesToImport);
        const [UNIQ_TASK_MODELS, UNIQ_REQUIRE_VALIDATION_MODELS] = commonService.getUniqModelsFromTasks(transformedControllerDetail.routes, 'queryBuilder');
        [api.locals.UNIQ_TASK_MODELS, api.locals.UNIQ_REQUIRE_VALIDATION_MODELS] = [UNIQ_TASK_MODELS, UNIQ_REQUIRE_VALIDATION_MODELS];
        api.locals.IS_CQ = transformedControllerDetail.isQueryBuilderAvailable;
        returnController[model] = api;
      }
    }
  }

  return {
    returnController,
    packageDependencies,
  };
}
async function generateControllerIndex (platform, platformName, controllers) {
  const controllerIndexFiles = [];
  const customRoutes = (controllers.jsonData.routes?.apis && controllers.jsonData.routes?.apis.length) ? controllers.jsonData.routes?.apis : [];
  const customRoutesOfPlatform = groupBy(customRoutes, 'platform')[platformName];

  for (const [model, element] of Object.entries(platform)) {
    if (!isEmpty(element)) {
      const controllerName = model;
      const customRoutesOfModel = groupBy(customRoutesOfPlatform, 'controller')[controllerName];
      const platformIndexController = writeOperations.loadTemplate(`${controllers.controllerFilePath}/controllerIndex.js`);
      platformIndexController.locals.DB_MODEL = model;
      platformIndexController.locals.DB_MODEL_FC = model.charAt(0).toUpperCase() + model.slice(1);
      platformIndexController.locals.NOTIFICATION = false;
      platformIndexController.locals.EMAIL = false;
      platformIndexController.locals.SMS = false;
      platformIndexController.locals.WEB = false;
      platformIndexController.locals.IS_AUTH = false;
      platformIndexController.locals.CONTROLLER_METHODS = element;
      platformIndexController.locals.USER_MODEL = controllers.auth.isAuth && controllers.auth.userModel === model;
      if (controllers.auth.isAuth && controllers.auth.userModel === model) {
        platformIndexController.locals.IS_AUTH = controllers.auth.isAuth;
      }

      const deleteDependency = await getDeleteDependentModel(model, controllers.deleteDependency);
      platformIndexController.locals.DELETE_DEPENDENT_MODEL = deleteDependency.length ? deleteDependency : false;

      let dbDependencyInjection = [model];
      if (deleteDependency.length) {
        if (!isEmpty(deleteDependency)) {
          forEach(deleteDependency, (value) => {
            dbDependencyInjection.push(value.model);
          });
        }
        dbDependencyInjection = uniq(dbDependencyInjection);
      }
      platformIndexController.locals.DB_DEPENDENCY_INJECTION = dbDependencyInjection;

      const notificationObj = await getNotification(model, controllers.jsonData.modelNotifications);
      if (notificationObj) {
        platformIndexController.locals.NOTIFICATION = true;
        const {
          email, sms, webNotification,
        } = await individualNotification(notificationObj);
        platformIndexController.locals.EMAIL = email;
        platformIndexController.locals.SMS = sms;
        platformIndexController.locals.WEB = webNotification;
      }
      // ? for finding models which need to be imported in controller
      const uniqModels = [];
      let uniqueTaskModels = [];
      let uniqueRequireValidationModels = [];
      if (customRoutesOfModel) {
        const routesWithQueryMode = commonService.removeQueryBuilderWithoutQueryMode(customRoutesOfModel, 'queryBuilder');
        const transformedControllerDetail = commonService.transformControllerDetailsWithQueryBuilder(cloneDeep(routesWithQueryMode));
        platformIndexController.locals.CUSTOM_ROUTES = transformedControllerDetail.routes;
        platformIndexController.locals.PLATFORM = platformName;
        const servicesToImport = (transformedControllerDetail.routes).map(((obj) => obj.service));
        platformIndexController.locals.SERVICES_TO_IMPORT = uniq(servicesToImport);
        [uniqueTaskModels, uniqueRequireValidationModels] = commonService.getUniqModelsFromTasks(transformedControllerDetail.routes, 'queryBuilder');
        [platformIndexController.locals.UNIQ_TASK_MODELS, platformIndexController.locals.UNIQ_REQUIRE_VALIDATION_MODELS] = [uniqueTaskModels, uniqueRequireValidationModels];
        platformIndexController.locals.IS_CQ = transformedControllerDetail.isQueryBuilderAvailable;
      } else {
        platformIndexController.locals.CUSTOM_ROUTES = null;
        platformIndexController.locals.PLATFORM = platformName;
        platformIndexController.locals.IS_CQ = false;
        platformIndexController.locals.UNIQ_TASK_MODELS = undefined;
        platformIndexController.locals.UNIQ_REQUIRE_VALIDATION_MODELS = undefined;
        platformIndexController.locals.SERVICES_TO_IMPORT = undefined;
      }
      let modelsToImport = [];
      if (uniqModels && uniqModels.length) {
        modelsToImport = modelsToImport.concat(uniqModels);
      }
      if (uniqueTaskModels && uniqueTaskModels.length) {
        modelsToImport = modelsToImport.concat(uniqueTaskModels);
      }
      modelsToImport = uniq(modelsToImport.filter(Boolean));
      platformIndexController.locals.UNIQ_TASK_MODELS = modelsToImport;

      controllerIndexFiles.push({ [model]: platformIndexController });
    }
  }
  return controllerIndexFiles;
}
async function makeControllerIndex (controllers) {
  const platform = controllers.jsonData.modelConfig;
  // const platform = cloneDeep(controllers.jsonData.authentication.platform);
  const controllerIndex = {};
  if (!isEmpty(platform)) {
    for (const [module, element] of Object.entries(platform)) {
      /*
       * * module = admin , device , desktop , client
       * * element = {user:{"create:{"selected":true,"policy":[],"isAuth":true}"}}
       */
      if (!isEmpty(element)) {
        const controller = await generateControllerIndex(element, module, controllers);
        controllerIndex[module] = controller;
      }
    }
  }
  return controllerIndex;
}

async function makeController (controllers) {
  const platform = controllers.jsonData.modelConfig;
  const platformWiseController = {};
  const packageDependencies = {};
  const ormProvider = controllers.jsonData.ORM;
  const { jsonModels } = controllers;
  if (!isEmpty(platform)) {
    for (const [module, element] of Object.entries(platform)) {
      /*
       * * module = admin , device , desktop , client
       * * element = {user:{"create:{"selected":true,"policy":[],"isAuth":true}"}}
       */
      if (!isEmpty(element)) {
        const modelController = await generateController(element, module, controllers, ormProvider, jsonModels);
        platformWiseController[module] = modelController.returnController;
        if (!isEmpty(modelController.packageDependencies.dependencies) && packageDependencies !== modelController.packageDependencies) {
          Object.assign(packageDependencies, modelController.packageDependencies);
        }
      }
    }
  }
  return {
    platformWiseController,
    packageDependencies,
  };
}

module.exports = {
  makeController,
  makeControllerIndex,
};
