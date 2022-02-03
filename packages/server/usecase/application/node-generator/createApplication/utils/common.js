const {
  isEmpty, forEach, filter, chain, flatten, map, difference, groupBy, uniq, has, last,
} = require('lodash');
const writeOperations = require('../../writeOperations');

const identifyPlatform = (modelConfig) => {
  const admin = {}; const device = {}; const desktop = {}; const client = {};
  const platform = {};
  forEach(modelConfig, (value, model) => {
    if (value.admin !== undefined) {
      admin[model] = value.admin;
    }
    if (modelConfig[model].device !== undefined) {
      device[model] = value.device;
    }
    if (modelConfig[model].desktop !== undefined) {
      desktop[model] = value.desktop;
    }
    if (modelConfig[model].client !== undefined) {
      client[model] = value.client;
    }
  });
  platform.admin = admin;
  platform.device = device;
  platform.desktop = desktop;
  platform.client = client;
  return platform;
};
const identifyPlatformNew = (modelConfig, platforms) => {
  const platformFinal = {};
  forEach(modelConfig, (value) => {
    forEach(value, (obj, p) => {
      if (!platforms.includes(p)) {
        platforms.push(p);
      }
    });
  });
  forEach(modelConfig, (value, model) => {
    forEach(platforms, (platform) => {
      if (value[platform] !== undefined) {
        if (!platformFinal[platform]) {
          platformFinal[platform] = {};
        }
        platformFinal[platform][model] = value[platform];
      }
    });
  });
  return platformFinal;
};
const getFilterLoggedUser = async (model, platformName, filterByLoggedInUser, authObj) => {
  let filterLoggedUser = false;
  if (authObj.isAuth && authObj.userModel !== model) {
    if (authObj.authRoute) {
      if (filterByLoggedInUser.isLoginUser) {
        if (filterByLoggedInUser.platform[platformName]) {
          if (!isEmpty(filterByLoggedInUser) && !isEmpty(filterByLoggedInUser.models) && !isEmpty(filterByLoggedInUser.models[model])) {
            filterLoggedUser = filterByLoggedInUser.models[model];
            if (isEmpty(filterLoggedUser.addedByKey)) {
              filterLoggedUser.addedByKey = 'addedBy';
            }
          }
        }
      }
    }
  }
  return filterLoggedUser;
};

