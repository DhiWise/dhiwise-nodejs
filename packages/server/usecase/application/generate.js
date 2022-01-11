/* global _,appRootPath */
const fs = require('fs');
const path = require('path');
const fsExtra = require('fs-extra');
const mongoose = require('mongoose');
const os = require('os');
const { getAllDirFilesCount } = require('../../util-service/common');
const { decrypt } = require('../../util-service/crypto');
const {
  IN_QUEUE, IN_PROCESS, COMPLETED, FAILED,
} = require('../../models/constants/application').IN_PROCESS_STATUS;
const {
  GENERATOR_ORM_TYPE, GENERATOR_DATABASE_TYPE,
} = require('../../models/constants/applicationConfig');
const {
  ROUTE_GENERATE_TYPE, CONSTANT_GENERATE_TYPE, POLICY_GENERATE_TYPE,
} = require('../../models/constants/project');
const SchemaDetailRepo = require('../../repo/schemaDetail');
const ProjectRouteRepo = require('../../repo/projectRoute');
const QueryBuilderRepo = require('../../repo/queryBuilder');
const ProjectPolicyRepo = require('../../repo/projectPolicy');
const ProjectConstantRepo = require('../../repo/projectConstant');
const ApplicationConfigRepo = require('../../repo/applicationConfig');
const EnvVariablesRepo = require('../../repo/envVariables');
const ProjectRoleAccessPermissionsRepo = require('../../repo/projectRoleAccessPermissions');
const NestedQueryBuilderRepo = require('../../repo/nestedQueryBuilder');

const {
  SCHEMA_IS_EMPTY, INVALID_REQUEST_PARAMS, BAD_REQUEST, GENERATOR_FAILED_CREATE, SERVER_ERROR, OK, PROJECT_GENERATED,
} = require('../../constants/message').message;
const generator = require('./node-generator/generator');

const homedir = os.homedir();

const SchemaDetail = new SchemaDetailRepo();
const ProjectRoute = new ProjectRouteRepo();
const QueryBuilder = new QueryBuilderRepo();
const ProjectPolicy = new ProjectPolicyRepo();
const ProjectConstant = new ProjectConstantRepo();
const ApplicationConfig = new ApplicationConfigRepo();
const EnvVariables = new EnvVariablesRepo();
const ProjectRoleAccessPermissions = new ProjectRoleAccessPermissionsRepo();
const NestedQueryBuilder = new NestedQueryBuilderRepo();

