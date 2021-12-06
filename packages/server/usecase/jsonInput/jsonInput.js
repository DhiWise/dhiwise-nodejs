/* global MESSAGE, _ */
const {
  ORM_TYPE, DATABASE_TYPE, GENERATOR_DATABASE_TYPE, GENERATOR_ORM_TYPE,
} = require('../../models/constants/applicationConfig');

const { JSON_INPUT } = require('../../constants/jsonInput');
const { PARENT_CODES } = require('../../constants/master');
const {
  SERVER_ERROR, OK, APPLICATION_NOT_FOUND,
} = require('../../constants/message').message;

const {
  projectConstants, projectPolicy, schema, projectPackages, projectRoleAccessPermission, projectRoutes, notificationTemplates,
} = require('./util');
const { applicationIdValidation } = require('../util/validation/applicationId');

const ApplicationRepository = require('../../repo/application');
const ApplicationConfigRepository = require('../../repo/applicationConfig');
const SchemaRepository = require('../../repo/schema');
const MasterRepository = require('../../repo/master');

const applicationRepo = new ApplicationRepository();
const applicationConfigRepo = new ApplicationConfigRepository();
const schemaRepo = new SchemaRepository();
const masterRepo = new MasterRepository();

/**
 * Function used to get `MASTER` data.
 */
async function getMasterData () {
  const masterCodesData = await masterRepo.getDetailsForInput();
  if (!masterCodesData || masterCodesData.length <= 0) {
    return [];
  }

  return masterCodesData;
}

/**
 * Function used to update application details.
 * @param  {} params
 */
async function updateApplicationDetails (params) {
  try {
    const filter = { find: { _id: params.applicationId } };
    const applicationDetails = await applicationRepo.get(filter);

    if (!applicationDetails) {
      return APPLICATION_NOT_FOUND;
    }

    const updateAppFilter = {};

    // Prepare `configInput` object.
    let configInput = {};
    if (applicationDetails?.configInput) {
      configInput = applicationDetails.configInput;
    }
    if (params?.authentication?.loginAccess) {
      configInput.loginAccess = params.authentication.loginAccess;
    }
    if (params?.authentication?.isAuthentication) {
      configInput.isAuthentication = params.authentication.isAuthentication;
    } else {
      configInput.isAuthentication = false;
    }
    if (params?.authentication?.authModel) {
      configInput.authModel = params.authentication.authModel;
    } else {
      configInput.authModel = JSON_INPUT.AUTH_MODEL;
    }
    if (params?.config?.port) {
      configInput.port = String(params.config.port);
    } else {
      configInput.port = '5000';
    }
    if (params?.config?.databaseName) {
      configInput.databaseName = params.config.databaseName;
    }
    if (params?.authentication?.platform) {
      configInput.platform = params.authentication.platform;
    }
    if (params?.authentication?.types) {
      configInput.types = params.authentication.types;
    }
    if (params?.authentication?.noPlatform) {
      configInput.noPlatform = params.authentication.noPlatform;
    }
    if (!_.isEmpty(configInput)) {
      updateAppFilter.configInput = configInput;
    }

    // Prepare `stepInput` object.
    let stepInput = {};
    if (applicationDetails?.stepInput) {
      stepInput = applicationDetails?.stepInput;
    }
    if (params?.directoryStructure) {
      stepInput.directoryStructure = params.directoryStructure;
    }

    stepInput.ormType = ORM_TYPE.MONGOOSE;
    stepInput.databaseType = DATABASE_TYPE.MONGODB;
    if (params?.ORM) {
      stepInput.ormType = _.invert(GENERATOR_ORM_TYPE)?.[params.ORM];
    }
    if (params?.adapter) {
      stepInput.databaseType = _.invert(GENERATOR_DATABASE_TYPE)?.[params.adapter];
    }
    if (!_.isEmpty(stepInput)) {
      updateAppFilter.stepInput = stepInput;
    }

    if (params?.projectType) {
      updateAppFilter.projectType = params.projectType;
    } else {
      updateAppFilter.projectType = JSON_INPUT.PROJECT_TYPE;
    }

    const updatedApp = await applicationRepo.update(applicationDetails._id, updateAppFilter);

    return {
      ...OK,
      data: updatedApp.toObject(),
    };
  } catch (err) {
    // console.log('err: ', err);
    return {
      ...SERVER_ERROR,
      data: err.toString(),
    };
  }
}

/**
 * Function used to update `application-config`.
 * @param  {} {params
 * @param  {} applicationDetails
 * @param  {} }
 */