const getRandomIntByMax = (max) => Math.floor(Math.random() * max);
const getTemplateByName = (template, name) => {
  let tmp;
  if (!isEmpty(template.emailTemplate)) {
    tmp = template.emailTemplate.find((val) => val.templateName === name);
    if (!isEmpty(tmp)) {
      const attributes = {};
      for (let i = 0; i < tmp.customJson.length; i += 1) {
        Object.assign(attributes, { [tmp.customJson[i].templateKey]: `${tmp.customJson[i].modelName}.${tmp.customJson[i].mappingKey}` });
      }
      Object.assign(tmp, { attribute: attributes });
    }
  }
  if (!isEmpty(template.smsTemplate) && isEmpty(tmp)) {
    tmp = template.smsTemplate.find((val) => val.templateName === name);
    if (!isEmpty(tmp)) {
      const attributes = {};
      for (let i = 0; i < tmp.customJson.length; i += 1) {
        Object.assign(attributes, { [tmp.customJson[i].templateKey]: `${tmp.customJson[i].modelName}.${tmp.customJson[i].mappingKey}` });
      }
      Object.assign(tmp, { attribute: attributes });
    }
  }
  return tmp;
};
const getUniqModelsFromTasks = (tasks, keyOfQueryBuilder) => {
  let UNIQ_DN_REQUIRE_VALIDATION_MODELS;
  let UNIQ_TASK_MODELS;
  let UNIQ_REQUIRE_VALIDATION_MODELS;
  const methodsThatRequireValidation = ['create', 'findOneAndUpdate', 'updateMany'];
  const callTasks = filter(tasks, (t) => { if (t[`${keyOfQueryBuilder}`] !== undefined) { return true; } return false; });
  const calls = flatten(map(callTasks, `${keyOfQueryBuilder}`));
  if (calls && calls.length) {
    const callsThatDNRequireValidation = filter(calls, (call) => { if (!methodsThatRequireValidation.includes(call.queryMode)) { return true; } return false; });
    if (callsThatDNRequireValidation && callsThatDNRequireValidation.length) {
      UNIQ_DN_REQUIRE_VALIDATION_MODELS = (chain(callsThatDNRequireValidation).map('model').uniq().value())
        .filter(Boolean);
    } else {
      UNIQ_DN_REQUIRE_VALIDATION_MODELS = undefined;
    }
    UNIQ_TASK_MODELS = (chain(calls).map('model').uniq().value())
      .filter(Boolean);
    UNIQ_REQUIRE_VALIDATION_MODELS = UNIQ_DN_REQUIRE_VALIDATION_MODELS ? difference(UNIQ_TASK_MODELS, UNIQ_DN_REQUIRE_VALIDATION_MODELS) : UNIQ_TASK_MODELS;
  } else {
    UNIQ_TASK_MODELS = [];
    UNIQ_DN_REQUIRE_VALIDATION_MODELS = [];
    UNIQ_REQUIRE_VALIDATION_MODELS = [];
  }
  return [UNIQ_TASK_MODELS, UNIQ_REQUIRE_VALIDATION_MODELS];
};
const removeQueryBuilderWithoutQueryMode = (queryBuilders, keyOfQueryBuilder) => {
  forEach(queryBuilders, (queryBuilder) => {
    if (queryBuilder[`${keyOfQueryBuilder}`] && queryBuilder[`${keyOfQueryBuilder}`].length) {
      queryBuilder[`${keyOfQueryBuilder}`] = filter(queryBuilder[`${keyOfQueryBuilder}`], 'queryMode');
      queryBuilder[`${keyOfQueryBuilder}`] = filter(queryBuilder[`${keyOfQueryBuilder}`], (query) => {
        if (query.queryMode === 'codeBlock') {
          return true;
        } if (query.queryMode === 'fileUpload') {
          return true;
        }
        if (query.queryMode !== 'codeBlock' && query.model) {
          return true;
        }
        return false;
      });
    }
  });

  return queryBuilders;
};
const transformSelect = (populateArray) => {
  forEach(populateArray, (populateObj) => {
    if (Object.prototype.hasOwnProperty.call(populateObj, 'select')) {
      populateObj.select = (populateObj.select).join(' ');
    }
    if (Object.prototype.hasOwnProperty.call(populateObj, 'populate')) {
      transformSelect(populateObj.populate);
    }
  });
  return populateArray;
};

const doesArrayContainSearchArray = (array, searchArray) => searchArray.every((v) => array.includes(v));

function getImportPath (toPath, fromPath) {
  let arrToPath = toPath.split('/');
  let arrFromPath = fromPath.split('/');

  arrToPath = arrToPath.filter((i) => i.length > 0);
  arrFromPath = arrFromPath.filter((i) => i.length > 0);

  arrFromPath = arrFromPath.reverse();
  arrToPath = arrToPath.reverse();

  const finalPath = []; let
    pushArr = [];
  for (let i = 0; i < arrToPath.length; i += 1) {
    let notSame = false;
    for (let j = 0; j < arrFromPath.length; j += 1) {
      if (arrFromPath[j] !== arrToPath[i]) {
        notSame = true;
      } else {
        notSame = false;
        pushArr = arrFromPath.splice(0, arrFromPath.indexOf(arrFromPath[j]));
        break;
      }
    }
    if (notSame) {
      finalPath.push('..');
    } else {
      pushArr = pushArr.reverse();
      finalPath.push(pushArr.join('/'));
      break;
    }
  }
  if (finalPath.length === 1 && finalPath[0] !== '..') {
    finalPath[0] = `./${finalPath[0]}`;
  } else if (finalPath.length === 0) {
    arrFromPath.reverse();
    finalPath[0] = `./${arrFromPath.join('/')}`;
  } else if (finalPath.every((val) => val === finalPath[0])) {
    arrFromPath.reverse();
    finalPath.push(arrFromPath.join('/'));
  }
  return finalPath.join('/');
}

const getPlatformWiseAPIOfCustomRoutes = (customRoutes) => {
  const platformWiseRoutes = groupBy(customRoutes, 'platform');
  map(platformWiseRoutes, (routes, platform) => {
    platformWiseRoutes[platform] = map(routes, (obj) => obj.api);
  });
  return platformWiseRoutes;
};