const generateNodeCode = async (
  input, applicationRepo, definition, generatedId, dirPath, projectName, applicationId, generatorRepo, isReBuild,
) => {
  try {
    const updatedApp = await applicationRepo.update(applicationId, { 'inProcessStatus.build_app': IN_PROCESS });
    await generatorRepo.update(generatedId, { 'inProcessStatus.build_app': IN_PROCESS });
    await generator(input, isReBuild);
    // eslint-disable-next-line max-len
    const lastGeneratorRecord = await generatorRepo.getDetails({
      find: {
        applicationId,
        isDeleted: false,
        'inProcessStatus.build_app': COMPLETED,
      },
      sortBy: { _id: -1 },
      skip: 4,
    });
    if (lastGeneratorRecord && lastGeneratorRecord.length) {
      for (let i = 0; i < lastGeneratorRecord.length; i += 1) {
        const deletePath = `${homedir}${definition.generatorPath}/${lastGeneratorRecord[i]._id}`;
        // eslint-disable-next-line no-await-in-loop
        await generatorRepo.update(lastGeneratorRecord[i]._id, { isDeleted: true });
        if (fs.existsSync(deletePath)) {
          fs.rmdirSync(deletePath, { recursive: true });
        }
      }
    }

    // update the application status if log file contain error status in data
    const logPath = `${definition.generatorPath}/${generatedId}/log.json`;
    let logData;
    if (fs.existsSync(logPath)) logData = JSON.parse(fs.readFileSync(logPath, 'utf8'));

    // if logData contain error then stop the process and send message as a that application and generatoe build failed
    if (logData && _.find(logData.data, (val) => (val.status === 'error'))) {
      await applicationRepo.update(applicationId, { 'inProcessStatus.build_app': FAILED });
      await generatorRepo.update(generatedId, { 'inProcessStatus.build_app': FAILED });
    } else {
      let dirFilesCount;
      let nextProcess = true;
      try {
        dirFilesCount = await getAllDirFilesCount(dirPath);
      } catch (e) {
        nextProcess = false;
        await applicationRepo.update(applicationId, { 'inProcessStatus.build_app': FAILED });
        await generatorRepo.update(generatedId, { 'inProcessStatus.build_app': FAILED });
        // console.log(e);
      }
      if (nextProcess) {
        const updateApplication = {
          statics: { filesCount: dirFilesCount },
          lastBuildAt: new Date(),
          'inProcessStatus.build_app': COMPLETED,
          generatedId: updatedApp.tempGeneratedId,
          tempGeneratedId: null,
        };
        await applicationRepo.update(applicationId, updateApplication);
        await generatorRepo.update(generatedId, { 'inProcessStatus.build_app': COMPLETED });
      }
    }
    return true;
  } catch (e) {
    await applicationRepo.update(applicationId, { 'inProcessStatus.build_app': FAILED });
    await generatorRepo.update(generatedId, { 'inProcessStatus.build_app': FAILED });
    return false;
  }
};

