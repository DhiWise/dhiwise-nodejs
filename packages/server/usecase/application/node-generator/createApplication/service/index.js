/* eslint-disable no-restricted-syntax */
const {
  isEmpty, forEach, pickBy, find, cloneDeep, has,
} = require('lodash');
const { isUri } = require('valid-url');
const writeOperations = require('../../writeOperations');
const validation = require('../requestValidation');
const sequelizeValidation = require('../sequelize/requestValidation');
const postman = require('../postman');
const commonService = require('../utils/common');
const {
  MODEL_FOR_ROLE_PERMISSION, DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_USERNAME, DEFAULT_ROLE,
} = require('../../constants/constant');
const generatePostmanCollection = require('../postman/generate-postman-collection');
const fakeDataMongoose = require('../generateFakeData');
const fakeDataSequelize = require('../generateFakeDataSequelize');
const { removeGivenKeyFromObject } = require('../utils/common');

async function createMVCBlankFolder (dir, userDirectoryStructure) {
  writeOperations.mkdir(dir, userDirectoryStructure.controllerFolderPath);
  writeOperations.mkdir(dir, userDirectoryStructure.modelFolderPath);
  writeOperations.mkdir(dir, userDirectoryStructure.configFolderPath);
  writeOperations.mkdir(dir, userDirectoryStructure.publicFolderPath);
  writeOperations.mkdir(dir, userDirectoryStructure.routesFolderPath);
  writeOperations.mkdir(dir, userDirectoryStructure.utilsFolderPath);
  writeOperations.mkdir(dir, userDirectoryStructure.validationFolderPath);
  writeOperations.mkdir(dir, userDirectoryStructure.serviceFolderPath);
  writeOperations.mkdir(dir, userDirectoryStructure.middlewareFolderPath);
  writeOperations.mkdir(dir, userDirectoryStructure.viewsFolderPath);
  writeOperations.mkdir(dir, 'postman');
}
function createAppName (Name) {
  return Name
    .replace(/[^A-Za-z0-9.-]+/g, '-')
    .replace(/^[-_.]+|-+$/g, '')
    .toLowerCase();
}
async function createPackageJson ({
  name,
  packages,
  mainJsFile,
  sequenceGenerator,
  jsonData,
}) {
  const pkg = {
    name: createAppName(name),
    version: '0.0.1',
    private: true,
    scripts: { start: `nodemon ${mainJsFile}` },
    dependencies: {
      'cookie-parser': '~1.4.4',
      debug: '~2.6.9',
      express: '~4.16.1',
      mongoose: '~5.11.8',
      dayjs: '^1.10.7',
      'mongoose-paginate-v2': '~1.3.12',
      morgan: '~1.9.1',
      joi: '~17.3.0',
      'mongoose-id-validator': '~0.6.0',
      'mongoose-unique-validator': '~2.0.3',
      dotenv: '~8.2.0',
      ejs: '~3.1.6',
      'express-rate-limit': '~5.2.6',
      cors: '~2.8.5',
    },
    devDependencies: {
      eslint: '~7.12.1',
      'eslint-config-airbnb': '~18.2.1',
      'eslint-plugin-import': '~2.22.1',
      nodemon: '^2.0.15',
    },
  };
  forEach(packages?.dependencies, (depValue, depName) => {
    if (isUri(depValue)) {
      packages.dependencies[depName] = `git+${depValue}`;
    }
  });
  forEach(packages?.devDependencies, (depValue, depName) => {
    if (isUri(depValue)) {
      packages.devDependencies[depName] = `git+${depValue}`;
    }
  });
  if (!isEmpty(packages)) {
    if (packages.dependencies) Object.assign(pkg.dependencies, packages.dependencies);
    if (packages.devDependencies) Object.assign(pkg.devDependencies, packages.devDependencies);
    if (packages.scripts) Object.assign(pkg.scripts, packages.scripts);
  }
  if (!isEmpty(sequenceGenerator)) {
    Object.assign(pkg.dependencies, { 'mongoose-sequence': '~5.3.1' });
  }
  if (!isEmpty(jsonData.rolePermission)) {
    Object.assign(pkg.dependencies, { 'express-list-endpoints': '^5.0.0' });
  }
  return pkg;
}

