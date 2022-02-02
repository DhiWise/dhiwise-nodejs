/* global  _ */
const path = require('path');
const fs = require('fs');
const {
  PROJECT_TYPE, PROJECT_CREATION_STEP,
} = require('./constants/constant');
const writeOperations = require('./writeOperations');
const { createModels } = require('./createApplication/composeModels');
const schemaValidation = require('./createApplication/schemaValidation');
const sequelizeSchemaValidation = require('./createApplication/sequelize/modelValiadation');
const status = require('./constants/constant');
const {
  makeController, makeControllerIndex,
} = require('./createApplication/createController');
const { makeRoutes } = require('./createApplication/createRoutes');
const {
  makeAuth, isAuthenticationFromInput, makeAuthIndex, makeMiddlewareIndex,
} = require('./createApplication/createAuthentication');
const common = require('./createApplication/utils/common');
const { makeIndividualPolicy } = require('./createApplication/makeCustomPolicy');
const {
  makeCustomRoutes, makeControllerIndexForCustomRoutes, makeServiceForNonExistingService, makeCustomRoutesUsecase,
} = require('./createApplication/createCustomRoutes');
const { makeFileUploadFiles } = require('./createApplication/createFileUploadFiles');
const { startRenderingEJS } = require('./createApplication/render');
const { addSocialLogin } = require('./createApplication/thirdPartyIntegrations');
const { createEntities } = require('./createApplication/createEntities');
const {
  generateStaticFilesForCC, generateStaticFilesForMVC, generateStaticFilesForCCSequelize, addRolePermissionService, generateStaticFilesForMVCSequelize,
} = require('./createApplication/createStaticFiles');
const {
  copyEslintrcFile, executeEslintFix,
} = require('./createApplication/applyEslint');
const { generateDeleteDependencyService } = require('./createApplication/createDeleteDependencyService');
const generateService = require('./createApplication/service');
const projectSetting = require('./settings');
const InputParser = require('./createApplication/InputParser');
const sequelize = require('./createApplication/sequelize/typeConverter');
const createModelsSequelize = require('./createApplication/sequelize/composeModels');
const sequelizeService = require('./createApplication/sequelize/service');
const { configureMongoAuthTestCases } = require('./createApplication/createTestCases/mongooseTestCases');
const { configureSequelizeAuthTestCases } = require('./createApplication/createTestCases/sequelizeTestCases');
const { createDataAccessFiles } = require('./createApplication/createDataAccessFiles');
const {
  createUseCaseFiles, createCommonUseCaseFiles,
} = require('./createApplication/createUseCaseFiles');

class CodeGenerator {
  constructor (projectType, databaseAdapter) {
    this.projectType = projectType;
    this.databaseAdapter = databaseAdapter;
    const settingJson = projectSetting.setup(this.projectType, this.databaseAdapter);
    this.setup = settingJson[this.projectType];
  }