const nodeExpressRequest = async (applicationId, project, schemaRepo) => {
  let filter = { find: { applicationId } };
  let models = await schemaRepo.getDetails(filter);

  if (!models || !models.length) {
    return SCHEMA_IS_EMPTY;
  }
  const modelsData = _.cloneDeep(models);
  filter = { find: { schemaId: { $in: _.map(models, '_id') } } };
  let additionalSchema = await SchemaDetail.getDetails(filter);

  if (additionalSchema.length) {
    additionalSchema = _.groupBy(additionalSchema, 'schemaId');
  } else {
    additionalSchema = {};
  }
  const modelsById = _.groupBy(models, '_id');
  models = _.groupBy(models, 'name');
  const modelConfig = {};
  const newModelConfig = {};
  const hooks = {};
  const modelIndexes = {};
  const modelEnum = {};
  const modelPrivate = {};
  const modelAdvanceOptions = {};

  let customPlatForms = ['admin', 'device', 'client', 'desktop']; // Default platforms
  if (project?.configInput?.platform) {
    customPlatForms = _.cloneDeep(project.configInput.platform);
  }

  _.each(models, (d, dataKey) => {
    if (d[0].hooks && d[0].hooks.length) {
      hooks[dataKey] = _.groupBy(d[0].hooks, 'type');
    }
    if (additionalSchema[d[0]._id]) {
      const additionalData = additionalSchema[d[0]._id.toString()][0];
      if (additionalData.additionalJson && additionalData.additionalJson.additionalSetting) {
        newModelConfig[dataKey] = additionalData.additionalJson.additionalSetting;
      }
      modelConfig[dataKey] = {};
      _.each(additionalData.schemaJson, (val, key) => {
        if (customPlatForms.includes(key)) {
          modelConfig[dataKey][key] = [];
          _.each(val, (flag) => {
            if (flag) modelConfig[dataKey][key].push(flag);
          });
        }
      });
    }
    if (d[0].modelIndexes) {
      modelIndexes[dataKey] = d[0].modelIndexes;
    }
    if (d[0].customJson) {
      if (d[0].customJson.additionalSetting) {
        _.each(d[0].customJson.additionalSetting, (eV, eK) => {
          if (eV.enum) {
            if (!modelEnum[dataKey]) modelEnum[dataKey] = {};
            modelEnum[dataKey][eK] = eV.enum;
          } else {
            _.each(eV, (sv, sk) => {
              if (sv.enum) {
                if (!modelEnum[dataKey]) modelEnum[dataKey] = {};
                if (!modelEnum[dataKey][eK]) modelEnum[dataKey][eK] = {};
                modelEnum[dataKey][eK][sk] = sv.enum;
              }
            });
          }
          if (eV.private) {
            if (!modelPrivate[dataKey]) modelPrivate[dataKey] = {};
            modelPrivate[dataKey][eK] = eV.private;
          } else {
            _.each(eV, (sv, sk) => {
              if (sv.private) {
                if (!modelPrivate[dataKey]) modelPrivate[dataKey] = {};
                if (!modelPrivate[dataKey][eK]) modelPrivate[dataKey][eK] = {};
                modelPrivate[dataKey][eK][sk] = sv.private;
              }
            });
          }
        });
      }
    }
  });
  _.each(models, (val, key) => {
    models[key] = val[0].schemaJson;
    if (val[0]?.tableName) {
      modelAdvanceOptions[key] = { tableName: val[0]?.tableName };
    }
  });

  // custom routes
  let apis = await ProjectRoute.getDetails({
    find: {
      applicationId,
      type: ROUTE_GENERATE_TYPE.MANUAL,
    },
  });

  if (apis.length) {
    let queries = await QueryBuilder.getDetails({ find: { applicationId } });
    queries = _.groupBy(queries, 'referenceId');
    _.each(queries, (qv, qk) => {
      queries[qk] = _.map(qv, (d) => _.omit(d, ['applicationId', '_id', 'id', 'referenceId', 'requestModelId',
        'addedBy', 'updatedBy', 'referenceType', 'modelId', 'filterJson', 'isActive', 'isDeleted', 'createdAt', 'updatedAt']));
    });
    apis = _.map(apis, (a) => {
      const obj = {
        model: a.groupName,
        policies: a.policies,
        method: a.method,
        api: a.route,
        controller: a.controller,
        service: a.controller,
        descriptions: a.description,
        platform: a.platform,
        functionName: a.action,
        headers: a.headers ?? [],
        queryBuilder: queries[a._id.toString()] ?? [],
      };
      if (a?.fileUpload && a?.fileUpload?.uploads && a?.fileUpload?.uploads[0]) {
        obj.queryBuilder.unshift({
          queryMode: 'fileUpload',
          ...a?.fileUpload?.uploads[0],
        });
      }
      return obj;
    });
  }

  // custom policy
  let policy = await ProjectPolicy.getDetails({
    find: {
      applicationId,
      type: POLICY_GENERATE_TYPE.MANUAL,
    },
  });
  if (policy.length) {
    policy = _.groupBy(policy, 'fileName');
  } else {
    policy = {};
  }
  _.each(policy, (val, key) => {
    policy[key] = {
      functionName: val[0].fileName,
      code: val[0].customJson,
    };
  });

  // constant
  let constants = await ProjectConstant.getDetails({
    find: {
      applicationId,
      type: CONSTANT_GENERATE_TYPE.MANUAL,
    },
  });
  if (constants.length) {
    constants = _.groupBy(constants, 'fileName');
    _.each(constants, (val, key) => {
      constants[key] = val[0].customJson;
    });
  } else {
    constants = {};
  }

  // ApplicationConfig
  let applicationConfig = await ApplicationConfig.getDetails({ find: { applicationId } });
  if (applicationConfig.length) {
    [applicationConfig] = applicationConfig;
  } else {
    applicationConfig = {};
  }
  const { fileUpload } = applicationConfig;
  if (applicationConfig && applicationConfig.socialPlatform && applicationConfig.socialPlatform.length) {
    applicationConfig.socialPlatform = _.map(applicationConfig.socialPlatform, (data) => {
      if (data.platform) data.platforms = data.platform;
      return data;
    });
  }

  // Get ENV-Variables details
  const envVariablesFilter = {
    find: { applicationId },
    fields: ['customJson', 'environments'],
  };
  const envVariables = await EnvVariables.get(envVariablesFilter);
  if (envVariables && envVariables.customJson) {
    // Convert Encrypted values in Decrypted form.
    _.each(envVariables.customJson, (val) => {
      if (val && val.value) {
        _.each(val.value, async (v, k) => {
          let isDecrypt = true;
          if ((val?.dataType) && _.indexOf(['string'], val.dataType.toLowerCase()) < 0) {
            isDecrypt = false;
          }
          if (isDecrypt) {
            const decryptedValue = await decrypt(v);
            val.value[k] = decryptedValue;
          }
        });
      }
    });
    delete envVariables._id;
  }

  const responseFormat = {};
  if (applicationConfig?.responseFormatter?.length > 0) {
    const responseFormatGroup = _.groupBy(applicationConfig.responseFormatter, 'modelId');
    _.each(responseFormatGroup, (data, key) => {
      if (key && !_.includes([undefined, 'undefined', null], key)) {
        let modelDetails = _.map(modelsData, (mData) => {
          if (mData._id.toString() === key) {
            return mData;
          }
          return {};
        });
        modelDetails = _.reject(modelDetails, _.isEmpty);
        if (modelDetails && modelDetails.length > 0) {
          responseFormat[modelDetails[0].name] = _.cloneDeep(data);
        }
      } else {
        responseFormat.allModels_data_format = _.cloneDeep(data);
      }
    });
  }

  applicationConfig = {
    restrictNoOfDevice: applicationConfig.restrictNoOfDevice,
    noOfDevice: applicationConfig.noOfDevice,
    authModule: applicationConfig.authModule || null,
    loginWith: applicationConfig.loginWith || {},
    loginRetryLimit: applicationConfig.loginRetryLimit || {},
    loginRateLimit: applicationConfig.loginRateLimit || {},
    loginNextRetryTime: applicationConfig.loginNextRetryTime || null,
    resetPassword: applicationConfig.resetPassword || {},
    isSocialMediaAuth: applicationConfig.isSocialMediaAuth || null,
    socialPlatform: applicationConfig.socialPlatform || [],
    addDataFormate: responseFormat,
  };

  const roleAccessPermissions = await ProjectRoleAccessPermissions.getDetails({ find: { applicationId } });
  const rolePermission = {};
  _.each(roleAccessPermissions, (val) => {
    if (val.customJson && val.customJson.length) {
      _.each(val.customJson, (v) => {
        if (v.modelId) {
          if (modelsById[v.modelId]) {
            _.each(v.actions, (flag, key) => {
              if (flag) {
                if (!rolePermission[modelsById[v.modelId][0].name]) {
                  rolePermission[modelsById[v.modelId][0].name] = {};
                }
                if (rolePermission[modelsById[v.modelId][0].name][key]) {
                  rolePermission[modelsById[v.modelId][0].name][key].push(val.name);
                } else {
                  rolePermission[modelsById[v.modelId][0].name][key] = [val.name];
                }
              }
            });
          }
        }
      });
    }
  });

  let nestedCallData = await NestedQueryBuilder.getDetails({ find: { applicationId } });
  const nestedCall = {};
  if (nestedCallData.length) {
    nestedCallData = _.groupBy(nestedCallData, 'model');
    _.each(nestedCallData, (platformData, platform) => {
      if (!nestedCall[platform]) nestedCall[platform] = {};
      platformData = _.groupBy(platformData, 'platform');
      _.each(platformData, (modelData, model) => {
        if (!nestedCall[platform][model]) nestedCall[platform][model] = {};
        modelData = _.groupBy(modelData, 'operation');
        _.each(modelData, (operationData, operation) => {
          operationData = _.groupBy(operationData, 'operationMode');
          if (!nestedCall[platform][model][operation]) nestedCall[platform][model][operation] = {};
          _.each(operationData, (operationModeData, mode) => {
            nestedCall[platform][model][operation][mode] = _.map(operationModeData, (d) => ({
              queryMode: d.queryMode,
              existingVariable: d.existingVariable,
              filter: d.filter,
            }));
          });
        });
      });
    });
  }
  return {
    models,
    modelIndexes,
    modelConfig,
    newModelConfig,
    modelEnum,
    modelPrivate,
    routes: { apis },
    policy,
    constants,
    applicationConfig,
    fileUpload: fileUpload || {},
    environmentVariables: envVariables,
    envVariables,
    hooks,
    rolePermission,
    nestedCall,
    modelAdvanceOptions,
  };
};