async function createPackageJsonForSequelize ({
  name,
  packages,
  mainJsFile,
  adapter,
  jsonData,
}) {
  const pkg = {
    name: createAppName(name),
    version: '0.0.1',
    private: true,
    scripts: { start: `node ${mainJsFile}` },
    dependencies: {
      'cookie-parser': '~1.4.4',
      debug: '~2.6.9',
      express: '~4.16.1',
      morgan: '~1.9.1',
      joi: '~17.3.0',
      dotenv: '~8.2.0',
      ejs: '~3.1.6',
      dayjs: '^1.10.7',
      'express-rate-limit': '~5.2.6',
      cors: '~2.8.5',
      'sequelize-paginate': '1.1.6',
      'sequelize-transforms': '2.0.0',
    },
  };
  forEach(packages?.dependencies, (depValue, depName) => {
    if (isUri(depValue)) {
      packages.dependencies[depName] = `git+${depValue}`;
    }
  });
  forEach(packages?.devDependencies, (depValue, depName) => {
    if (isUri(depValue)) {
      packages.devDependencies[depName] = `git+${depValue}`;
    }
  });
  if (!isEmpty(packages)) {
    if (packages.dependencies) Object.assign(pkg.dependencies, packages.dependencies);
    if (packages.devDependencies) pkg.devDependencies = packages.devDependencies;
    if (packages.scripts) Object.assign(pkg.scripts, packages.scripts);
  }
  if (!isEmpty(adapter)) {
    Object.assign(pkg.dependencies, { sequelize: '~6.6.5' });
    if (adapter === 'mssql') {
      Object.assign(pkg.dependencies, { tedious: '~11.0.9' });
    } else if (adapter === 'mysql') {
      Object.assign(pkg.dependencies, { mysql2: '~2.2.5' });
    } else if (adapter === 'postgres') {
      Object.assign(pkg.dependencies, { pg: '~8.6.0' });
    }
    if (!isEmpty(jsonData.rolePermission)) {
      Object.assign(pkg.dependencies, { 'express-list-endpoints': '^5.0.0' });
    }
  }
  return pkg;
}

async function setUpAppJS (templateFolder, jsonData) {
  const app = writeOperations.loadTemplate(`${templateFolder}/app.js`);

  app.locals.NO_PLATFORM = false;
  app.locals.localModules = Object.create(null);
  app.locals.modules = Object.create(null);
  app.locals.mounts = [];
  app.locals.uses = [];

  // Request logger
  app.locals.modules.logger = 'morgan';
  app.locals.uses.push('logger(\'dev\')');

  // Body parsers
  app.locals.uses.push('express.json()');
  app.locals.uses.push('express.urlencoded({ extended: false })');

  // Cookie parser
  app.locals.modules.cookieParser = 'cookie-parser';
  app.locals.uses.push('cookieParser()');

  app.locals.uses.push('express.static(path.join(__dirname, \'public\'))');

  // role and permission
  if (jsonData && !isEmpty(jsonData.rolePermission)) {
    /*
     * app.locals.ROLES = commonService.uniqRolesFromRolePermissions(jsonData.rolePermission);
     * app.locals.ROLE_PERMISSION_MODELS = Object.keys(MODEL_FOR_ROLE_PERMISSION);
     */
    app.locals.SHOULD_ADD_ROLE_PERMISSION = true;
  } else {
    app.locals.SHOULD_ADD_ROLE_PERMISSION = false;
  }
  return app;
}