const getPolicyForCustomRoutes = (customRoutes) => {
  customRoutes = flatten(map(customRoutes, (obj) => obj.policies));
  customRoutes = [...new Set(customRoutes)];
  return customRoutes.filter(Boolean);
};
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
        for (const queryBuilder of route.queryBuilder) {
          if (queryBuilder.queryMode === 'find') {
            if (Object.prototype.hasOwnProperty.call(queryBuilder, 'select')) {
              queryBuilder.select = (queryBuilder.select).join(' ');
            }
            if (Object.prototype.hasOwnProperty.call(queryBuilder, 'populate')) {
              queryBuilder.populate = transformSelect(queryBuilder.populate);
            }
          }
          if (!queryBuilder.outputVariable || queryBuilder.outputVariable === '') {
            queryBuilder.outputVariable = `outputVar_${getRandomIntByMax(10000)}`;
          }
          queryBuilder.queryVarName = `query_${getRandomIntByMax(10000)}`;
        }
      }
    }
  }
  return {
    routes,
    isQueryBuilderAvailable,
  };
};
const shouldCopyQueryService = (customRoutes) => {
  customRoutes = removeQueryBuilderWithoutQueryMode(customRoutes, 'queryBuilder');
  const transformedRoutes = transformControllerDetailsWithQueryBuilder(customRoutes);
  return transformedRoutes.isQueryBuilderAvailable;
};
const uniqRolesFromRolePermissions = (rolePermission) => {
  let roles = [];
  forEach(rolePermission, (platformObj) => {
    forEach(platformObj, (modelObj) => {
      forEach(modelObj, (methods) => {
        roles = [...roles, ...methods];
      });
    });
  });
  return uniq(roles);
};

const getRouteNameAndMethod = (method) => {
  const routeWithMethod = {};
  switch (method) {
  case 'create':
    routeWithMethod.path = 'create';
    routeWithMethod.method = 'POST';
    break;
  case 'createBulk':
    routeWithMethod.path = 'addBulk';
    routeWithMethod.method = 'POST';
    break;
  case 'delete':
    routeWithMethod.path = 'delete/:id';
    routeWithMethod.method = 'DELETE';
    break;
  case 'deleteMany':
    routeWithMethod.path = 'deleteMany';
    routeWithMethod.method = 'DELETE';
    break;
  case 'softDelete':
    routeWithMethod.path = 'softDelete/:id';
    routeWithMethod.method = 'PUT';
    break;
  case 'softDeleteMany':
    routeWithMethod.path = 'softDeleteMany';
    routeWithMethod.method = 'PUT';
    break;
  case 'findAll':
    routeWithMethod.path = 'list';
    routeWithMethod.method = 'POST';
    break;
  case 'count':
    routeWithMethod.path = 'count';
    routeWithMethod.method = 'POST';
    break;
  case 'findById':
    routeWithMethod.path = ':id';
    routeWithMethod.method = 'GET';
    break;
  case 'update':
    routeWithMethod.path = 'update/:id';
    routeWithMethod.method = 'PUT';
    break;
  case 'partialUpdate':
    routeWithMethod.path = 'partial-update/:id';
    routeWithMethod.method = 'PUT';
    break;
  case 'bulkUpdate':
    routeWithMethod.path = 'updateBulk';
    routeWithMethod.method = 'PUT';
    break;
  default:
    break;
  }
  return routeWithMethod;
};
const getRouteRoleArray = (rolePermission) => {
  const routeRoleArray = [];
  forEach(rolePermission, (platformObj, platformName) => {
    forEach(platformObj, (modelObj, modelName) => {
      let route = '';
      if (platformName !== 'admin') {
        route = `/${platformName}/api/v1/${modelName}/`;
      } else {
        route = `/${platformName}/${modelName}/`;
      }
      forEach(modelObj, (roleArray, methodName) => {
        const pathAndMethod = getRouteNameAndMethod(methodName);
        if (!isEmpty(pathAndMethod)) {
          let routeWithMethod = `${route}${pathAndMethod.path}`;
          forEach(roleArray, (role) => {
            const routeRoleObj = { route: routeWithMethod.toLowerCase() };
            routeRoleObj.role = role;
            routeRoleObj.method = pathAndMethod.method;
            routeRoleArray.push(routeRoleObj);
          });
          routeWithMethod = '';
        }
      });
    });
  });
  return routeRoleArray;
};

const removeGivenKeyFromObject = (obj, keysToRemove) => {
  forEach(keysToRemove, (key) => {
    if (has(obj, key)) {
      delete obj[key];
    }
  });
  return obj;
};