const getDirectoryAndFiles = (source) => {
  const directory = [];
  const files = [];
  fs.readdirSync(source).forEach((file) => {
    if (fs.lstatSync(path.resolve(source, file)).isDirectory()) {
      directory.push(file);
    } else {
      files.push(file);
    }
  });
  return {
    directory,
    files,
  };
};

const overwriteProject = async (generatedId, projectName) => {
  await fsExtra.copy(`./output/${generatedId}/${projectName}/.env`, `./output/${generatedId}/${projectName}_dhiwise_temp_app/.env`);

  const outputProjectDir = `./output/${generatedId}/${projectName}`;
  // fsExtra.emptyDirSync(directory);

  const {
    directories, files,
  } = await getDirectoryAndFiles(outputProjectDir);

  _.forEach(directories, (dirName) => {
    if (dirName !== 'node_modules') {
      fsExtra.emptyDirSync(`${outputProjectDir}/${dirName}`);
    }
  });

  _.forEach(files, (fileName) => {
    fsExtra.remove(`${outputProjectDir}/${fileName}`);
  });

  await fsExtra.copy(`./output/${generatedId}/${projectName}_dhiwise_temp_app`, `./output/${generatedId}/${projectName}`); // copies file
  await fsExtra.remove(`./output/${generatedId}/${projectName}_dhiwise_temp_app`);
};