async function setDB (dir, adapter = '') {
  const db = writeOperations.loadTemplate(`${dir}/db.js`);
  if (!isEmpty(adapter)) {
    db.locals.ADAPTER = adapter;
    const dbConnection = writeOperations.loadTemplate(`${dir}/dbConnection.js`);
    return {
      db,
      dbConnection,
    };
  }
  return db;
}
async function createEnvFile (templateFolder, jsonData, {
  database, port,
}, options = {}) {
  const env = writeOperations.loadTemplate(`${templateFolder}/.env`);
  const envs = {
    env: {},
    customEnv: {},
  };

  env.locals.ENV = {
    PORT: port,
    DB_URL: `mongodb://localhost:27017/${database}`,
    DB_TEST_URL: `mongodb://localhost:27017/${database}_test`,
    ALLOW_ORIGIN: '*',
  };

  if (!isEmpty(jsonData.fileUpload) && !isEmpty(jsonData.fileUpload.uploads)) {
    const flag = find(jsonData.fileUpload.uploads, (u) => u.storage.toLowerCase() === 's3' || u.storage.toLowerCase() === 's3_private');
    if (!isEmpty(flag)) {
      env.locals.ENV = {
        ...env.locals.ENV,
        AWS_S3_ACCESS_KEY_ID: 'access-key',
        AWS_S3_SECRET_ACCESS_KEY: 'secret-access-key',
        AWS_S3_REGION: 'region',
        AWS_S3_BUCKET_NAME: 'bucket',
      };
    }
    const s3Private = find(jsonData.fileUpload.uploads, (u) => u.storage.toLowerCase() === 's3_private');
    if (!isEmpty(s3Private)) {
      env.locals.ENV = {
        ...env.locals.ENV,
        AWS_URL_EXPIRATION: 3600,
      };
    }
  }

  if (!isEmpty(options)) {
    if (!isEmpty(options.env)) {
      for (const [k, v] of Object.entries(options.env)) {
        if (k === 'DEVELOPMENT') {
          if ('PORT' in v) {
            port = v.PORT;
            jsonData.config.port = port;
          }
          if ('DB_URL' in v) {
            v.DB_URL = `mongodb://localhost:27017/${v.DB_URL}`;
          }
          env.locals.ENV = {
            ...env.locals.ENV,
            ...v,
          };
        } else {
          const customEnv = writeOperations.loadTemplate(`${templateFolder}/customEnv`);
          customEnv.locals.CUSTOM_ENV = {
            PORT: port,
            DB_URL: `mongodb://localhost:27017/${database}`,
            DB_TEST_URL: `mongodb://localhost:27017/${database}_test`,
            ALLOW_ORIGIN: '*',
            ...v,
          };
          customEnv.locals.CUSTOM_ENV = pickBy(customEnv.locals.CUSTOM_ENV, (v1) => v1 !== undefined);
          envs.customEnv[k] = customEnv;
        }
      }
    }
    if (options.socialAuth !== undefined && options.socialAuth.required) {
      for (let i = 0; i < options.socialAuth.platforms.length; i += 1) {
        const platform = options.socialAuth.platforms[i].type;
        // eslint-disable-next-line prefer-const
        if (!('clientSecret' in options.socialAuth.platforms[i].credential) || isEmpty(options.socialAuth.platforms[i].credential.clientSecret)) {
          options.socialAuth.platforms[i].credential = {
            ...options.socialAuth.platforms[i].credential,
            clientSecret: 'xxxxxxxxxxxxx',
          };
          // Object.assign(options.socialAuth.platforms[i].credential, { clientSecret: 'xxxxxxxxxxxxx' });
        }
        if (!('clientId' in options.socialAuth.platforms[i].credential) || isEmpty(options.socialAuth.platforms[i].credential.clientId)) {
          options.socialAuth.platforms[i].credential = {
            ...options.socialAuth.platforms[i].credential,
            clientId: 'xxx-xxx-xxx-xx',
          };
          // Object.assign(options.socialAuth.platforms[i].credential, { clientId: 'xxx-xxx-xxx-xx' });
        }

        let callbackURL = '';
        if (!('callbackUrl' in options.socialAuth.platforms[i].credential) || isEmpty(options.socialAuth.platforms[i].credential.callbackUrl)) {
          callbackURL = `https://localhost:${port}/auth/${platform.toLowerCase()}/callback`;
        } else {
          callbackURL = `https://localhost:${port}${options.socialAuth.platforms[i].credential.callbackUrl}`;
        }
        options.socialAuth.platforms[i].credential = {
          ...options.socialAuth.platforms[i].credential,
          callbackUrl: callbackURL,
        };

        let errorURL = '';
        if (!('errorUrl' in options.socialAuth.platforms[i].credential) || isEmpty(options.socialAuth.platforms[i].credential.errorUrl)) {
          errorURL = `https://localhost:${port}/auth/${platform.toLowerCase()}/error`;
        } else {
          errorURL = `https://localhost:${port}${options.socialAuth.platforms[i].credential.errorUrl}`;
        }
        options.socialAuth.platforms[i].credential = {
          ...options.socialAuth.platforms[i].credential,
          errorUrl: errorURL,
        };

        // eslint-disable-next-line prefer-const
        for (let [k, v] of Object.entries(options.socialAuth.platforms[i].credential)) {
          if (v !== '') {
            env.locals.ENV = {
              ...env.locals.ENV,
              [`${platform.toUpperCase()}_${k.toUpperCase()}`]: v,
            };
          }
        }
      }
    }
  }
  env.locals.ENV = pickBy(env.locals.ENV, (v) => v !== undefined);
  envs.env = env;
  return {
    envs,
    jsonData,
  };
}

