/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const {
  isEmpty, forEach, groupBy, cloneDeep, flatten, uniq, has, each,
} = require('lodash');
const writeOperations = require('../../writeOperations');
const commonService = require('../utils/common');
const { APIS } = require('../../constants/constant');

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
              qb.populate = commonService.transformSelect(qb.populate);
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

async function generatePlatformRoutes (platform, makeRouteObj, customRoutes) {
  const platformIndexRoutes = {};
  forEach(platform, (platformObj, platformName) => {
    const indexRoutes = writeOperations.loadTemplate(`${makeRouteObj.routeFilePath}/platformIndexRoutes.js`);
    if (!isEmpty(customRoutes)) {
      const routes = [];
      const customRoutesOfPlatform = customRoutes.filter((customRoute) => customRoute.platform === platformName);
      customRoutesOfPlatform.forEach((route) => {
        const isModelConfigAvailable = has(platformObj, route.model);
        if (!isModelConfigAvailable) {
          routes.push(route);
        }
      });
      if (!isEmpty(routes)) {
        indexRoutes.locals.CUSTOM_ROUTES = routes;
      }
    }
    indexRoutes.locals.PLATFORM = each(platformObj, (model, modelName) => {
      if (isEmpty(platformObj[modelName])) {
        delete platformObj[modelName];
      }
      return platformObj;
    });
    indexRoutes.locals.PLATFORM_NAME = platformName;
    indexRoutes.locals.ADMIN = platformName === 'admin';
    indexRoutes.locals.IS_AUTH = makeRouteObj.auth.isAuth && makeRouteObj.auth?.loginPlatform ? makeRouteObj.auth.loginPlatform.includes(platformName) : false;
    platformIndexRoutes[platformName] = indexRoutes;
  });
  return platformIndexRoutes;
}
async function generateRoutes (platform, platformName, makeRouteObj, customRoutesOfPlatform, rolePermissionForPlatform) {
  const returnRoutes = {};
  for (const [model, element] of Object.entries(platform)) {
    if (!isEmpty(element)) {
      const routes = writeOperations.loadTemplate(`${makeRouteObj.routeFilePath}/modelRoutes.js`);
      routes.locals.DB_MODEL = model;
      routes.locals.USER_MODEL = makeRouteObj.auth.userModel === model;
      routes.locals.MODULE = platformName;
      routes.locals.LOGIN_ACCESS_PLATFORM = makeRouteObj.auth.loginAccessPlatform;
      routes.locals.IS_AUTH = makeRouteObj.auth.isAuth;
      routes.locals.PLATFORM = platformName;
      if (platformName === 'admin') {
        routes.locals.ROUTE_PREFIX = `${platformName.toLowerCase()}/${model.toLowerCase()}`;
      } else {
        routes.locals.ROUTE_PREFIX = `${platformName.toLowerCase()}/api/v1/${model.toLowerCase()}`;
      }

      let customPolicyList = [];
      if (!isEmpty(rolePermissionForPlatform)) {
        routes.locals.SHOULD_IMPORT_RP_MIDDLEWARE = true;
      } else {
        routes.locals.SHOULD_IMPORT_RP_MIDDLEWARE = false;
      }
      const apis = [];
      for (const [key, value] of Object.entries(element)) {
        let loginFilter;
        if (makeRouteObj.jsonData.filterByLoggedInUser) {
          loginFilter = await commonService.getFilterLoggedUser(model, platformName, makeRouteObj.jsonData.filterByLoggedInUser, {
            isAuth: makeRouteObj.auth.isAuth,
            userModel: makeRouteObj.auth.userModel,
            authRoute: value.isAuth,
          });
        }

        if (APIS.includes(key) && value.selected) {
          if (value.isAuth && makeRouteObj.auth.isAuth) {
            if (rolePermissionForPlatform && rolePermissionForPlatform[model] && rolePermissionForPlatform[model][key] && rolePermissionForPlatform[model][key].length) {
              value.policy = [...value.policy, 'checkRolePermission'];
            }
          }
          if (value.policy && value.policy.length) {
            customPolicyList = customPolicyList.concat(value.policy);
          }
          apis.push({
            method: key,
            isAuth: value.isAuth && makeRouteObj.auth.isAuth,
            policy: value.policy ? value.policy : [],
            loginFilter: !!loginFilter,
            addedBy: loginFilter ? loginFilter.addedByKey : null,
          });
        }
      }
      routes.locals.SUPPORT_API = apis;
      customPolicyList = customPolicyList.filter((item, i, ar) => ar.indexOf(item) === i);
      routes.locals.CUSTOM_POLICY = customPolicyList;
      const customRoutesOfModel = groupBy(customRoutesOfPlatform, 'model')[model];
      if (customRoutesOfModel) {
        const routesWithQueryMode = commonService.removeQueryBuilderWithoutQueryMode(customRoutesOfModel, 'queryBuilder');
        const transformedControllerDetail = commonService.transformControllerDetailsWithQueryBuilder(cloneDeep(routesWithQueryMode));
        const customRoutePolicy = commonService.getPolicyForCustomRoutes(transformedControllerDetail.routes);
        if (customRoutePolicy && customRoutePolicy.length) {
          routes.locals.CUSTOM_POLICY = flatten([...new Set([...customPolicyList, customRoutePolicy])]);
        }
        const controllersToImport = (transformedControllerDetail.routes).map(((obj) => obj.controller));
        routes.locals.CONTROLLERS_TO_IMPORT = uniq(controllersToImport);
        routes.locals.PLATFORM = platformName;
        routes.locals.CUSTOM_ROUTES = transformedControllerDetail.routes;
        routes.locals.IMPORT = transformedControllerDetail.routes;
      } else {
        routes.locals.CUSTOM_ROUTES = [];
        routes.locals.CONTROLLERS_TO_IMPORT = [];
      }
      returnRoutes[model] = routes;
    } else {
      const customRoutesOfModel = groupBy(customRoutesOfPlatform, 'model')[model];
      if (customRoutesOfModel) {
        const routes = writeOperations.loadTemplate(`${makeRouteObj.routeFilePath}/modelRoutes.js`);
        routes.locals.DB_MODEL = model;
        routes.locals.USER_MODEL = false;
        routes.locals.MODULE = platformName;
        routes.locals.LOGIN_ACCESS_PLATFORM = makeRouteObj.auth.loginAccessPlatform;
        routes.locals.IS_AUTH = makeRouteObj.auth.isAuth;
        routes.locals.CUSTOM_POLICY = [];
        routes.locals.SUPPORT_API = [];
        const routesWithQueryMode = commonService.removeQueryBuilderWithoutQueryMode(customRoutesOfModel, 'queryBuilder');
        const transformedControllerDetail = commonService.transformControllerDetailsWithQueryBuilder(cloneDeep(routesWithQueryMode));
        const controllersToImport = (transformedControllerDetail.routes).map(((obj) => obj.controller));
        routes.locals.CONTROLLERS_TO_IMPORT = uniq(controllersToImport);
        routes.locals.CUSTOM_POLICY = commonService.getPolicyForCustomRoutes(transformedControllerDetail.routes);
        routes.locals.PLATFORM = platformName;
        routes.locals.CUSTOM_ROUTES = transformedControllerDetail.routes;
        routes.locals.IMPORT = transformedControllerDetail.routes;
        returnRoutes[model] = routes;
      }
    }
  }
  if (!isEmpty(customRoutesOfPlatform)) {
    const { customRoutesPath } = makeRouteObj;
    const customRoutesWithoutModel = customRoutesOfPlatform.filter((route) => (route.createNewFile));
    customRoutesWithoutModel.forEach((customRoute) => {
      const route = writeOperations.loadTemplate(`${customRoutesPath}/route.js`);
      const routesWithQueryMode = commonService.removeQueryBuilderWithoutQueryMode([customRoute], 'queryBuilder');
      const transformedControllerDetail = transformControllerDetailsWithQueryBuilder(cloneDeep(routesWithQueryMode));
      route.locals.POLICIES = commonService.getPolicyForCustomRoutes([customRoute]);
      route.locals.PLATFORM = platformName;
      route.locals.ROUTES = transformedControllerDetail.routes;
      route.locals.IMPORT = transformedControllerDetail.routes;
      route.locals.SERVICE_NAME = customRoute.controller;
      returnRoutes[customRoute.controller] = route;
    });

    customRoutesOfPlatform = customRoutesOfPlatform.filter((route) => !isEmpty(route.model));
    customRoutesOfPlatform.forEach((customRoute) => {
      const isModelConfigAvailable = has(platform, customRoute.model);
      if (!isModelConfigAvailable) {
        const route = writeOperations.loadTemplate(`${customRoutesPath}/route.js`);
        const routesWithQueryMode = commonService.removeQueryBuilderWithoutQueryMode([customRoute], 'queryBuilder');
        const transformedControllerDetail = transformControllerDetailsWithQueryBuilder(cloneDeep(routesWithQueryMode));
        route.locals.POLICIES = commonService.getPolicyForCustomRoutes([customRoute]);
        route.locals.PLATFORM = platformName;
        route.locals.ROUTES = transformedControllerDetail.routes;
        route.locals.IMPORT = transformedControllerDetail.routes;
        route.locals.SERVICE_NAME = customRoute.controller;
        returnRoutes[customRoute.model] = route;
      }
    });
  }

  return returnRoutes;
}
async function makeRoutes (makeRoutesObj) {
  const platform = makeRoutesObj.jsonData.modelConfig;
  const customRoutes = makeRoutesObj.jsonData.routes && makeRoutesObj.jsonData.routes.apis ? makeRoutesObj.jsonData.routes.apis : undefined;
  const rolePermission = makeRoutesObj.jsonData.rolePermission ? makeRoutesObj.jsonData.rolePermission : undefined;
  if (!isEmpty(platform)) {
    const modelWiseRoutes = {};

    // ? model wise routes
    for (const [module, element] of Object.entries(platform)) {
      /*
       * * module = admin , device , desktop , client
       * * element = {user:{"create:{"selected":true,"policy":[],"isAuth":true}"}}
       */
      const customRoutesOfPlatform = groupBy(customRoutes, 'platform')[module];
      let rolePermissionForPlatform;
      if (!isEmpty(rolePermission)) {
        rolePermissionForPlatform = rolePermission[module];
      }
      if (!isEmpty(element)) {
        const modelRoutes = await generateRoutes(element, module, makeRoutesObj, customRoutesOfPlatform, rolePermissionForPlatform);
        modelWiseRoutes[module] = modelRoutes;
      }
    }
    // ? platform index routes
    const platformRoutes = await generatePlatformRoutes(platform, makeRoutesObj, customRoutes);

    // ? main index routes
    const indexRoute = writeOperations.loadTemplate(`${makeRoutesObj.routeFilePath}/index.js`);
    indexRoute.locals.PLATFORM = platform;
    if (makeRoutesObj.jsonData.authentication.loginRateLimit) {
      indexRoute.locals.LOGIN_RATE = makeRoutesObj.jsonData.authentication.loginRateLimit.max;
      if (makeRoutesObj.jsonData.authentication.loginRateLimit.reActiveTime) indexRoute.locals.REACTIVE_TIME = makeRoutesObj.jsonData.authentication.loginRateLimit.reActiveTime;
      else indexRoute.locals.REACTIVE_TIME = 1000;
    } else {
      indexRoute.locals.LOGIN_RATE = false;
    }

    return {
      modelWiseRoutes,
      platformRoutes,
      indexRoute,
    };
  }
  return {};
}
module.exports = { makeRoutes };
