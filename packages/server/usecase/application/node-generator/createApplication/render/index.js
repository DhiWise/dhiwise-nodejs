/* eslint-disable linebreak-style */
/* global MODE_0666 */
/* global _ */
const dotenv = require('dotenv');
const path = require('path');
const sortedObject = require('sorted-object');
const fs = require('fs');
const replace = require('key-value-replace');
const writeOperations = require('../../writeOperations');
const { PROJECT_TYPE } = require('../../constants/constant');

dotenv.config({ path: `${__dirname}/../../.env` });

async function createConstantFiles (templateFolder, dir, constants, toPath) {
  if (constants) {
    writeOperations.mkdir(dir, toPath);
    _.forEach(constants, (value, key) => {
      const requestConstant = writeOperations.loadTemplate(`${templateFolder}/requestConstant.js`);
      requestConstant.locals.CONSTANTS = JSON.stringify(value);
      requestConstant.locals.FILE_NAME = key;
      writeOperations.write(path.join(dir, `${toPath}/${key}.js`), requestConstant.render());
    });
  }
}

async function startRenderingEJS (dir, templateFolder, renderObject) {
  const {
    type, app, db, models, controllerDetails, modelWiseRoutes, authModule, authControllerIndex, pkg, emailService,
    smsService, indexRoute, modelValidation, constants, env,
    seeder, customPolicy, postmanCollectionJSONV20, postmanCollectionJSONV21, platformRoutes, customRoutes, shouldCopyQueryService, isAuth,
    fileUpload, socialData, allEJSEntities, controllerIndex, controllerIndexForCustomRoute,
    deleteDependent, userDirectoryStructure, servicesOfCustomRoutes, tableRelationships, dbConnection, customRoutePackageDependencies, testCases,
    commonService, readme, envPostman,
    thirdPartySMSServices, thirdPartyEmailService, templateRegistry, rolePermissionService, customRoutesWithPath, customRouteIndexes, dataAccessFiles, useCaseFiles, commonUseCaseFiles, middlewareIndex,
    customRoutesUsecase,
  } = renderObject;

  // db

  if (type === PROJECT_TYPE.CC_SEQUELIZE) {
    if (db && dbConnection) {
      let dbFilePath = userDirectoryStructure.configFolderPath.split('/').filter((e) => e !== '');
      // let dbFileName = dbFilePath.pop();
      if (!fs.existsSync(`${dir}${dbFilePath.join('/')}`)) {
        writeOperations.mkdir(dir, dbFilePath.join('/'));
      }
      writeOperations.write(path.join(dir, `${dbFilePath.join('/')}/db.js`), db.render());
      // writeOperations.write(path.join(dir, '/config/db.js'), db.render());
      dbFilePath = userDirectoryStructure.dbConnectionFolderPath.split('/').filter((e) => e !== '');
      dbFilePath.pop();
      writeOperations.write(path.join(dir, `${dbFilePath.join('/')}/dbConnection.js`), dbConnection.render());
    }
  } else if (db) {
    const dbFilePath = userDirectoryStructure.dbConnectionFolderPath.split('/').filter((e) => e !== '');
    const dbFileName = dbFilePath.pop();
    if (!fs.existsSync(`${dir}${dbFilePath.join('/')}`)) {
      writeOperations.mkdir(dir, dbFilePath.join('/'));
    }
    writeOperations.write(path.join(dir, `${dbFilePath.join('/')}/${dbFileName}`), db.render());
    // writeOperations.write(path.join(dir, '/config/db.js'), db.render());
    if (dbConnection) {
      writeOperations.write(path.join(dir, `${dbFilePath.join('/')}/dbConnection.js`), dbConnection.render());
    }
  }
  const dbFilePath = userDirectoryStructure.dbConnectionFolderPath.split('/').filter((e) => e !== '');
  dbFilePath.pop();

  if (!_.isEmpty(seeder)) {
    app.locals.SEEDER = true;
    writeOperations.mkdir(dir, userDirectoryStructure.seedersPath);
    writeOperations.write(path.join(dir, `${userDirectoryStructure.seedersPath}/index.js`), seeder.render());
  }

  // model
  _.forEach(models, (value, key) => {
    writeOperations.write(path.join(dir, `${userDirectoryStructure.modelFolderPath}/${key}.js`), value.render());
  });

  // dataAccessFiles
  if (!_.isEmpty(dataAccessFiles)) {
    _.forEach(dataAccessFiles, (value, key) => {
      writeOperations.mkdir(dir, `${userDirectoryStructure.dataAccessFolderPath}`);
      writeOperations.write(path.join(dir, `${userDirectoryStructure.dataAccessFolderPath}/${key}Db.js`), value.render());
    });
  }

  if (!_.isEmpty(tableRelationships)) {
    // generate sql relationships
    writeOperations.write(path.join(dir, `${userDirectoryStructure.modelFolderPath}/index.js`), tableRelationships.render());
  }

  writeOperations.write(path.join(dir, `${userDirectoryStructure.utilsFolderPath}/common.js`), commonService.render());

  // controller Index file if project is cc
  if (!_.isEmpty(controllerIndex)) {
    _.forEach(controllerIndex, (value, key) => {
      writeOperations.mkdir(`${dir}${userDirectoryStructure.controllerFolderPath}`, key);
      _.forEach(value, (model) => {
        _.forEach(model, (v, k) => {
          writeOperations.mkdir(`${dir}${userDirectoryStructure.controllerFolderPath}/${key}`, k);
          writeOperations.write(path.join(dir, `${userDirectoryStructure.controllerFolderPath}/${key}/${k}/index.js`), v.render(), MODE_0666);
        });
      });
    });
  }

  // controller
  const controller = controllerDetails.platformWiseController;
  if (!_.isEmpty(controllerDetails.packageDependencies.dependencies)) {
    Object.assign(pkg.dependencies, controllerDetails.packageDependencies.dependencies);
  }
  _.forEach(controller, (value, platform) => {
    writeOperations.mkdir(`${dir}/controller`, platform);
    _.forEach(value, (api, model) => {
      const controllerPath = replace(api.locals.path, {
        model,
        platform,
      });
      writeOperations.write(path.join(dir, controllerPath), api.render(), MODE_0666);
    });
  });

  // model wise Routes
  if (!_.isEmpty(modelWiseRoutes)) {
    _.forEach(modelWiseRoutes, (value, platformName) => {
      writeOperations.mkdir(`${dir}/routes`, platformName);
      _.forEach(value, (modelRoute, model) => {
        writeOperations.write(path.join(dir, `${userDirectoryStructure.routesFolderPath}/${platformName}/${model}Routes.js`), modelRoute.render(), MODE_0666);
      });
    });
  }

  // delete dependency
  if (!_.isEmpty(deleteDependent)) {
    /*  writeOperations.write(path.join(dir, '/utils/deleteDependent.js'), deleteDependent.render(), MODE_0666); */
    _.forEach(deleteDependent, (dependency) => {
      if (dependency.locals.PROJECT_TYPE === PROJECT_TYPE.MVC || dependency.locals.PROJECT_TYPE === PROJECT_TYPE.MVC_SEQUELIZE) {
        writeOperations.write(path.join(dir, '/utils/deleteDependent.js'), dependency.render(), MODE_0666);
      } else {
        writeOperations.mkdir(dir, `${userDirectoryStructure.useCaseFolderPath}/${dependency.locals.MODEL_NAME}`);
        writeOperations.write(path.join(dir, `${userDirectoryStructure.useCaseFolderPath}/${dependency.locals.MODEL_NAME}/deleteDependent.js`), dependency.render(), MODE_0666);
      }
    });
  }

  // authentication
  if (!_.isEmpty(authModule)) {
    // app
    _.forEach(authModule.app.locals, (value, appKey) => {
      app.locals[appKey] = value;
    });

    // auth controller Index
    if (!_.isEmpty(authControllerIndex)) {
      _.forEach(authControllerIndex, (value, platformName) => {
        writeOperations.mkdir(`${dir}${userDirectoryStructure.controllerFolderPath}/${platformName}`, 'authentication');
        writeOperations.write(path.join(dir, `${userDirectoryStructure.controllerFolderPath}/${platformName}/authentication/index.js`), value.render(), MODE_0666);
      });
    }

    if (!_.isEmpty(useCaseFiles)) {
      writeOperations.mkdir(dir, `${userDirectoryStructure.useCaseFolderPath}`);
      _.forEach(useCaseFiles, (modelOperations, modelName) => {
        writeOperations.mkdir(dir, `${userDirectoryStructure.useCaseFolderPath}/${modelName}`);
        _.forEach(modelOperations, (operationEjs) => {
          // console.log(require('util').inspect(operationEjs, false, null, true)); process.exit(1);
          writeOperations.write(path.join(dir, `${userDirectoryStructure.useCaseFolderPath}/${modelName}/${operationEjs.locals.FILE_NAME}.js`), operationEjs.render());
        });
        /*  */
      });
    }

    // middleware index.js
    if (middlewareIndex) {
      writeOperations.write(path.join(dir, `${userDirectoryStructure.middlewareFolderPath}/index.js`), middlewareIndex.render(), MODE_0666);
    }

    // package
    Object.assign(pkg.dependencies, authModule.packageDependency.dependencies);

    /*
     * constant
     * writeOperations.write(path.join(dir, `${userDirectoryStructure.configFolderPath}/authConstant.js`), authModule.constant.render(), MODE_0666);
     */
    writeOperations.mkdir(dir, userDirectoryStructure.constantFolderPath);
    writeOperations.write(path.join(dir, `${userDirectoryStructure.constantFolderPath}/authConstant.js`), authModule.constant.render(), MODE_0666);

    // authSetup
    _.forEach(authModule.authSetup, (value, platformName) => {
      // passport strategies
      if (type === PROJECT_TYPE.MVC || type === PROJECT_TYPE.MVC_SEQUELIZE) {
        writeOperations.write(path.join(dir, `${userDirectoryStructure.configFolderPath}/${platformName}PassportStrategy.js`), value.passport.render(), MODE_0666);
      } else {
        writeOperations.write(path.join(dir, `${userDirectoryStructure.middlewareFolderPath}/${platformName}PassportStrategy.js`), value.passport.render(), MODE_0666);
      }
      // writeOperations.write(path.join(dir, `/config/${platformName}PassportStrategy.js`), value.passport.render(), MODE_0666);
      writeOperations.write(path.join(dir, `/routes/${platformName}/auth.js`), value.authRoutes.render(), MODE_0666);
      const authPath = replace(value.authController.locals.PATH, { platform: platformName });
      writeOperations.write(path.join(dir, `${authPath}/authController.js`), value.authController.render(), MODE_0666);
    });

    writeOperations.mkdir(`${dir}${userDirectoryStructure.viewsFolderPath}`, 'successfullyResetPassword');
    writeOperations.copyTemplate(`${templateFolder}${templateRegistry.viewsFolderPath}/resetPassword.ejs`, `${dir}${userDirectoryStructure.viewsFolderPath}/successfullyResetPassword/html.ejs`);

    // authService
    if (type === PROJECT_TYPE.MVC || type === PROJECT_TYPE.MVC_SEQUELIZE) {
      writeOperations.write(path.join(dir, `${userDirectoryStructure.serviceFolderPath}/auth.js`), authModule.authService.render(), MODE_0666);
    }

    // policy
    writeOperations.write(path.join(dir, `${userDirectoryStructure.middlewareFolderPath}/auth.js`), authModule.policy.middleware.render(), MODE_0666);
    writeOperations.write(path.join(dir, `${userDirectoryStructure.middlewareFolderPath}/loginUser.js`), authModule.policy.authUser.render(), MODE_0666);

    /*
     * common file
     * writeOperations.copyTemplate(`${templateFolder}/utils/common.js`, `${dir}${userDirectoryStructure.utilsFolderPath}/common.js`);
     * writeOperations.copyTemplate(`${templateFolder}/utils/common.js`, `${dir}/utils/common.js`);
     */

    // Auth usecase for CC
    _.forEach(authModule.authSetup, (value) => {
      if (value.authUsecase) {
        writeOperations.mkdir(`${dir}${userDirectoryStructure.useCaseFolderPath}`, 'authentication');
        _.forEach(value.authUsecase, (usecase) => {
          writeOperations.write(path.join(dir, `${userDirectoryStructure.useCaseFolderPath}/authentication/${usecase.locals.FILE_NAME}.js`), usecase.render(), MODE_0666);
        });
      }
    });
  }

  if (!_.isEmpty(commonUseCaseFiles)) {
    writeOperations.mkdir(dir, `${userDirectoryStructure.useCaseFolderPath}/common`);
    _.forEach(commonUseCaseFiles, (usecaseEjs) => {
      writeOperations.write(path.join(dir, `${userDirectoryStructure.useCaseFolderPath}/common/${usecaseEjs.locals.FILE_NAME}.js`), usecaseEjs.render());
    });
  }

  if (emailService || isAuth) {
    pkg.dependencies.nodemailer = '~6.5.0';
    writeOperations.mkdir(`${dir}${userDirectoryStructure.viewsFolderPath}`, 'emailTemplate');
    const emailTemp = writeOperations.loadTemplate(`${templateFolder}${templateRegistry.viewsFolderPath}/emailTemplate`);
    writeOperations.write(path.join(dir, `${userDirectoryStructure.viewsFolderPath}/emailTemplate/html.ejs`), emailTemp.render(), MODE_0666);
    writeOperations.mkdir(`${dir}${userDirectoryStructure.serviceFolderPath}`, 'email');
    const emailNotificationService = writeOperations.loadTemplate(`${templateFolder}${templateRegistry.serviceFolderPath}/emailService.js`);
    writeOperations.write(path.join(dir, `${userDirectoryStructure.serviceFolderPath}/email/emailService.js`), emailNotificationService.render(), MODE_0666);
  }
  if (smsService || isAuth) {
    pkg.dependencies.axios = '~0.21.1';
    writeOperations.mkdir(`${dir}${userDirectoryStructure.serviceFolderPath}`, 'sms');
    const smsNotificationService = writeOperations.loadTemplate(`${templateFolder}${templateRegistry.serviceFolderPath}/smsService.js`);
    writeOperations.write(path.join(dir, `${userDirectoryStructure.serviceFolderPath}/sms/smsService.js`), smsNotificationService.render(), MODE_0666);
  }

  //  validation
  if (type === PROJECT_TYPE.CLEAN_CODE || type === PROJECT_TYPE.CC_SEQUELIZE) {
    if (!_.isEmpty(modelValidation)) {
      _.forEach(modelValidation, (value, key) => {
        if (!fs.existsSync(`${value.locals.PATH}/schema`)) {
          writeOperations.mkdir(dir, `${value.locals.PATH}/schema`);
        }
        writeOperations.write(path.join(dir, `${value.locals.PATH}/schema/${key}.js`), value.render());
      });
    }
  } else {
    _.forEach(modelValidation, (value, key) => {
      writeOperations.write(path.join(dir, `${value.locals.PATH}/${key}Validation.js`), value.render());
    });
  }

  // constants
  if (!_.isEmpty(constants)) {
    await createConstantFiles(`${templateFolder}${templateRegistry.configFolderPath}`, dir, constants, userDirectoryStructure.constantFolderPath);
  }

  // custom policy
  if (!_.isEmpty(customPolicy)) {
    _.forEach(customPolicy, (value, policy) => {
      writeOperations.write(path.join(dir, `${userDirectoryStructure.middlewareFolderPath}/${policy}.js`), value.render(), MODE_0666);
    });
  }

  // role permission middleware
  if (!_.isEmpty(rolePermissionService)) {
    writeOperations.write(path.join(dir, `${userDirectoryStructure.middlewareFolderPath}/checkRolePermission.js`), rolePermissionService.render(), MODE_0666);
  }

  // customRoutes
  if (!_.isEmpty(customRoutes)) {
    if (!_.isEmpty(customRoutes.new)) {
      // index route
      if (customRoutes.new.platform && customRoutes.new.platform.length) {
        _.forEach(customRoutes.new.platform, (value) => {
          indexRoute.locals.PLATFORM[value] = {};
        });
      }
      _.forEach(customRoutes.new.controllerNServiceNRoutes, (value, customRoute) => {
        writeOperations.mkdir(`${dir}${userDirectoryStructure.routesFolderPath}`, customRoute);
        writeOperations.mkdir(`${dir}${userDirectoryStructure.controllerFolderPath}`, customRoute);
        writeOperations.mkdir(`${dir}${userDirectoryStructure.serviceFolderPath}`, customRoute);
        _.forEach(value, (element, customKey) => {
          if (customRoutes.shouldCreateFolderOfController && !fs.existsSync(`${dir}${userDirectoryStructure.controllerFolderPath}/${customRoute}/${customKey}`)) {
            writeOperations.mkdir(`${dir}${userDirectoryStructure.controllerFolderPath}/${customRoute}`, customKey);
          }
          const controllerPath = replace(element.controller.locals.path, {
            platform: customRoute,
            controller: customKey,
          });
          writeOperations.write(path.join(dir, controllerPath), element.controller.render(), MODE_0666);
          writeOperations.write(path.join(dir, `${userDirectoryStructure.serviceFolderPath}/${customRoute}/${customKey}Service.js`), element.service.render(), MODE_0666);
          if (!_.isEmpty(element.route)) {
            writeOperations.write(path.join(dir, `${userDirectoryStructure.routesFolderPath}/${customRoute}/${customKey}Routes.js`), element.route.render(), MODE_0666);
          }
        });
      });
      _.forEach(customRoutes.new.routeIndex, (element, customRoute) => {
        writeOperations.write(path.join(dir, `${userDirectoryStructure.routesFolderPath}/${customRoute}/index.js`), element.indexRoute.render(), MODE_0666);
      });
    }
    if (!_.isEmpty(customRoutes.old)) {
      _.forEach(customRoutes.old.controllerNServiceNRoutes, (element, customRoute) => {
        writeOperations.mkdir(`${dir}${userDirectoryStructure.serviceFolderPath}`, customRoute);
        _.forEach(element, (value, customKey) => {
          if (customRoutes.shouldCreateFolderOfController && !fs.existsSync(`${dir}${userDirectoryStructure.controllerFolderPath}/${value.controller.locals.platform}/${customKey}`)) {
            writeOperations.mkdir(`${dir}${userDirectoryStructure.controllerFolderPath}/${value.controller.locals.platform}`, customKey);
          }
          const controllerPath = replace(value.controller.locals.path, {
            platform: value.controller.locals.platform,
            controller: customKey,
          });
          writeOperations.write(path.join(dir, controllerPath), value.controller.render(), MODE_0666);
          writeOperations.write(path.join(dir, `${userDirectoryStructure.serviceFolderPath}/${customRoute}/${customKey}Service.js`), value.service.render(), MODE_0666);
          if (!_.isEmpty(value.route)) {
            writeOperations.write(path.join(dir, `${userDirectoryStructure.routesFolderPath}/${customRoute}/${customKey}Routes.js`), value.route.render(), MODE_0666);
          }
        });
      });

      if (!_.isEmpty(customRouteIndexes)) {
        _.forEach(customRouteIndexes, (element, customKey) => {
          if (!_.isEmpty(platformRoutes)) {
            _.forEach(platformRoutes, (value, platformName) => {
              if (platformName === customKey) {
                platformRoutes[platformName].locals.ROUTES = element;
              }
            });
          }
        });
      }
    }
    if (shouldCopyQueryService && !fs.existsSync(`${dir}${userDirectoryStructure.serviceFolderPath}/customQueryService.js`)) {
      writeOperations.copyTemplate(`${templateFolder}${templateRegistry.serviceFolderPath}/customQueryService.js.ejs`, `${dir}${userDirectoryStructure.serviceFolderPath}/customQueryService.js`);
    }
  }

  if (!_.isEmpty(customRoutesWithPath)) {
    if (!_.isEmpty(customRoutesWithPath.controllers)) {
      _.forEach(customRoutesWithPath.controllers, (controller1, con) => {
        if (!fs.existsSync(`${dir}${con}`)) { writeOperations.mkdir(`${dir}`, con); }
        _.forEach(controller1, (c) => {
          writeOperations.write(path.join(dir, `${con}/${c.locals.name}.js`), c.render(), MODE_0666);
        });
      });
    }
    if (!_.isEmpty(customRoutesWithPath.routes)) {
      _.forEach(customRoutesWithPath.routes, (route1, r) => {
        if (!fs.existsSync(`${dir}${r}`)) { writeOperations.mkdir(`${dir}`, r); }
        _.forEach(route1, (c) => {
          writeOperations.write(path.join(dir, `${r}/${c.locals.name}.js`), c.render(), MODE_0666);
        });
      });
    }
  }

  if (!_.isEmpty(customRoutePackageDependencies)) {
    Object.assign(pkg.dependencies, customRoutePackageDependencies.dependencies);
  }
  if (controllerIndexForCustomRoute && controllerIndexForCustomRoute.length) {
    _.forEach(controllerIndexForCustomRoute, (index) => {
      if (!fs.existsSync(`${dir}${userDirectoryStructure.controllerFolderPath}/${index.locals.PLATFORM}/${index.locals.CONTROLLER}`)) {
        writeOperations.mkdir(`${dir}`, `${userDirectoryStructure.controllerFolderPath}/${index.locals.PLATFORM}/${index.locals.CONTROLLER}`);
      }
      writeOperations.write(path.join(dir, `${userDirectoryStructure.controllerFolderPath}/${index.locals.PLATFORM}/${index.locals.CONTROLLER}/index.js`), index.render(), MODE_0666);
    });
  }

  if (servicesOfCustomRoutes && servicesOfCustomRoutes.length) {
    _.forEach(servicesOfCustomRoutes, (service) => {
      if (!fs.existsSync(`${dir}${userDirectoryStructure.serviceFolderPath}/${service.locals.PLATFORM}`)) {
        writeOperations.mkdir(`${dir}${userDirectoryStructure.serviceFolderPath}`, service.locals.PLATFORM);
      }

      writeOperations.write(path.join(dir, `${userDirectoryStructure.serviceFolderPath}/${service.locals.PLATFORM}/${service.locals.SERVICE_NAME}Service.js`), service.render(), MODE_0666);
    });
  }

  if (!_.isEmpty(customRoutesUsecase)) {
    _.forEach(customRoutesUsecase, (usecase) => {
      if (!fs.existsSync(`${dir}${usecase.locals.folderPath}`)) {
        writeOperations.mkdir(`${dir}`, usecase.locals.folderPath);
      }
      writeOperations.write(path.join(dir, usecase.locals.path), usecase.render(), MODE_0666);
    });
  }

  // fileUpload
  if (!_.isEmpty(fileUpload)) {
    _.forEach(fileUpload.controllers, (f) => {
      if (f.platform === 'common') {
        if (!fs.existsSync(`${dir}${userDirectoryStructure.controllerFolderPath}/common`)) {
          writeOperations.mkdir(dir, `${userDirectoryStructure.controllerFolderPath}/common`);
        }
      }
      if (fileUpload.isFolder) {
        writeOperations.mkdir(dir, `${userDirectoryStructure.controllerFolderPath}/${f.platform}/fileUpload`);
      }

      const controllerPath = replace(f.controller.locals.PATH, { platform: f.platform });
      if (!fs.existsSync(controllerPath)) {
        writeOperations.mkdir(dir, controllerPath);
      }
      writeOperations.write(path.join(dir, `${controllerPath}/fileUploadController.js`), f.controller.render());
    });
    _.forEach(fileUpload.routes, (f) => {
      if (!_.isEmpty(platformRoutes[f.platform])) {
        Object.assign(platformRoutes[f.platform].locals.PLATFORM, { upload: [] });
      }
      if (!fs.existsSync(path.join(dir, `${userDirectoryStructure.routesFolderPath}/${f.platform}`))) {
        writeOperations.mkdir(dir, `${userDirectoryStructure.routesFolderPath}/${f.platform}`);
      }
      writeOperations.write(path.join(dir, `${userDirectoryStructure.routesFolderPath}/${f.platform}/uploadRoutes.js`), f.mainRoute.render());
    });
    Object.assign(pkg.dependencies, fileUpload.packageDependencies.dependencies);
  }

  if (!_.isEmpty(allEJSEntities)) {
    _.forEach(allEJSEntities, (value, key) => {
      writeOperations.write(path.join(dir, `${userDirectoryStructure.entityFolderPath}/${key}.js`), value.render());
    });
  }

  // adding dependencies of social Login
  if (!_.isEmpty(socialData)) {
    Object.assign(pkg.dependencies, socialData.pkg.dependencies);
    _.forEach(socialData.app.locals.uses, (value) => {
      app.locals.uses.push(value);
    });
  }

  // platform index routes
  if (!_.isEmpty(platformRoutes)) {
    _.forEach(platformRoutes, (platformIndex, platformName) => {
      writeOperations.write(path.join(dir, `${userDirectoryStructure.routesFolderPath}/${platformName}/index.js`), platformIndex.render(), MODE_0666);
    });
  }
  // index routes
  if (!_.isEmpty(indexRoute)) {
    app.locals.IS_ROUTE = true;
    if (!_.isEmpty(customRoutesWithPath) && !_.isEmpty(customRoutesWithPath.mainIndexRoute)) {
      indexRoute.locals.CUSTOM_ROUTE = customRoutesWithPath.mainIndexRoute;
    }
    writeOperations.write(path.join(dir, `${userDirectoryStructure.routesFolderPath}/index.js`), indexRoute.render(), MODE_0666);
  }

  // Third-Party SMS Services
  if (!_.isEmpty(thirdPartySMSServices)) {
    if (!fs.existsSync(`${dir}${userDirectoryStructure.serviceFolderPath}/sms`)) { writeOperations.mkdir(`${dir}${userDirectoryStructure.serviceFolderPath}`, 'sms'); }
    writeOperations.write(path.join(dir, `${userDirectoryStructure.serviceFolderPath}/sms/smsService.js`), thirdPartySMSServices.render(), MODE_0666);
  }

  // ? Third party email services
  if (!_.isEmpty(thirdPartyEmailService)) {
    if (!_.isEmpty(thirdPartyEmailService.email)) {
      if (!fs.existsSync(`${dir}${userDirectoryStructure.serviceFolderPath}/email`)) { writeOperations.mkdir(`${dir}${userDirectoryStructure.serviceFolderPath}`, 'email'); }
      writeOperations.write(path.join(dir, `${userDirectoryStructure.serviceFolderPath}/email/emailService.js`), thirdPartyEmailService.email.render(), MODE_0666);
    }
  }

  // ? test cases
  if (!_.isEmpty(testCases)) {
    if (_.isEmpty(pkg.devDependencies)) {
      Object.assign(pkg, { devDependencies: {} });
    }
    Object.assign(pkg.devDependencies, { jest: '^27.0.6' });
    Object.assign(pkg.devDependencies, { supertest: '^6.1.3' });
    Object.assign(pkg.scripts, { test: 'jest --runInBand --verbose --detectOpenHandles' });
    if (!fs.existsSync(`${dir}${userDirectoryStructure.testCasePath}`)) { writeOperations.mkdir(dir, userDirectoryStructure.testCasePath); }
    _.forEach(testCases, (platforms, platformName) => {
      if (!fs.existsSync(`${dir}${userDirectoryStructure.testCasePath}/${platformName}`)) { writeOperations.mkdir(`${dir}${userDirectoryStructure.testCasePath}`, `${platformName}`); }
      _.forEach(platforms, (model, modelName) => {
        const testCasePath = replace(model.locals.path, {
          platform: platformName,
          model: modelName,
        });
        writeOperations.write(path.join(dir, testCasePath), model.render(), MODE_0666);
      });
    });
  }

  // app js

  // env file
  if (!_.isEmpty(env)) {
    /*
     * if (userDirectoryStructure.mainJSFilePath.includes('.js')) {
     *   userDirectoryStructure.mainJSFilePath = '';
     * }
     */
    const filePath = userDirectoryStructure.envFilePath.split('/').filter((e) => e !== '');
    const fileName = filePath.pop();
    if (filePath.length) {
      // mkdir
      writeOperations.mkdir(dir, filePath.join('/'));
    }
    writeOperations.write(path.join(dir, `${filePath.join('/')}/${fileName}`), env.env.render());
    if (!_.isEmpty(env.customEnv)) {
      _.forEach(env.customEnv, (value, key) => {
        writeOperations.write(path.join(dir, `${filePath.join('/')}/${fileName}.${key}`), value.render());
      });
    }
  }

  // app.js
  writeOperations.write(path.join(dir, 'app.js'), app.render(), MODE_0666);

  // package.json
  pkg.dependencies = sortedObject(pkg.dependencies);
  writeOperations.write(path.join(dir, 'package.json'), `${JSON.stringify(pkg, null, 2)}\n`);

  // postman collection - V2.0
  if (!_.isEmpty(postmanCollectionJSONV20)) {
    writeOperations.write(path.join(dir, '/postman/postman-collection.json'), postmanCollectionJSONV20);
  }
  // postman collection - V2.1
  if (!_.isEmpty(postmanCollectionJSONV20)) {
    writeOperations.write(path.join(dir, '/postman/postman-collection-v.2.1.0.json'), postmanCollectionJSONV21);
  }

  if (!_.isEmpty(envPostman)) {
    writeOperations.write(path.join(dir, '/postman/environment-file.json'), JSON.stringify(envPostman, undefined, 2));
  }

  // ReadME file
  if (readme) {
    writeOperations.write(path.join(dir, 'README.md'), readme.render());
  }
  // .gitignore file
  writeOperations.copyTemplate(`${templateFolder}/.gitignore`, `${dir}/.gitignore`);
}

module.exports = { startRenderingEJS };