async function updateApplicationConfig ({
  params, applicationId,
}) {
  try {
    const appConfigInput = {};

    if (params?.authentication?.noOfDevice) {
      appConfigInput.noOfDevice = params.authentication.noOfDevice;
    }
    if (params?.authentication?.authModule) {
      appConfigInput.authModule = params.authentication.authModule;
      const authSchema = await schemaRepo.get({
        find: {
          applicationId,
          name: params.authentication.authModule,
        },
      });
      if (authSchema) {
        appConfigInput.authModuleId = authSchema._id;
      }
    }
    if (params?.authentication?.loginWith) {
      if (params?.authentication?.loginWith?.username) {
        params.authentication.loginWith.username = _.compact(params.authentication.loginWith.username);
      }
      appConfigInput.loginWith = params.authentication.loginWith;
    }
    if (params?.authentication?.loginRetryLimit) {
      appConfigInput.loginRetryLimit = params.authentication.loginRetryLimit;
    }
    if (params?.authentication?.loginRateLimit) {
      appConfigInput.loginRateLimit = params.authentication.loginRateLimit;
    }
    if (params?.authentication?.loginNextRetryTime) {
      appConfigInput.loginNextRetryTime = params.authentication.loginNextRetryTime;
    }
    if (params?.authentication?.resetPassword) {
      if (params?.authentication?.resetPassword?.link) {
        const rPassLinkObj = _.cloneDeep(params.authentication.resetPassword.link);

        // EMAIL & SMS MasterIds
        const masterCodesIds = [];
        if (rPassLinkObj?.email) {
          const emailData = _.find(params.masterDetails, { code: PARENT_CODES.EMAIL });
          if (emailData) {
            masterCodesIds.push(emailData._id.toString());
          }
        }
        if (rPassLinkObj?.sms) {
          const smsData = _.find(params.masterDetails, { code: PARENT_CODES.SMS });
          if (smsData) {
            masterCodesIds.push(smsData._id.toString());
          }
        }
        if (masterCodesIds && masterCodesIds.length > 0) {
          params.authentication.resetPassword.link.masterIds = _.cloneDeep(masterCodesIds);
        }
      }
      appConfigInput.resetPassword = params.authentication.resetPassword;
    }
    if (params?.authentication?.isSocialMediaAuth) {
      appConfigInput.isSocialMediaAuth = params.authentication.isSocialMediaAuth;
    }
    if (params?.authentication?.restrictNoOfDevice) {
      appConfigInput.restrictNoOfDevice = params.authentication.restrictNoOfDevice;
    }
    if (params?.fileUpload) {
      appConfigInput.fileUpload = _.cloneDeep(params.fileUpload);
    }
    if (params?.socket?.selected) {
      appConfigInput.isSocket = params.socket.selected;
    }
    if (params?.authentication?.socialPlatform) {
      _.map(params.authentication.socialPlatform, (sPlatform) => {
        const sAuthData = _.find(params.masterDetails, { code: sPlatform.type });
        if (sAuthData?._id) {
          sPlatform.typeId = _.cloneDeep(sAuthData._id);
        }
        if (sPlatform?.platforms) {
          sPlatform.platform = _.cloneDeep(sPlatform?.platforms);
          delete sPlatform?.platforms;
        }
      });
      appConfigInput.socialPlatform = _.cloneDeep(params.authentication.socialPlatform);
    }
    if (params?.authentication?.externalServiceProviderData) {
      const exProvider = params?.authentication?.externalServiceProviderData;
      _.map(exProvider, (provider) => {
        if (provider?.type) {
          const providerData = _.find(params.masterDetails, { code: provider.type });
          if (providerData?._id) {
            provider.typeId = providerData._id;
          }
        }

        if (provider?.serviceProvide) {
          const providerSubData = _.find(params.masterDetails, { name: provider.serviceProvide });
          if (providerSubData?._id) {
            provider.serviceProviderId = providerSubData._id;
          }
        }
      });
      appConfigInput.externalServiceProviderData = _.cloneDeep(exProvider);
    }
    if (params?.authentication?.tokenExpireTime) {
      appConfigInput.tokenExpiryTime = params.authentication.tokenExpireTime;
    }

    if (!_.isEmpty(appConfigInput)) {
      const appConfigFilter = { find: { applicationId } };
      const appConfigDetails = await applicationConfigRepo.get(appConfigFilter);
      if (appConfigDetails) {
        await applicationConfigRepo.update(appConfigDetails._id, appConfigInput);
      } else {
        appConfigInput.applicationId = _.cloneDeep(applicationId);
        await applicationConfigRepo.create(appConfigInput);
      }
    }

    return OK;
  } catch (err) {
    // console.log('err: ', err);
    return {
      ...SERVER_ERROR,
      data: err.toString(),
    };
  }
}