const createReadMeFile = (readmeObj) => {
  const readMeEjs = writeOperations.loadTemplate(`${readmeObj.templateFolderName}/README`);
  // eslint-disable-next-line prefer-destructuring
  readMeEjs.locals.IS_AUTH = readmeObj.auth.isAuth;
  if (readmeObj.auth.isAuth && !isEmpty(readmeObj.credentials)) {
    readMeEjs.locals.ROLE_WISE_CREDENTIALS = readmeObj.credentials;
    readMeEjs.locals.CREDENTIALS = readmeObj.credentials;
    readMeEjs.locals.USER_FIELD = readmeObj.auth.userLoginWith.username ? readmeObj.auth.userLoginWith.username[0] : readmeObj.auth.emailField;
    readMeEjs.locals.PASSWORD_FIELD = readmeObj.auth.userLoginWith.password;
    readMeEjs.locals.USERNAME = readmeObj.auth.userLoginWith.username[0] ? readmeObj.credentials[readmeObj.auth.userLoginWith.username[0]] : readmeObj.auth.emailField;
    readMeEjs.locals.PASSWORD = readmeObj.credentials[readmeObj.auth.userLoginWith.password];
  }
  return readMeEjs;
};

const createRelativePathFromAbsolutePath = (currentFilePath, absolutePath) => {
  let relativePath = '';
  let currentFilePathAsArray = currentFilePath.split('/');
  let absolutePathAsArray = absolutePath.split('/');

  currentFilePathAsArray = currentFilePathAsArray.filter((item) => item);
  absolutePathAsArray = absolutePathAsArray.filter((item) => item);

  const currentPathLength = currentFilePathAsArray.length;
  const absolutePathLength = absolutePathAsArray.length;

  if (currentPathLength <= absolutePathLength) {
    let i = 0;
    while (i <= absolutePathLength) {
      if (absolutePathAsArray[i] !== currentFilePathAsArray[i]) {
        break;
      }
      i += 1;
    }

    if (currentFilePathAsArray[i] === last(currentFilePathAsArray)) {
      const rel = './';
      const remain = absolutePathAsArray.slice(i, absolutePathAsArray.length);
      relativePath = rel + remain.join('/');
    } else {
      const cRemainLen = currentFilePathAsArray.slice(i, currentFilePathAsArray.length).length;
      let rel = '';
      for (let j = 1; j < cRemainLen; j += 1) {
        rel += '../';
      }
      const remain = absolutePathAsArray.slice(i, absolutePathAsArray.length);
      relativePath = rel + remain.join('/');
    }
  } else if (currentPathLength > absolutePathLength) {
    let i = 0;
    while (i <= currentPathLength) {
      if (absolutePathAsArray[i] !== currentFilePathAsArray[i]) {
        break;
      }
      i += 1;
    }
    const remain = currentFilePathAsArray.slice(i, currentFilePathAsArray.length);
    if (remain.length > 1) {
      let rel = '';
      for (let j = 1; j < remain.length; j += 1) {
        rel += '../';
      }
      const aRemain = absolutePathAsArray.slice(i, absolutePathAsArray.length);
      relativePath = rel + aRemain.join('/');
    }
  }
  return relativePath;
};

const getRelativePaths = (fileNames, filePath, pathToBeIncludedInFilePath, destinationDirectory) => {
  const fullPath = `${destinationDirectory}${filePath}`;
  const relativePaths = {};
  forEach(fileNames, (fileName) => {
    const fileFullPath = `${fullPath}${fileName}`;
    const destinationPath = `${destinationDirectory}${pathToBeIncludedInFilePath}`;
    /*
     * console.log(fileFullPath);
     * console.log(destinationPath);
     * console.log(`relative path -> ${createRelativePathFromAbsolutePath(destinationPath, fileFullPath)}`);
     */
    const path = createRelativePathFromAbsolutePath(destinationPath, fileFullPath);
    Object.assign(relativePaths, { [fileName]: path });
  });
  return relativePaths;
};

module.exports = {
  identifyPlatform,
  identifyPlatformNew,
  getFilterLoggedUser,
  getRandomIntByMax,
  getTemplateByName,
  getUniqModelsFromTasks,
  removeQueryBuilderWithoutQueryMode,
  transformSelect,
  doesArrayContainSearchArray,
  getImportPath,
  getPlatformWiseAPIOfCustomRoutes,
  getPolicyForCustomRoutes,
  transformControllerDetailsWithQueryBuilder,
  shouldCopyQueryService,
  uniqRolesFromRolePermissions,
  getRouteRoleArray,
  removeGivenKeyFromObject,
  createReadMeFile,
  createRelativePathFromAbsolutePath,
  getRelativePaths,
};