  async createApp (params) {
    const {
      steps, templateFolderName, templateRegistry, userDirectoryStructure,
    } = this.setup;
    const jsonModels = _.cloneDeep(params.jsonData.models);
    const { isReBuild } = params;
    /*
     * console.log('userDirectoryStructure ====== >', JSON.stringify(userDirectoryStructure));
     * ? JSON PARSERS
     */
    if (_.includes(steps, PROJECT_CREATION_STEP.INPUT_PARSER)) {
      // ? permanent parsers
      if (!_.isEmpty(params.jsonData.config) && _.isEmpty(params.jsonData.config.port)) { params.jsonData.config.port = '5000'; }
      params.jsonData = await InputParser.addingModelKeys(params.jsonData);
      params.jsonData = await InputParser.fileUploadParser(params.jsonData);
      params.jsonData = await InputParser.modelConfigParser(params.jsonData);
      [params.jsonData.models, params.jsonData.virtualRelationship] = await InputParser.virtualRelationshipParser(params.jsonData.models);
      params.jsonData = await InputParser.insertPassword(params.jsonData);
      [params.jsonData.models, params.jsonData.sequenceGenerator] = InputParser.modelSequenceGeneratorParser(params.jsonData.models);
      if (!_.isEmpty(params.jsonData.nestedCall)) params.jsonData.nestedCall = InputParser.parseNestedCallInput(params.jsonData.nestedCall, _.cloneDeep(params.jsonData.authentication.platform));
      if (!_.isEmpty(params.jsonData.rolePermission) && params.jsonData.authentication.isAuthentication) {
        params.jsonData = InputParser.parseRolePermissionNew(params.jsonData);
        params.jsonData = InputParser.addRolePermissionMongoModels(params.jsonData);
      }
      params.jsonData = InputParser.replaceControllerNameInCustomRoutes(params.jsonData);
      params.jsonData = InputParser.parseCustomRoute(params.jsonData);
    }
    if (_.includes(steps, PROJECT_CREATION_STEP.INPUT_PARSER_SEQUELIZE)) {
      if (!_.isEmpty(params.jsonData.config) && _.isEmpty(params.jsonData.config.port)) { params.jsonData.config.port = '5000'; }
      // ? permanent parsers
      params.jsonData = await InputParser.addingModelKeysSequelize(params.jsonData);
      params.jsonData = await InputParser.fileUploadParser(params.jsonData);
      params.jsonData = await InputParser.modelConfigParser(params.jsonData);
      [params.jsonData.models, params.jsonData.virtualRelationship] = await InputParser.virtualRelationshipParserForSequelize(params.jsonData.models);
      params.jsonData = await InputParser.sequelizeInsertPassword(params.jsonData);
      params.jsonData = await InputParser.sequelizeJSONParserForIDAndAutoIncrement(params.jsonData);
      if (!_.isEmpty(params.jsonData.nestedCall)) params.jsonData.nestedCall = InputParser.parseNestedCallInput(params.jsonData.nestedCall, _.cloneDeep(params.jsonData.authentication.platform));
      if (!_.isEmpty(params.jsonData.rolePermission) && params.jsonData.authentication.isAuthentication) {
        params.jsonData = InputParser.parseRolePermissionNew(params.jsonData);
        params.jsonData = InputParser.addRolePermissionSQLModels(params.jsonData);
      }
      params.jsonData = InputParser.replaceControllerNameInCustomRoutes(params.jsonData);
      params.jsonData = InputParser.parseCustomRoute(params.jsonData);
    }

    if (_.includes(steps, PROJECT_CREATION_STEP.QUERY_BUILDER_PARSE_SEQUELIZE)) {
      params.jsonData.routes = InputParser.parseQueryBuildersForSequelize(_.cloneDeep(params.jsonData));
    }
    this.jsonData = _.cloneDeep(params.jsonData);
    const copyOfJsonData = _.cloneDeep(params.jsonData);
    let rootDirectory = params.directory;

    // ? Create Project Dir
    if (_.includes(steps, PROJECT_CREATION_STEP.CREATE_ROOT_DIRECTORY)) {
      let tempDirName = params.projectName;
      if (isReBuild) {
        tempDirName = `${tempDirName}_dhiwise_temp_app`;
      }

      rootDirectory = await this.createProjectRootDirectory(params.directory, tempDirName);
    }

    // ? Mongoose Type Validation
    if (_.includes(steps, PROJECT_CREATION_STEP.SCHEMA_VALIDATION)) {
      this.forValidationModels = _.cloneDeep(this.jsonData.models);
      this.jsonData.models = schemaValidation.validSchema(this.jsonData.models, `${rootDirectory}/logs`, this.jsonData.modelEnum);
      this.postmanCollection = _.cloneDeep(this.jsonData);
      const errorLogs = fs.existsSync(`${rootDirectory}/logs/errors.log`);
      if (errorLogs) {
        throw new Error('Request is not successfully executed');
      }
    }

    // ? Mongoose Type Validation
    if (_.includes(steps, PROJECT_CREATION_STEP.SEQUELIZE_SCHEMA_VALIDATION)) {
      this.forValidationModels = _.cloneDeep(this.jsonData.models);
      this.jsonData.models = sequelizeSchemaValidation.validSchema(this.jsonData.models, `${rootDirectory}/logs`);
      const errorLogs = fs.existsSync(`${rootDirectory}/logs/errors.log`);
      if (errorLogs) {
        throw new Error('Request is not successfully executed');
      }
    }

    if (_.includes(steps, PROJECT_CREATION_STEP.SEQUELIZE_TYPE_VALIDATION)) {
      this.postmanCollection = _.cloneDeep(this.jsonData);
    }

    if (_.includes(steps, PROJECT_CREATION_STEP.SEQUELIZE_TYPE_CONVERSION)) {
      let adapterType = false;
      if (this.jsonData.adapter === 'mysql') {
        adapterType = status.ADAPTER.MYSQL;
      } else if (this.jsonData.adapter === 'mssql') {
        adapterType = status.ADAPTER.MSSQL;
      } else if (this.jsonData.adapter === 'postgres') {
        adapterType = status.ADAPTER.POSTGRESQL;
      }
      this.jsonData.models = sequelize.setType(_.cloneDeep(this.jsonData.models), adapterType);
    }

    // ? generate blank folder structure.
    if (_.includes(steps, PROJECT_CREATION_STEP.CREATE_BLANK_DIRECTORY_MVC)) {
      await generateService.createMVCBlankFolder(rootDirectory, userDirectoryStructure);
    }

    if (_.includes(steps, PROJECT_CREATION_STEP.CREATE_BLANK_DIRECTORY_CC)) {
      await generateService.createCCBlankFolder(rootDirectory, userDirectoryStructure);
    }

    // ? make all dependency
    if (_.includes(steps, PROJECT_CREATION_STEP.CREATE_DEPENDENT_FILE)) {
      this.pkg = await generateService.createPackageJson({
        name: params.projectName,
        packages: this.jsonData.packages,
        mainJsFile: 'app.js',
        sequenceGenerator: this.jsonData.sequenceGenerator,
        jsonData: this.jsonData,
      });
      this.common = await generateService.commonServiceFile(`${this.setup.templateFolderName}${templateRegistry.utilsFolderPath}`, this.jsonData);
    }

    if (_.includes(steps, PROJECT_CREATION_STEP.CREATE_DEPENDENT_FILE_SEQUELIZE)) {
      const adapter = this.jsonData.adapter ? this.jsonData.adapter : null;
      this.pkg = await generateService.createPackageJsonForSequelize({
        name: params.projectName,
        packages: this.jsonData.packages,
        mainJsFile: 'app.js',
        adapter,
        jsonData: params.jsonData,
      });
      this.common = await generateService.commonServiceFile(`${this.setup.templateFolderName}${templateRegistry.utilsFolderPath}`, this.jsonData);
    }

    if (_.includes(steps, PROJECT_CREATION_STEP.CREATE_APP_FILE)) {
      this.app = await generateService.setUpAppJS(this.setup.templateFolderName, this.jsonData);
    }

    if (_.includes(steps, PROJECT_CREATION_STEP.CREATE_DB_CONNECTION_SEQUELIZE)) {
      const dbFilePath = `${this.setup.templateFolderName}${templateRegistry.configFolderPath}`;
      const dbConfig = await generateService.setDB(dbFilePath, this.jsonData.adapter);
      this.db = dbConfig.db;
      this.dbConnection = dbConfig.dbConnection;
    }

    // ? set input constants
    if (_.includes(steps, PROJECT_CREATION_STEP.CREATE_CONSTANT) && !_.isEmpty(this.jsonData.constants)) {
      this.constants = this.jsonData.constants;
    }

    // ? identify Authentication form input
    if (_.includes(steps, PROJECT_CREATION_STEP.IDENTIFY_AUTH)) {
      this.auth = await isAuthenticationFromInput(this.jsonData);
    }

    if (_.includes(steps, PROJECT_CREATION_STEP.CREATE_DB_CONNECTION)) {
      const dbFilePath = `${this.setup.templateFolderName}${templateRegistry.configFolderPath}`;
      this.db = await generateService.setDB(dbFilePath);
    }

    if (_.includes(steps, PROJECT_CREATION_STEP.ADD_SEEDER_MONGOOSE)) {
      if (this.auth.isAuth) {
        [this.seeder, this.userLoginCredentials] = await generateService.addSeederMongoose(copyOfJsonData,
          `${this.setup.templateFolderName}${templateRegistry.seedersPath}`, _.cloneDeep(this.auth), this.app);
      } else if (this.app.locals.SHOULD_ADD_ROLE_PERMISSION) {
        this.app.locals.SHOULD_ADD_ROLE_PERMISSION = false;
      }
    }

    if (_.includes(steps, PROJECT_CREATION_STEP.ADD_SEEDER_SEQUELIZE)) {
      if (this.auth.isAuth) {
        [this.seeder, this.userLoginCredentials] = await generateService.addSeederSequelize(copyOfJsonData,
          `${this.setup.templateFolderName}${templateRegistry.seedersPath}`, _.cloneDeep(this.auth), this.app);
      } else if (this.app.locals.SHOULD_ADD_ROLE_PERMISSION) {
        this.app.locals.SHOULD_ADD_ROLE_PERMISSION = false;
      }
    }
    // ? ENV File
    if (_.includes(steps, PROJECT_CREATION_STEP.SETUP_ENV_FILE)) {
      let env = this.jsonData.envVariables !== undefined ? this.jsonData.envVariables : {};
      env = env ? await generateService.envParser(env) : {};
      const {
        envs, jsonData,
      } = await generateService.createEnvFile(this.setup.templateFolderName, this.jsonData, {
        database: this.jsonData.config.databaseName,
        port: this.jsonData.config.port,
      },
      {
        socialAuth: _.cloneDeep(this.auth.socialAuth),
        env,
      });
      this.env = envs;
      this.jsonData = jsonData;
      this.postmanCollection.config = this.jsonData.config;
    }

    // ? ENV File
    if (_.includes(steps, PROJECT_CREATION_STEP.SETUP_ENV_FILE_SEQUELIZE)) {
      let env = this.jsonData.envVariables !== undefined ? this.jsonData.envVariables : {};
      const shouldAddTestCaseVariables = _.includes(steps, PROJECT_CREATION_STEP.GENERATE_TEST_CASES_SEQUELIZE);
      env = env ? await generateService.envParser(env) : {};
      const {
        envs, jsonData,
      } = await generateService.createEnvFileSequelize(this.setup.templateFolderName,
        this.jsonData, {
          database: this.jsonData.config.databaseName,
          port: this.jsonData.config.port,
        },
        {
          socialAuth: this.auth.socialAuth,
          env,
          shouldAddTestCaseVariables,
        });
      this.env = envs;
      this.jsonData = jsonData;
      this.postmanCollection.config = this.jsonData.config;
    }

    if (_.includes(steps, PROJECT_CREATION_STEP.CONVERT_HOOK_NAMES)) {
      if (!_.isEmpty(this.jsonData.hooks)) {
        this.jsonData.hooks = InputParser.convertHookNames(this.jsonData.hooks);
      }
    }

    // ? Create Models
    if (_.includes(steps, PROJECT_CREATION_STEP.CREATE_MODELS)) {
      let modelSetup = {};
      if (this.auth.isAuth) {
        modelSetup = await createModels(`${templateFolderName}${templateRegistry.modelFolderPath}`, this.jsonData, this.forValidationModels, this.auth);
      } else {
        modelSetup = await createModels(`${templateFolderName}${templateRegistry.modelFolderPath}`, this.jsonData, this.forValidationModels);
      }
      if (!_.isEmpty(modelSetup)) {
        this.models = modelSetup.allEJSModel;
        this.deleteDependency = modelSetup.deleteDependency;
      }
    }

    if (_.includes(steps, PROJECT_CREATION_STEP.CREATE_SEQUELIZE_MODELS)) {
      let modelSetup = {};
      if (this.auth.isAuth) {
        modelSetup = await createModelsSequelize.createModels(`${this.setup.templateFolderName}${templateRegistry.modelFolderPath}`, this.jsonData, this.forValidationModels, params.jsonData,
          this.auth);
      } else {
        modelSetup = await createModelsSequelize.createModels(`${this.setup.templateFolderName}${templateRegistry.modelFolderPath}`, this.jsonData, this.forValidationModels, params.jsonData);
      }
      this.models = modelSetup.allEJSModel;
      this.tableRelationships = modelSetup.tableRelationships;
      if (!_.isEmpty(modelSetup)) {
        this.models = modelSetup.allEJSModel;
        this.deleteDependency = modelSetup.deleteDependency;
      }
    }

    // Create Usecase for Custom routes
    if (_.includes(steps, PROJECT_CREATION_STEP.CREATE_CUSTOM_ROUTES_USECASE)) {
      if (!_.isEmpty(this.jsonData?.routes?.apis)) {
        const customRouteObj = {
          customRoutes: this.jsonData.routes.apis,
          models: this.jsonData.models,
          userDirectoryStructure,
          templateRegistry,
          templateFolderName: this.setup.templateFolderName,
        };
        this.customRoutesUsecase = await makeCustomRoutesUsecase(customRouteObj);
      }
    }

    // data-access files for cc
    if (_.includes(steps, PROJECT_CREATION_STEP.CREATE_DATA_ACCESS_FILES)) {
      if (this.jsonData && this.jsonData.models) {
        const templatePath = `${this.setup.templateFolderName}${templateRegistry.dataAccessFolderPath}`;
        const { models } = this.jsonData;
        this.dataAccessFiles = await createDataAccessFiles(templatePath, models);
      }
    }

    if (_.includes(steps, PROJECT_CREATION_STEP.CREATE_DEPENDENCY_SERVICE) && this.deleteDependency) {
      this.deleteDependent = await generateDeleteDependencyService(this.projectType, `${this.setup.templateFolderName}${templateRegistry.utilsFolderPath}`, this.deleteDependency);
    }

    // ? create Entity For Clean-code-architecture
    if (_.includes(steps, PROJECT_CREATION_STEP.CREATE_ENTITY)) {
      const entities = this.jsonData.models;
      this.allEJSEntities = await createEntities(`${templateFolderName}${templateRegistry.entityFolderPath}`, entities);
    }
    if (_.includes(steps, PROJECT_CREATION_STEP.CREATE_SEQUELIZE_VALIDATION_FILE)) {
      const validationFilePath = {
        templateFolderName: this.setup.templateFolderName,
        validationFolderPath: templateRegistry.validationFolderPath,
      };
      this.modelValidation = await generateService.createValidationFile(validationFilePath, this.forValidationModels, this.auth, this.jsonData.adapter, this.jsonData.modelEnum);
    }
    // ? Create Validation File
    if (_.includes(steps, PROJECT_CREATION_STEP.CREATE_VALIDATION_FILE)) {
      const validationFilePath = {
        templateFolderName,
        validationFolderPath: templateRegistry.validationFolderPath,
      };
      this.modelValidation = await generateService.createValidationFile(validationFilePath, this.forValidationModels, this.auth, '', this.jsonData.modelEnum);
    }
    // ? create controller Index If Project Type is CC
    if (_.includes(steps, PROJECT_CREATION_STEP.CREATE_CONTROLLER_INDEX)) {
      const controllers = {
        auth: this.auth,
        jsonData: this.jsonData,
        controllerFilePath: `${templateFolderName}${templateRegistry.controllerFolderPath}`,
        deleteDependency: this.deleteDependency,
      };
      this.controllerIndex = await makeControllerIndex(controllers);
    }

    // ? Create Controllers
    if (_.includes(steps, PROJECT_CREATION_STEP.CREATE_CONTROLLERS)) {
      const makeControllerObj = {
        jsonData: this.jsonData,
        deleteDependency: this.deleteDependency,
        auth: this.auth,
        controllerFilePath: `${templateFolderName}${templateRegistry.controllerFolderPath}`,
        controllerGeneratedPath: `${userDirectoryStructure.generatedControllerPath}`,
        jsonModels,
      };
      this.controller = await makeController(makeControllerObj);
    }
    // ? Create Routes
    if (_.includes(steps, PROJECT_CREATION_STEP.CREATE_ROUTES)) {
      const makeRouteObj = {
        jsonData: this.jsonData,
        auth: this.auth,
        routeFilePath: `${templateFolderName}${templateRegistry.routesFolderPath}`,
        customRoutesPath: `${templateFolderName}${templateRegistry.individualRoutesFolderPath}`,
      };
      const {
        modelWiseRoutes, platformRoutes, indexRoute,
      } = await makeRoutes(makeRouteObj);
      this.modelWiseRoutes = modelWiseRoutes;
      this.platformRoutes = platformRoutes;
      if (indexRoute) this.indexRoute = indexRoute;
      else {
        this.indexRoute = writeOperations.loadTemplate(`${makeRouteObj.routeFilePath}/index.js`);
        this.indexRoute.locals.PLATFORM = [];
      }
    }

    // ? authentication  service , controller , policy , constant
    if (!_.isEmpty(this.auth) && this.auth.isAuth) {
      const makeAuthObj = {
        auth: this.auth,
        platformRoutes: this.platformRoutes,
        configPath: `${templateFolderName}${templateRegistry.configFolderPath}`,
        controllerPath: `${templateFolderName}${templateRegistry.controllerFolderPath}`,
        routePath: `${templateFolderName}${templateRegistry.routesFolderPath}`,
        servicePath: `${templateFolderName}${templateRegistry.serviceFolderPath}`,
        middlewarePath: `${templateFolderName}${templateRegistry.middlewareFolderPath}`,
        authControllerPath: `${userDirectoryStructure.authControllerPath}`,
        customRoutes: this.jsonData.routes ? this.jsonData.routes : {},
        platform: _.cloneDeep(this.auth.loginPlatform),
        ORM: this.jsonData.ORM ? this.jsonData.ORM : status.ORM_PROVIDERS.MONGOOSE,
        rolePermission: !_.isEmpty(this.jsonData.rolePermission),
        projectType: this.projectType,
        useCaseFolderPath: `${templateFolderName}${templateRegistry.useCaseFolderPath}`,
      };
      this.authModule = await makeAuth(makeAuthObj);
    }

    // ? Make AuthController Index For CC
    if (_.includes(steps, PROJECT_CREATION_STEP.CREATE_AUTH_CONTROLLER_INDEX)) {
      if (!_.isEmpty(this.auth) && this.auth.isAuth) {
        const authObject = {
          auth: this.auth,
          controllerPath: `${templateFolderName}${templateRegistry.controllerFolderPath}`,
          platforms: _.cloneDeep(this.jsonData.authentication.platform),
          rolePermission: !_.isEmpty(this.jsonData.rolePermission),
        };
        this.authControllerIndex = await makeAuthIndex(authObject);
      }
    }

    // ? custom policy
    if (_.includes(steps, PROJECT_CREATION_STEP.CREATE_CUSTOM_POLICY) && !_.isEmpty(this.jsonData.policy)) {
      const middlewarePath = `${templateFolderName}${templateRegistry.middlewareFolderPath}`;
      this.customPolicy = await makeIndividualPolicy(this.jsonData.policy, middlewarePath);
    }

    // ? custom routes
    if (_.includes(steps, PROJECT_CREATION_STEP.CREATE_CUSTOM_ROUTES) && !_.isEmpty(this.jsonData.routes)) {
      const makeCustomRouteObj = {
        platform: _.cloneDeep(this.jsonData.authentication.platform),
        routes: _.cloneDeep(this.jsonData.routes),
        models: this.jsonData.models,
        newModelConfig: this.jsonData.modelConfig,
        customRoutesPath: `${templateFolderName}${templateRegistry.individualRoutesFolderPath}`,
        generatedCustomRouteControllerPath: `${userDirectoryStructure.generatedCustomRouteControllerPath}`,
        modelFolderPath: `${userDirectoryStructure.modelFolderPath}`,
        validationFolderPath: `${userDirectoryStructure.validationFolderPath}`,
        routeFolderPath: `${userDirectoryStructure.routesFolderPath}`,
        destinationFolder: rootDirectory,
      };
      if (this.projectType === PROJECT_TYPE.CLEAN_CODE) {
        makeCustomRouteObj.shouldCreateControllerIndex = true;
      }
      [this.customRoutes, this.shouldCopyQueryService, this.customRoutePackageDependencies, this.customRoutesWithPath, this.customRouteIndexes] = await makeCustomRoutes(makeCustomRouteObj);
      if (this.projectType === PROJECT_TYPE.CLEAN_CODE || this.projectType === PROJECT_TYPE.CC_SEQUELIZE) {
        this.customRoutes.shouldCreateFolderOfController = true;
      }
    }
    // ? create controller index file if CC project
    if (_.includes(steps, PROJECT_CREATION_STEP.CREATE_INDEX_FILES_OF_CONTROLLER_CUSTOM_ROUTES) && !_.isEmpty(this.jsonData.routes)) {
      const makeCustomRouteObj = {
        platform: _.cloneDeep(this.jsonData.authentication.platform),
        routes: _.cloneDeep(this.jsonData.routes),
        models: this.jsonData.models,
        customRoutesPath: `${templateFolderName}${templateRegistry.individualRoutesFolderPath}`,
        generatedCustomRouteControllerPath: `${userDirectoryStructure.generatedCustomRouteControllerPath}`,
      };
      this.controllerIndexForCustomRoute = await makeControllerIndexForCustomRoutes(makeCustomRouteObj, userDirectoryStructure);
    }

    // ? create controller index file if CC project
    if (_.includes(steps, PROJECT_CREATION_STEP.CREATE_CUSTOM_ROUTES_SERVICE) && !_.isEmpty(this.jsonData.routes)) {
      const makeCustomRouteObj = {
        platform: _.cloneDeep(this.jsonData.authentication.platform),
        models: this.jsonData.models,
        routes: _.cloneDeep(this.jsonData.routes),
        customRoutesPath: `${this.setup.templateFolderName}${templateRegistry.individualRoutesFolderPath}`,
      };
      this.servicesOfCustomRoutes = await makeServiceForNonExistingService(makeCustomRouteObj);
    }

    // use-case files for cc modal wise
    if (_.includes(steps, PROJECT_CREATION_STEP.CREATE_USECASE_FILES)) {
      if (this.jsonData && this.jsonData.models) {
        const { modelConfig } = this.jsonData;
        const rootTemplatePath = `${this.setup.templateFolderName}${templateRegistry.useCaseFolderPath}`;
        this.useCaseFiles = await createUseCaseFiles(rootTemplatePath, {
          modelConfig,
          deleteDependency: this.deleteDependency,
          auth: this.auth,
          defaultRole: this.jsonData.defaultRole || '',
        });
      }
    }

    // common use-case files for cc
    if (_.includes(steps, PROJECT_CREATION_STEP.CREATE_COMMON_USE_CASE_FILES)) {
      if (this.auth.isAuth) {
        const rootTemplatePath = `${this.setup.templateFolderName}${templateRegistry.useCaseFolderPath}`;
        const { authService } = this.authModule;
        this.commonUseCaseFiles = await createCommonUseCaseFiles(rootTemplatePath, authService);
      }
    }

    if (_.includes(steps, PROJECT_CREATION_STEP.CREATE_MIDDLEWARE_INDEX)) {
      const middlewareObj = {
        platforms: _.cloneDeep(this.jsonData.authentication.platform),
        projectType: this.projectType,
        middlewarePath: `${templateFolderName}${templateRegistry.middlewareFolderPath}`,
        userModel: this.auth.userModel,
      };
      this.middlewareIndex = await makeMiddlewareIndex(middlewareObj);
    }
    // ? create postman
    if (_.includes(steps, PROJECT_CREATION_STEP.CREATE_POSTMAN)) {
      [this.postmanCollectionJSONV20, this.postmanCollectionJSONV21, this.envPostman] = await generateService.createPostmanCollection(params.projectName, this.postmanCollection, this.auth);
    }

    // ? create postman sequelize
    if (_.includes(steps, PROJECT_CREATION_STEP.CREATE_POSTMAN_SEQUELIZE)) {
      [this.postmanCollectionJSONV20, this.postmanCollectionJSONV21, this.envPostman] = await sequelizeService.createPostmanCollection(params.projectName, this.postmanCollection, this.auth);
    }

    // ? create file-upload routes and controller
    if (_.includes(steps, PROJECT_CREATION_STEP.CREATE_FILE_UPLOAD_FILES)) {
      if (!_.isEmpty(this.jsonData.fileUpload) && !_.isEmpty(this.jsonData.fileUpload.uploads)) {
        const fileUploadObj = {
          jsonData: this.jsonData.fileUpload.uploads,
          templateFolder: templateFolderName,
          auth: this.auth,
          controllerPath: templateRegistry.controllerFolderPath,
          routePath: templateRegistry.routesFolderPath,
          fileUploadControllerPath: userDirectoryStructure.fileUploadControllerPath,
        };
        this.fileUpload = await makeFileUploadFiles(fileUploadObj);
        this.fileUpload.isFolder = false;
        if (this.projectType === PROJECT_TYPE.CLEAN_CODE || this.projectType === PROJECT_TYPE.CC_SEQUELIZE) {
          this.fileUpload.isFolder = true;
        }
      }
    }

    // ? add Social Login
    if (_.includes(steps, PROJECT_CREATION_STEP.ADD_SOCIAL_LOGIN)) {
      if (this.jsonData.authentication.isSocialMediaAuth && this.auth.isAuth) {
        const socialObj = {
          jsonData: this.jsonData,
          userModel: this.auth.userModel,
          socialAuth: this.auth.socialAuth,
          noOfDeviceAllowed: this.auth.noOfDeviceAllowed,
        };
        this.socialData = await addSocialLogin(socialObj);
      }
    }

    if (_.includes(steps, PROJECT_CREATION_STEP.GENERATE_STATIC_FILES_CC)) {
      await generateStaticFilesForCC(templateFolderName, rootDirectory, userDirectoryStructure);
    }

    if (_.includes(steps, PROJECT_CREATION_STEP.GENERATE_STATIC_FILES_MVC)) {
      await generateStaticFilesForMVC(templateFolderName, rootDirectory, userDirectoryStructure);
    }

    if (_.includes(steps, PROJECT_CREATION_STEP.GENERATE_STATIC_FILES_MVC_SEQUELIZE)) {
      await generateStaticFilesForMVCSequelize(this.setup.templateFolderName, rootDirectory, userDirectoryStructure);
    }

    if (_.includes(steps, PROJECT_CREATION_STEP.GENERATE_STATIC_FILES_CC_SEQUELIZE)) {
      await generateStaticFilesForCCSequelize(this.setup.templateFolderName, rootDirectory, userDirectoryStructure);
    }

    if (_.includes(steps, PROJECT_CREATION_STEP.ADD_ROLE_PERMISSION) && !_.isEmpty(this.jsonData.rolePermission)) {
      if (this.auth.isAuth) {
        this.rolePermissionService = await addRolePermissionService(`${this.setup.templateFolderName}${templateRegistry.middlewareFolderPath}`);
      }
    }

    if (_.includes(steps, PROJECT_CREATION_STEP.GENERATE_TEST_CASES)) {
      if (this.auth.isAuth) {
        const testCasesObject = {
          jsonData: _.cloneDeep(this.jsonData),
          authObj: _.cloneDeep(this.auth),
          platforms: _.cloneDeep(this.jsonData.authentication.platform),
          testCaseTemplateFolder: `${this.setup.templateFolderName}${templateRegistry.testCaseTemplatePath}`,
          testCasePath: userDirectoryStructure.generatedTestCasePath,
        };
        this.testCases = configureMongoAuthTestCases(testCasesObject);
      }
    }

    if (_.includes(steps, PROJECT_CREATION_STEP.GENERATE_TEST_CASES_SEQUELIZE)) {
      if (this.auth.isAuth) {
        const testCasesObject = {
          jsonData: _.cloneDeep(copyOfJsonData),
          authObj: _.cloneDeep(this.auth),
          platforms: _.cloneDeep(this.jsonData.authentication.platform),
          testCaseTemplateFolder: `${this.setup.templateFolderName}${templateRegistry.testCaseTemplatePath}`,
          testCasePath: userDirectoryStructure.generatedTestCasePath,
        };
        this.testCases = configureSequelizeAuthTestCases(testCasesObject);
      }
    }
    // ? if this.shouldCopyQueryService is false then again check for custom routes in Controller
    if (!this.shouldCopyQueryService) {
      this.shouldCopyQueryService = this.jsonData.routes && this.jsonData.routes.apis && this.jsonData.routes.apis.length ? common.shouldCopyQueryService(this.jsonData.routes.apis) : false;
    }

    // ? README file
    const readmeObj = {
      templateFolderName: this.setup.templateFolderName,
      credentials: this.userLoginCredentials,
      auth: this.auth,
    };
    this.readme = common.createReadMeFile(readmeObj);

    // ? start to generate project
    if (_.includes(steps, PROJECT_CREATION_STEP.RENDER_EJS)) {
      const renderObject = {
        type: this.projectType,
        app: this.app,
        appConfig: this.appConfig,
        db: this.db,
        models: this.models,
        controllerDetails: this.controller,
        modelWiseRoutes: this.modelWiseRoutes,
        authModule: this.authModule,
        authControllerIndex: this.authControllerIndex,
        pkg: this.pkg,
        services: this.services,
        isSingleNotificationService: this.isSingleNotificationService,
        emailService: this.emailService,
        smsService: this.smsService,
        webNotificationService: this.webNotificationService,
        pushNotification: this.pushNotification,
        indexRoute: this.indexRoute,
        modelValidation: this.modelValidation,
        constants: this.constants,
        env: this.env,
        seeder: this.seeder,
        customPolicy: this.customPolicy,
        shouldCopyQueryService: this.shouldCopyQueryService,
        postmanCollectionJSONV20: this.postmanCollectionJSONV20,
        postmanCollectionJSONV21: this.postmanCollectionJSONV21,
        platformRoutes: this.platformRoutes,
        customRoutes: this.customRoutes,
        isAuth: this.auth.isAuth,
        fileUpload: this.fileUpload,
        socialData: this.socialData,
        allEJSEntities: this.allEJSEntities,
        controllerIndex: this.controllerIndex,
        controllerIndexForCustomRoute: this.controllerIndexForCustomRoute,
        isDeleteService: !!this.deleteDependency,
        userDirectoryStructure,
        templateRegistry,
        deleteDependent: this.deleteDependent,
        servicesOfCustomRoutes: this.servicesOfCustomRoutes,
        tableRelationships: this.tableRelationships,
        dbConnection: this.dbConnection,
        customRoutePackageDependencies: this.customRoutePackageDependencies,
        testCases: this.testCases,
        commonService: this.common,
        readme: this.readme ?? false,
        envPostman: this.envPostman,
        thirdPartySMSServices: this.thirdPartySMSServices,
        thirdPartyEmailService: this.thirdPartyEmailService,
        rolePermissionService: this.rolePermissionService,
        customRoutesWithPath: this.customRoutesWithPath,
        customRouteIndexes: this.customRouteIndexes,
        dataAccessFiles: this.dataAccessFiles,
        useCaseFiles: this.useCaseFiles,
        commonUseCaseFiles: this.commonUseCaseFiles,
        middlewareIndex: this.middlewareIndex,
        customRoutesUsecase: this.customRoutesUsecase,
      };
      await startRenderingEJS(rootDirectory, this.setup.templateFolderName, renderObject);
    }

    // ? fixing all eslint issue
    if (_.includes(steps, PROJECT_CREATION_STEP.APPLY_ESLINT)) {
      copyEslintrcFile(templateFolderName, rootDirectory);
      executeEslintFix(rootDirectory);
    }
  }

  // ? create root directory
  async createProjectRootDirectory (directory, projectName) {
    writeOperations.mkdir(directory, projectName);
    writeOperations.mkdir(`${directory}${path.sep}${projectName}`, 'logs');
    return `${directory}${path.sep}${projectName}`;
  }
}
module.exports = CodeGenerator;