async function createEnvFileSequelize (templateFolder, jsonData, {
  database, port,
}, options = {}) {
  const env = writeOperations.loadTemplate(`${templateFolder}/.env`);
  const envs = {
    env: {},
    customEnv: {},
  };

  let dbPort;
  if (jsonData.adapter === 'mysql') {
    dbPort = 3306;
  } else if (jsonData.adapter === 'mssql') {
    dbPort = 1433;
  } else if (jsonData.adapter === 'postgres') {
    dbPort = 5432;
  }
  env.locals.ENV = {
    PORT: port,
    DATABASE_NAME: `${database}`,
    ALLOW_ORIGIN: '*',
    DATABASE_USERNAME: 'user',
    DATABASE_PASSWORD: 'password',
    HOST: 'localhost',
    DB_PORT: dbPort,
  };

  if (options.shouldAddTestCaseVariables) {
    Object.assign(env.locals.ENV, {
      TEST_HOST: 'localhost',
      TEST_DATABASE_USERNAME: 'test_user',
      TEST_DATABASE_PASSWORD: 'test_password',
      TEST_DATABASE_NAME: `${database}_test`,
      TEST_DB_PORT: dbPort,
    });
  }
  if (!isEmpty(jsonData.fileUpload) && !isEmpty(jsonData.fileUpload.uploads)) {
    const flag = find(jsonData.fileUpload.uploads, (u) => u.storage.toLowerCase() === 's3' || u.storage.toLowerCase() === 's3_private');
    if (!isEmpty(flag)) {
      env.locals.ENV = {
        ...env.locals.ENV,
        AWS_S3_ACCESS_KEY_ID: 'access-key',
        AWS_S3_SECRET_ACCESS_KEY: 'secret-access-key',
        AWS_S3_REGION: 'region',
        AWS_S3_BUCKET_NAME: 'bucket',
      };
    }
    const s3Private = find(jsonData.fileUpload.uploads, (u) => u.storage.toLowerCase() === 's3_private');
    if (!isEmpty(s3Private)) {
      env.locals.ENV = {
        ...env.locals.ENV,
        AWS_URL_EXPIRATION: 3600,
      };
    }
  }

  if (!isEmpty(options)) {
    if (!isEmpty(options.env)) {
      for (const [k, v] of Object.entries(options.env)) {
        if (k === 'DEVELOPMENT') {
          if ('PORT' in v) {
            port = v.PORT;
            jsonData.config.port = port;
          }
          env.locals.ENV = {
            ...env.locals.ENV,
            ...v,
          };
        } else {
          const customEnv = writeOperations.loadTemplate(`${templateFolder}/customEnv`);
          customEnv.locals.CUSTOM_ENV = {
            PORT: port,
            DATABASE_NAME: `${database}`,
            ALLOW_ORIGIN: '*',
            DATABASE_USERNAME: 'user',
            DATABASE_PASSWORD: 'password',
            HOST: 'localhost',
            DB_PORT: dbPort,
            ...v,
          };
          customEnv.locals.CUSTOM_ENV = pickBy(customEnv.locals.CUSTOM_ENV, (v1) => v1 !== undefined);
          envs.customEnv[k] = customEnv;
        }
      }
    }
    if (options.socialAuth !== undefined && options.socialAuth.required) {
      for (let i = 0; i < options.socialAuth.platforms.length; i += 1) {
        const platform = options.socialAuth.platforms[i].type;
        // eslint-disable-next-line prefer-const
        if (!('clientSecret' in options.socialAuth.platforms[i].credential) || isEmpty(options.socialAuth.platforms[i].credential.clientSecret)) {
          options.socialAuth.platforms[i].credential = {
            ...options.socialAuth.platforms[i].credential,
            clientSecret: 'xxxxxxxxxxxxx',
          };
          // Object.assign(options.socialAuth.platforms[i].credential, { clientSecret: 'xxxxxxxxxxxxx' });
        }
        if (!('clientId' in options.socialAuth.platforms[i].credential) || isEmpty(options.socialAuth.platforms[i].credential.clientId)) {
          options.socialAuth.platforms[i].credential = {
            ...options.socialAuth.platforms[i].credential,
            clientId: 'xxx-xxx-xxx-xx',
          };
          // Object.assign(options.socialAuth.platforms[i].credential, { clientId: 'xxx-xxx-xxx-xx' });
        }
        let callbackURL = '';
        if (!('callbackUrl' in options.socialAuth.platforms[i].credential) || isEmpty(options.socialAuth.platforms[i].credential.callbackUrl)) {
          callbackURL = `https://localhost:${port}/auth/${platform.toLowerCase()}/callback`;
        } else {
          callbackURL = `https://localhost:${port}${options.socialAuth.platforms[i].credential.callbackUrl}`;
        }
        options.socialAuth.platforms[i].credential = {
          ...options.socialAuth.platforms[i].credential,
          callbackUrl: callbackURL,
        };
        let errorURL = '';
        if (!('errorUrl' in options.socialAuth.platforms[i].credential) || isEmpty(options.socialAuth.platforms[i].credential.errorUrl)) {
          errorURL = `https://localhost:${port}/auth/${platform.toLowerCase()}/error`;
        } else {
          errorURL = `https://localhost:${port}${options.socialAuth.platforms[i].credential.errorUrl}`;
        }
        options.socialAuth.platforms[i].credential = {
          ...options.socialAuth.platforms[i].credential,
          errorUrl: errorURL,
        };

        // eslint-disable-next-line prefer-const
        for (let [k, v] of Object.entries(options.socialAuth.platforms[i].credential)) {
          if (v !== '') {
            env.locals.ENV = {
              ...env.locals.ENV,
              [`${platform.toUpperCase()}_${k.toUpperCase()}`]: v,
            };
          }
        }
      }
    }
  }
  env.locals.ENV = pickBy(env.locals.ENV, (v) => v !== undefined);
  envs.env = env;
  return {
    envs,
    jsonData,
  };
}