const generate = (applicationRepo, schemaRepo, generatorRepo) => async (params) => {
  try {
    if (!params.applicationId) {
      return INVALID_REQUEST_PARAMS;
    }
    if (params.applicationId) {
      const isValidId = mongoose.Types.ObjectId.isValid(params.applicationId);
      if (!isValidId) {
        return INVALID_REQUEST_PARAMS;
      }
    }
    const filter = { id: params.applicationId };
    let project = await applicationRepo.getById(filter);

    if (!project) {
      return {
        ...BAD_REQUEST,
        data: {},
      };
    }

    if (project && project.inProcessStatus && (project.inProcessStatus.build_app === IN_QUEUE || project.inProcessStatus.build_app === IN_PROCESS)) {
      return {
        ...OK,
        data: { applicationId: project.id },
      };
    }

    let generated;
    let isReBuild = false;

    const definition = {
      generatorPath: `${appRootPath}/output`,
      inputPath: `${appRootPath}/input`,
      code: 'NODE_EXPRESS',
    };

    const obj = {
      config: definition,
      applicationId: params.applicationId,
      type: 1,
      status: 2,
      versionNumber: '1',
      semanticVersionNumber: '1.0',
    };

    if (params.applicationId) {
      const query = {
        find: {
          applicationId: params.applicationId,
          isDeleted: false,
          config: definition,
          type: 1,
          status: 2,
        },
        sortBy: { _id: -1 },
      };

      const generatedApps = await generatorRepo.getDetails(query);

      if (generatedApps.length > 0) {
        // eslint-disable-next-line prefer-destructuring
        generated = generatedApps[0]; // latest App
        generated.id = generated._id;
        isReBuild = true;
      } else {
        obj.status = 1;
        generated = await generatorRepo.create(obj);
      }
    }
    if (!generated) {
      return GENERATOR_FAILED_CREATE;
    }

    let requestData = {};
    requestData = await nodeExpressRequest(params.applicationId, project, schemaRepo);
    if (!project.configInput) {
      project.configInput = {
        databaseName: project.name || 'Demo',
        port: 3000,
        types: [
          'Admin',
          'User',
        ],
        loginAccess: {
          Admin: [
            'admin',
            'device',
            'desktop',
            'client',
          ],
          User: [
            'device',
            'desktop',
            'client',
          ],
        },
        isAuthentication: true,
        authModel: 'user',
      };
    }

    // applicationConfig
    const applicationConfig = await ApplicationConfig.getDetails({ find: { applicationId: project.id } });
    let configSocialPlatform = [];
    if (applicationConfig && applicationConfig.length && applicationConfig[0].socialPlatform && applicationConfig[0].socialPlatform.length) {
      configSocialPlatform = applicationConfig[0].socialPlatform.filter((val) => {
        if (val.credential && val.type) {
          const key = Object.keys(val.credential);
          if (val.credential[key]) {
            return (val.credential && val.type);
          }
          return false;
        }
        return false;
      });
    }

    const jsonData = {
      logo: project.image || '',
      config: {
        projectName: project.name || 'Demo',
        path: definition.generatorPath,
        ...(project.configInput || {}),
        ...(definition.staticConfigInputs || {}),
        ...(definition.otherSetting || {}),
      },
      authentication: {
        ...(project.configInput || {}),
        ...(definition.staticConfigInputs || {}),
        ...(definition.otherSetting || {}),
        ...(requestData.applicationConfig || {}),
      },
      ...(project.stepInput || {}),
      ...(requestData || {}),
      authenticationConfig: { socialPlatform: configSocialPlatform },
      screenTransitions: requestData.screenTransitions || [],
    };

    jsonData.id = generated.id;
    jsonData.applicationId = project.id;

    const inputFile = `${definition.inputPath}/${generated.id}.json`;

    if (definition.code === 'NODE_EXPRESS') {
      if (params.projectType === 'CC') {
        jsonData.projectType = 'CC';
      } else if (project.projectType) {
        jsonData.projectType = project.projectType;
      } else {
        jsonData.projectType = 'MVC';
      }
      if (project.stepInput && project.stepInput.ormType && project.stepInput.databaseType) {
        jsonData.ORM = GENERATOR_ORM_TYPE[project.stepInput.ormType] || '';
        jsonData.adapter = GENERATOR_DATABASE_TYPE[project.stepInput.databaseType] || '';
      }
    }
    fs.writeFileSync(inputFile, JSON.stringify(jsonData));
    const dirPath = `${jsonData.config.path}/${generated.id}/${jsonData.config.projectName}`;

    obj.projectPath = `${definition.generatorPath}/${generated.id}/${jsonData.config.projectName}`;
    obj.status = 2;
    generated = await generatorRepo.update(generated.id, obj);

    const updateApplication = {
      projectType: jsonData.projectType || 'MVC',
      tempGeneratedId: generated.id,
      'inProcessStatus.build_app': IN_QUEUE,
    };

    project = await applicationRepo.update(params.applicationId, updateApplication);
    await generatorRepo.update(generated.id, { 'inProcessStatus.build_app': IN_QUEUE });

    const status = await generateNodeCode(
      inputFile, applicationRepo, definition, generated.id, dirPath, project.name, params.applicationId, generatorRepo, isReBuild,
    );
    if (status) {
      if (isReBuild) {
        await overwriteProject(generated.id, jsonData.config.projectName);
      }
      return {
        ...PROJECT_GENERATED,
        data: {
          ...(_.pick(project, ['_id', 'name'])),
          generatedId: project.tempGeneratedId,
          path: `/output/${generated.id}/${jsonData.config.projectName}`,
        },
      };
    }
    return SERVER_ERROR;
  } catch (err) {
    console.log('error', err);
    return SERVER_ERROR;
  }
};

module.exports = generate;