const jsonInput = () => async (params) => {
  try {
    const {
      value, error,
    } = applicationIdValidation(params);
    if (error) {
      return {
        data: null,
        code: MESSAGE.BAD_REQUEST.code,
        message: error,
      };
    }
    params = _.cloneDeep(value);
    const errorResponse = [];

    // Get `MASTER` data.
    const masterDetails = await getMasterData();

    // Update application details.
    const updateAppRes = await updateApplicationDetails({
      ...params,
      masterDetails,
    });
    if (updateAppRes.code !== OK.code) {
      return updateAppRes;
    }

    const updatedAppDetails = _.cloneDeep(updateAppRes.data);

    // Store `Package` related details.
    if (params && params.packages && !_.isEmpty(params.packages)) {
      const response = await projectPackages({
        params: {
          data: params.packages,
          applicationId: params.applicationId,
        },
      });

      if (response && response.data && response.data.errors && _.size(response.data.errors) > 0) {
        _.each(response.data.errors, (v) => {
          errorResponse.push(v);
        });
      }
    }

    // Store `Constants` related details.
    if (params && params.constants && !_.isEmpty(params.constants)) {
      const response = await projectConstants({
        params: {
          data: params.constants,
          applicationId: params.applicationId,
        },
      });

      if (response && response.data && response.data.errors && _.size(response.data.errors) > 0) {
        _.each(response.data.errors, (v) => {
          errorResponse.push(v);
        });
      }
    }

    // Store `Policy` related details.
    if (params && params.policy && !_.isEmpty(params.policy)) {
      const response = await projectPolicy({
        params: {
          data: params.policy,
          applicationId: params.applicationId,
        },
      });

      if (response && response.data && response.data.errors && _.size(response.data.errors) > 0) {
        _.each(response.data.errors, (v) => {
          errorResponse.push(v);
        });
      }
    }

    // Store `Models` related details.
    if (params && params.models && !_.isEmpty(params.models)) {
      const response = await schema({
        params: {
          data: {
            models: params?.models,
            modelConfig: params?.modelConfig,
            newModelConfig: params?.newModelConfig,
            hooks: params?.hooks,
            modelIndexes: params?.modelIndexes,
            authModule: params?.authentication?.authModule,
          },
          applicationId: params.applicationId,
        },
      });

      if (response && response.data && response.data.errors && _.size(response.data.errors) > 0) {
        _.each(response.data.errors, (v) => {
          errorResponse.push(v);
        });
      }
    }

    // Store `Role-Access-Permission` related details.
    if (params?.rolePermission && !_.isEmpty(params?.rolePermission)) {
      const response = await projectRoleAccessPermission({
        params: {
          data: {
            rolePermission: params.rolePermission,
            applicationId: params.applicationId,
          },
        },
      });

      if (response && response.data && response.data.errors && _.size(response.data.errors) > 0) {
        _.each(response.data.errors, (v) => {
          errorResponse.push(v);
        });
      }
    }

    // Store `Routes` related details.
    if (params?.routes && !_.isEmpty(params.routes) > 0) {
      const response = await projectRoutes({
        params: {
          data: {
            routes: params.routes,
            applicationId: params.applicationId,
            definitionType: params?.definitionDetails?.code,
          },
        },
      });

      if (response && response.data && response.data.errors && _.size(response.data.errors) > 0) {
        _.each(response.data.errors, (v) => {
          errorResponse.push(v);
        });
      }
    }

    // Store `Notification-Templates` related details.
    if (params?.templatesData && !_.isEmpty(params.templatesData) > 0) {
      const response = await notificationTemplates({
        params: {
          data: {
            templatesData: params.templatesData,
            applicationId: params.applicationId,
            masterDetails,
          },
        },
      });

      if (response && response.data && response.data.errors && _.size(response.data.errors) > 0) {
        _.each(response.data.errors, (v) => {
          errorResponse.push(v);
        });
      }
    }

    const updateAppConfigParams = {
      ...params,
      masterDetails,
    };
    // Update application-config.
    const updateAppConfig = await updateApplicationConfig({
      params: updateAppConfigParams,
      applicationId: updatedAppDetails._id,
    });
    if (updateAppConfig.code !== OK.code) {
      return updateAppConfig;
    }

    return {
      ...OK,
      data: { errors: errorResponse },
    };
  } catch (err) {
    // console.log('error', err);
    return SERVER_ERROR;
  }
};

module.exports = jsonInput;