async function createValidationFile (validationFilePath, jsonData, auth, adapter = '', enumData) {
  const {
    isAuth, userModel, socialAuth,
  } = auth;
  if (socialAuth.required) {
    const ssoAuthKeys = { ssoAuth: {} };
    if (isEmpty(adapter)) {
      for (let i = 0; i < socialAuth.platforms.length; i += 1) {
        Object.assign(ssoAuthKeys.ssoAuth, { [`${socialAuth.platforms[i].type.toLowerCase()}Id`]: { type: 'String' } });
      }
    } else {
      for (let i = 0; i < socialAuth.platforms.length; i += 1) {
        Object.assign(ssoAuthKeys.ssoAuth, { [`${socialAuth.platforms[i].type.toLowerCase()}Id`]: { type: 'STRING' } });
      }
    }
    forEach(jsonData[userModel], (v, k) => {
      if (k.includes('SSO'.toLowerCase())) {
        delete jsonData[userModel][k];
      }
    });
    Object.assign(jsonData[userModel], ssoAuthKeys);
  }
  const {
    modelObj, updateModelObj,
  } = adapter ? await sequelizeValidation.getValidation(jsonData, enumData) : await validation.getValidation(jsonData, enumData);

  jsonData = modelObj;
  const validatedObj = {};

  forEach(jsonData.models, (value, key) => {
    let flag = false;
    for (const index in enumData) {
      if (index === key) {
        flag = true;
      }
    }
    const validationTemp = writeOperations.loadTemplate(`${validationFilePath.templateFolderName}/${validationFilePath.validationFolderPath}/validateSchema.js`);
    const jsonValStr = JSON.stringify(value, null, '\t');
    const updateJsonStr = JSON.stringify(updateModelObj.models[key], null, '\t');
    let valStr = '';
    let updateValStr = '';
    valStr = jsonValStr.toString().replace(/"/g, '');
    updateValStr = updateJsonStr.toString().replace(/"/g, '');
    if (isAuth && userModel === key) {
      validationTemp.locals.IS_AUTH = true;
    } else {
      validationTemp.locals.IS_AUTH = false;
    }
    if (flag) {
      validationTemp.locals.ENUM_SUPPORT = enumData;
    } else {
      validationTemp.locals.ENUM_SUPPORT = false;
    }
    if (enumData && enumData[key]) {
      const array = [];
      for (const enumIndex in enumData[key]) {
        if (!array.includes(enumData[key][enumIndex].enumFile)) {
          array.push(enumData[key][enumIndex].enumFile);
        }
      }
      validationTemp.locals.ENUM_VALIDATION = array;
    } else {
      validationTemp.locals.ENUM_VALIDATION = false;
    }
    validationTemp.locals.UPDATE_VALIDATION_KEY = updateValStr;
    validationTemp.locals.VALIDATION_KEY = valStr;
    validationTemp.locals.MODEL_NAME = key;
    validationTemp.locals.PATH = validationFilePath.validationFolderPath;
    validationTemp.locals.MODEL_NAME = key;
    if (!isEmpty(jsonData.validationVariables) && !isEmpty(jsonData.validationVariables[key])) {
      validationTemp.locals.VARIABLES = jsonData.validationVariables[key];
    }
    validatedObj[key] = validationTemp;
  });
  return validatedObj;
}
async function createPostmanCollection (pName, postmanCollections, auth) {
  const {
    isAuth, userModel, userLoginWith, loginAccessPlatform, userRoles, socialAuth,
  } = auth;
  const infoForPostman = {
    project: {},
    item: null,
  };
  infoForPostman.project.name = pName;
  infoForPostman.project.descriptions = `${pName} API Collections`;
  const platforms = await postman.getCollectionForPostman(postmanCollections, isAuth, userModel, userLoginWith, loginAccessPlatform, userRoles, socialAuth);
  infoForPostman.item = platforms;
  const jsonCollectionsV20 = await generatePostmanCollection.createCollectionV2_0(infoForPostman);
  const jsonCollectionsV21 = await generatePostmanCollection.createCollectionV2_1(infoForPostman);
  const envPostman = await postman.generateEnvForPostman(postmanCollections.config);
  return [jsonCollectionsV20, jsonCollectionsV21, envPostman];
}
async function createCCBlankFolder (dir, userDirectoryStructure) {
  writeOperations.mkdir(dir, userDirectoryStructure.controllerFolderPath);
  writeOperations.mkdir(dir, userDirectoryStructure.modelFolderPath);
  writeOperations.mkdir(dir, userDirectoryStructure.entityFolderPath);
  writeOperations.mkdir(dir, userDirectoryStructure.configFolderPath);
  writeOperations.mkdir(dir, userDirectoryStructure.publicFolderPath);
  writeOperations.mkdir(dir, userDirectoryStructure.routesFolderPath);
  writeOperations.mkdir(dir, userDirectoryStructure.helperFolderPath);
  writeOperations.mkdir(dir, userDirectoryStructure.utilsFolderPath);
  writeOperations.mkdir(dir, userDirectoryStructure.validationFolderPath);
  writeOperations.mkdir(dir, userDirectoryStructure.serviceFolderPath);
  writeOperations.mkdir(dir, userDirectoryStructure.middlewareFolderPath);
  writeOperations.mkdir(dir, userDirectoryStructure.viewsFolderPath);
  writeOperations.mkdir(dir, 'postman');
  writeOperations.mkdir(dir, 'seeders');
}

async function envParser (env) {
  const envObj = {};
  forEach(env.environments, (value) => {
    envObj[value] = {};
    forEach(env.customJson, (envKeyValue) => {
      envObj[value][envKeyValue.key] = envKeyValue.value[value];
    });
  });
  return envObj;
}

async function addSeederMongoose (jsonData, filePath, authObj) {
  const roles = authObj.userRoles;
  const { models } = jsonData;
  const seeder = writeOperations.loadTemplate(`${filePath}/index.js`);
  const credentials = !isEmpty(jsonData.authentication.credentials) ? jsonData.authentication.credentials : {};
  const { userModel } = authObj;
  const array = []; const userArray = []; const passwordArray = []; const
    getRoles = [];
  const requiredKeys = [];
  const user = {};
  forEach(models, (allSchema, allModels) => {
    if (allModels === userModel) {
      forEach(allSchema, (nestSchema, nestModel) => {
        if (has(nestSchema, 'required')) {
          requiredKeys.push(nestModel);
        }
      });
    }
  });
  forEach(roles, (allRoles) => {
    const fakeDataOfModels = fakeDataMongoose.validSchema(cloneDeep(models));
    if (!isEmpty(requiredKeys)) {
      for (const credentialKeys of credentials) {
        for (const keys of requiredKeys) {
          if (keys in fakeDataOfModels[userModel]) {
            credentialKeys[keys] = fakeDataOfModels[userModel][keys];
          }
        }
      }
    }
    let authFakeData = {};
    if (!isEmpty(credentials)) {
      const existCredentials = credentials.find((credential) => (credential.type === allRoles));
      if (!isEmpty(existCredentials)) {
        authFakeData = existCredentials;
      } else {
        authFakeData = fakeDataOfModels[userModel];
      }
    } else {
      authFakeData = fakeDataOfModels[userModel];
    }

    if (allRoles !== 'SYSTEM_USER') {
      authFakeData = removeGivenKeyFromObject(authFakeData,
        ['id', 'resetPasswordLink', 'loginRetryLimit', 'loginReactiveTime', 'addedBy', 'role', 'isActive', 'isDeleted', 'updatedBy', 'createdAt', 'updatedAt']);
      user[allRoles] = authFakeData;
      const rolesArray = [];
      rolesArray.push(roles);
      const userToBeSeeded = {
        [authObj.userLoginWith.password]: `${authFakeData[authObj.userLoginWith.password]}`,
        [authObj.userLoginWith.username[0]]: `${authFakeData[authObj.userLoginWith.username[0]]}`,
      };
      for (const i of requiredKeys) {
        if (has(authFakeData, i)) {
          userToBeSeeded[i] = authFakeData[i];
        }
      }
      const userFindCondition = {
        [authObj.userLoginWith.username[0]]: authFakeData[authObj.userLoginWith.username[0]],
        isActive: true,
        isDeleted: false,
      };
      const userPassword = authFakeData[authObj.userLoginWith.password];
      array.push(userFindCondition);
      passwordArray.push(userPassword);
      userArray.push(userToBeSeeded);
      getRoles.push(allRoles);

      seeder.locals.USER_EXIST_CONDITION = array;
      seeder.locals.USER_PASSWORD = passwordArray;
      seeder.locals.USER = userArray;
      seeder.locals.MODEL = userModel;
      seeder.locals.ROLE_NAME = getRoles;
    }
    // role permission
    if (!isEmpty(jsonData.rolePermission)) {
      seeder.locals.ROLES = commonService.uniqRolesFromRolePermissions(jsonData.rolePermission);
      seeder.locals.ROLE_PERMISSION_MODELS = Object.keys(MODEL_FOR_ROLE_PERMISSION);
      seeder.locals.SHOULD_ADD_ROLE_PERMISSION = true;
      seeder.locals.ROUTE_ROLE_ARRAY = commonService.getRouteRoleArray(jsonData.rolePermission);
      seeder.locals.DEFAULT_ADMIN_EMAIL = DEFAULT_ADMIN_EMAIL;
      seeder.locals.DEFAULT_ADMIN_USERNAME = DEFAULT_ADMIN_USERNAME;
      seeder.locals.DEFAULT_ROLE = DEFAULT_ROLE;
    } else {
      seeder.locals.SHOULD_ADD_ROLE_PERMISSION = false;
    }
  });
  return [seeder, user];
}

async function addSeederSequelize (jsonData, filePath, authObj) {
  // const roles = commonService.uniqRolesFromRolePermissions(jsonData.rolePermission);
  const roles = authObj.userRoles;
  const { models } = jsonData;
  const seeder = writeOperations.loadTemplate(`${filePath}/index.js`);
  const { userModel } = authObj;
  const credentials = !isEmpty(jsonData.authentication.credentials) ? jsonData.authentication.credentials : {};

  const array = []; const userArray = []; const passwordArray = []; const
    getRoles = [];
  const user = {};
  const requiredKeys = [];
  forEach(models, (allSchema, allModels) => {
    if (allModels === userModel) {
      forEach(allSchema, (nestSchema, nestModel) => {
        if (has(nestSchema, 'required')) {
          requiredKeys.push(nestModel);
        }
      });
    }
  });
  forEach(roles, (allRoles) => {
    const fakeDataOfModels = fakeDataSequelize.validSchema(cloneDeep(models));
    if (!isEmpty(requiredKeys)) {
      for (const credentialKeys of credentials) {
        for (const keys of requiredKeys) {
          if (keys in fakeDataOfModels[userModel]) {
            credentialKeys[keys] = fakeDataOfModels[userModel][keys];
          }
        }
      }
    }
    let authFakeData = {};
    if (!isEmpty(credentials)) {
      const existCredentials = credentials.find((credential) => (credential.type === allRoles));
      if (!isEmpty(existCredentials)) {
        authFakeData = existCredentials;
      } else {
        authFakeData = fakeDataOfModels[userModel];
      }
    } else {
      authFakeData = fakeDataOfModels[userModel];
    }
    if (allRoles !== 'SYSTEM_USER') {
      authFakeData = removeGivenKeyFromObject(authFakeData,
        ['id', 'resetPasswordLink', 'loginRetryLimit', 'loginReactiveTime', 'addedBy', 'role', 'isActive', 'isDeleted', 'updatedBy', 'createdAt', 'updatedAt']);
      user[allRoles] = authFakeData;
      const userToBeSeeded = {
        [authObj.userLoginWith.password]: `${authFakeData[authObj.userLoginWith.password]}`,
        [authObj.userLoginWith.username[0]]: `${authFakeData[authObj.userLoginWith.username[0]]}`,
      };
      for (const i of requiredKeys) {
        if (has(authFakeData, i)) {
          userToBeSeeded[i] = authFakeData[i];
        }
      }
      const userFindCondition = {
        [authObj.userLoginWith.username[0]]: authFakeData[authObj.userLoginWith.username[0]],
        isActive: true,
        isDeleted: false,
      };
      const userPassword = authFakeData[authObj.userLoginWith.password];
      array.push(userFindCondition);
      passwordArray.push(userPassword);
      userArray.push(userToBeSeeded);
      getRoles.push(allRoles);

      seeder.locals.USER_EXIST_CONDITION = array;
      seeder.locals.USER_PASSWORD = passwordArray;
      seeder.locals.USER = userArray;
      seeder.locals.MODEL = userModel;
      seeder.locals.ROLE_NAME = getRoles;
    }
    // role and permission
    if (!isEmpty(jsonData.rolePermission)) {
      seeder.locals.ROLES = commonService.uniqRolesFromRolePermissions(jsonData.rolePermission);
      seeder.locals.ROLE_PERMISSION_MODELS = Object.keys(MODEL_FOR_ROLE_PERMISSION);
      seeder.locals.SHOULD_ADD_ROLE_PERMISSION = true;
      seeder.locals.ROUTE_ROLE_ARRAY = commonService.getRouteRoleArray(jsonData.rolePermission);
      seeder.locals.DEFAULT_ADMIN_EMAIL = DEFAULT_ADMIN_EMAIL;
      seeder.locals.DEFAULT_ADMIN_USERNAME = DEFAULT_ADMIN_USERNAME;
      seeder.locals.DEFAULT_ROLE = DEFAULT_ROLE;
    } else {
      seeder.locals.SHOULD_ADD_ROLE_PERMISSION = false;
    }
  });
  return [seeder, user];
}
const commonServiceFile = async (path, jsonData) => {
  const common = writeOperations.loadTemplate(`${path}/common.js`);
  common.locals.IS_AUTH = jsonData.authentication.isAuthentication;
  common.locals.LOGIN_WITH = jsonData.authentication.loginWith?.username?.length ? jsonData.authentication.loginWith?.username : ['email'];
  common.locals.MODEL = jsonData.authentication.authModel;
  if (!isEmpty(jsonData.rolePermission)) {
    common.locals.ROLE_PERMISSION = true;
  } else {
    common.locals.ROLE_PERMISSION = false;
  }
  return common;
};

module.exports = {
  createMVCBlankFolder,
  createPackageJson,
  createPackageJsonForSequelize,
  setUpAppJS,
  setDB,
  createEnvFile,
  createValidationFile,
  createPostmanCollection,
  createCCBlankFolder,
  envParser,
  addSeederMongoose,
  addSeederSequelize,
  commonServiceFile,
  createEnvFileSequelize,
};
