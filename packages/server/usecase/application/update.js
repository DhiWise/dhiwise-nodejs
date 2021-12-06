/* global MESSAGE ,_ */
const mongoose = require('mongoose');
const dayjs = require('dayjs');
const { DEFAULT_POLICY_NAME } = require('../../models/constants/application');
const {
  getAdditionalJsonAuthOptions, getAdditionalJsonWithoutAuthOptions, schemaJsonAuthOptions, schemaJsonOptions,
} = require('../schema/util/staticData');
const {
  INVALID_REQUEST_PARAMS,
  APPLICATION_UPDATED, SERVER_ERROR, OK,
} = require('../../constants/message').message;
const { VALIDATION_RULES } = require('../../constants/validation');
const projectApplicationUpdate = require('../common/projectApplicationUpdate');
const { getApplicationDetail } = require('../util/getApplicationData');
const { applicationUpdateValidation } = require('../util/validation/applicationUpdate');

const applicationUpdateFields = ['name', 'description', 'stepInput.packageName', 'stepInput.bundleId', 'configInput'];

const SchemaDetailsRepository = require('../../repo/schemaDetail');
const ProjectRouteRepository = require('../../repo/projectRoute');
const ApplicationConfigRepository = require('../../repo/applicationConfig');

const schemaDetailsRepo = new SchemaDetailsRepository();
const projectRouteRepo = new ProjectRouteRepository();
const applicationConfigRepo = new ApplicationConfigRepository();

const RouteDeleteUseCase = require('../projectRoute/deleteDependency');
const getPermissionWiseRoute = require('../util/getPermissionWiseRoute');
const routeInsertManyUseCase = require('../projectRoute/insertMany');

/**
 * Function used to update schema-details and project-routes.
 * @param  {} {schemaRepo
 * @param  {} applicationRepo
 * @param  {} updatedApp
 * @param  {} }
 */
async function updateSchemaDetailsAndRoutes ({
  schemaRepo, applicationRepo, updatedApp, definitionCode,
}) {
  try {
    if (updatedApp?.configInput?.platform) {
      const platforms = updatedApp.configInput.platform;

      // Get login-access platform.
      let uniqPlatform = [];
      _.each(updatedApp.configInput.loginAccess, (v) => {
        uniqPlatform = uniqPlatform.concat(v);
      });
      uniqPlatform = _.uniq(uniqPlatform);

      // Get all schemas
      const schemas = await schemaRepo.getDetails({ find: { applicationId: updatedApp._id } });
      if (schemas && schemas.length > 0) {
        const schemaIds = _.map(schemas, '_id');

        const schemaDetails = await schemaDetailsRepo.getDetails({ find: { schemaId: schemaIds } });

        if (schemaDetails && schemaDetails.length > 0) {
          for (let i = 0; i < schemaDetails.length; i += 1) {
            const schemaDetail = schemaDetails[i];

            const {
              schemaJson, additionalJson,
            } = schemaDetail;

            const schemaJsonPlatforms = _.keys(schemaJson);
            const schemaPlatformDiff = _.difference(schemaJsonPlatforms, platforms);

            // Remove platforms from schemaJson, which are not available in application platforms.
            if (schemaPlatformDiff && schemaPlatformDiff.length > 0) {
              _.map(schemaPlatformDiff, (val) => {
                delete schemaJson[val];
              });
            }

            const additionalJsonPlatforms = _.keys(additionalJson.additionalSetting);
            const additionalJsonPlatformDiff = _.difference(additionalJsonPlatforms, platforms);

            // Remove platforms from additionalJson, which are not available in application platforms.
            if (additionalJsonPlatformDiff && additionalJsonPlatformDiff.length > 0) {
              _.map(additionalJsonPlatformDiff, (val) => {
                delete additionalJson.additionalSetting[val];
              });
            }

            for (let p = 0; p < platforms.length; p += 1) {
              const platform = platforms[p];

              let schemaJsonOpt = {};
              let additionalSettingOpt = {};

              if (!schemaDetail.schemaJson[platform]) {
                if (_.includes(uniqPlatform, platform)) {
                  schemaJsonOpt = schemaJsonAuthOptions();
                } else {
                  schemaJsonOpt = schemaJsonOptions();
                }
              } else if (schemaDetail.schemaJson[platform]) {
                schemaJsonOpt = schemaDetail.schemaJson[platform];
                if (_.includes(uniqPlatform, platform)) {
                  // `schemaJson` add `isAuth` object.
                  _.each(schemaJsonOpt, (val) => {
                    if (val?.isAuth === false || val.policy) {
                      val.isAuth = true;
                    }
                  });

                  const index = _.findIndex(schemaJsonOpt, { isAuth: true });
                  if (index >= 0) {
                    // Add `auth` policy
                    if (schemaJsonOpt[index]?.policy && !_.includes(schemaJsonOpt[index].policy, DEFAULT_POLICY_NAME)) {
                      schemaJsonOpt[index].policy.push(DEFAULT_POLICY_NAME);
                    } else if (!schemaJsonOpt[index]?.policy) {
                      schemaJsonOpt[index].policy = [DEFAULT_POLICY_NAME];
                    }
                  } else {
                    schemaJsonOpt.push({
                      isAuth: true,
                      policy: [DEFAULT_POLICY_NAME],
                    });
                  }
                  schemaJsonOpt = _.compact(schemaJsonOpt);
                } else {
                  _.each(schemaJsonOpt, (val) => {
                    if (val?.isAuth === true) {
                      val.isAuth = false;
                      if (val?.policy) {
                        val.policy = val.policy.filter((v) => {
                          if (v !== DEFAULT_POLICY_NAME) {
                            return v;
                          }
                          return null;
                        });
                        val.policy = _.compact(val.policy);
                      }
                    }
                  });
                }
              }

              if (!schemaDetail.additionalJson.additionalSetting[platform]) {
                if (_.includes(uniqPlatform, platform)) {
                  additionalSettingOpt = getAdditionalJsonAuthOptions();
                } else {
                  additionalSettingOpt = getAdditionalJsonWithoutAuthOptions();
                }
              } else if (schemaDetail.additionalJson.additionalSetting[platform]) {
                additionalSettingOpt = schemaDetail.additionalJson.additionalSetting[platform];
                if (_.includes(uniqPlatform, platform)) {
                  // `additionalJson` add `isAuth` object.
                  _.each(additionalSettingOpt, (val) => {
                    if (!val.isAuth || val.isAuth !== true) {
                      val.isAuth = true;
                    }
                    if (val.policy && !_.includes(val.policy, DEFAULT_POLICY_NAME)) {
                      val.policy.push(DEFAULT_POLICY_NAME);
                    } else if (!val.policy) {
                      val.policy = [DEFAULT_POLICY_NAME];
                    }
                  });
                } else {
                  _.each(additionalSettingOpt, (val) => {
                    if (val.isAuth === true) {
                      val.isAuth = false;
                    }
                    if (val.policy && _.includes(val.policy, DEFAULT_POLICY_NAME)) {
                      val.policy = _.compact(val.policy.filter((v) => {
                        if (v !== DEFAULT_POLICY_NAME) {
                          return v;
                        }
                        return null;
                      }));
                    }
                  });
                }
              }

              if (!_.isEmpty(schemaJsonOpt)) {
                schemaJson[platform] = schemaJsonOpt;
              }

              if (!_.isEmpty(additionalSettingOpt)) {
                additionalJson.additionalSetting[platform] = additionalSettingOpt;
              }
            }

            // eslint-disable-next-line no-await-in-loop
            const updatedSchemaDetails = await schemaDetailsRepo.update(schemaDetail._id, {
              schemaJson,
              additionalJson,
            });
            const schemaDetailsData = updatedSchemaDetails.toObject();

            // Get schema data.
            const schemaData = _.find(schemas, { _id: schemaDetailsData.schemaId });

            if (schemaData) {
              // Delete model related routes.
              const routeDeleteFilter = {
                find: {
                  modelId: schemaData._id.toString(),
                  platform: { $nin: platforms },
                },
              };
              // eslint-disable-next-line no-await-in-loop
              await (RouteDeleteUseCase(projectRouteRepo, applicationRepo))(routeDeleteFilter, true);
              const routeSchemaJson = {};
              _.map(platforms, (v) => {
                routeSchemaJson[v] = schemaDetailsData.schemaJson[v];
              });
              // create route based on permission
              // eslint-disable-next-line no-await-in-loop
              const allRouts = await getPermissionWiseRoute(routeSchemaJson, schemaData, definitionCode);
              const routeFilter = { find: { modelId: schemaData._id.toString() } };
              // eslint-disable-next-line no-await-in-loop
              const updatedRoutes = await projectRouteRepo.getDetails(routeFilter);
              const newRoutes = [];
              for (let route = 0; route < allRouts.length; route += 1) {
                const routeData = allRouts[route];
                const getRoute = _.find(updatedRoutes, {
                  modelId: routeData.modelId,
                  applicationId: routeData.applicationId,
                  route: routeData.route,
                  method: routeData.method,
                });
                if (!getRoute) {
                  newRoutes.push(routeData);
                }
              }
              if (newRoutes && newRoutes.length > 0) {
                // eslint-disable-next-line no-await-in-loop
                await (routeInsertManyUseCase(projectRouteRepo))({ routes: newRoutes });
              }
            }
          }
        }
      }
    }
    return OK;
  } catch (err) {
    // console.log('err: ', err);
    return SERVER_ERROR;
  }
}

/**
 * Function used to update `platform` in `applicationConfig`.
 * @param  {} {applicationId
 * @param  {} updatedApp
 * @param  {} }
 */
async function updatePlatformInApplicationConfig ({ updatedApp }) {
  try {
    if (updatedApp?.configInput?.platform) {
      const configFilter = { find: { applicationId: updatedApp._id } };
      const configData = await applicationConfigRepo.get(configFilter);
      if (configData) {
        const platforms = updatedApp.configInput.platform;

        const updateData = {};

        // Update `platforms` in `socialPlatform`.
        if (configData?.socialPlatform) {
          _.each(configData.socialPlatform, (social) => {
            if (social?.platform && social.platform.length) {
              social.platform = _.map(social?.platform, (v) => {
                if (_.includes(platforms, v)) {
                  return v;
                }
                return null;
              });
              social.platform = _.compact(social.platform);
            }
          });
          updateData.socialPlatform = _.cloneDeep(configData.socialPlatform);
        }

        // Update `platforms` in `fileUpload`.
        if (configData?.fileUpload?.uploads) {
          _.each(configData.fileUpload.uploads, (file) => {
            if (file?.platform && file.platform.length) {
              file.platform = _.map(file?.platform, (v) => {
                if (_.includes(platforms, v)) {
                  return v;
                }
                return null;
              });
              file.platform = _.compact(file.platform);
            }
          });
          updateData.fileUpload = _.cloneDeep(configData.fileUpload);
        }

        // Update `platforms` in `2FA`.
        if (configData?.twoFactorAuthentication) {
          if (configData?.twoFactorAuthentication?.platform && !_.isEmpty(configData.twoFactorAuthentication.platform)) {
            const twoFaAuthPlatforms = _.cloneDeep(configData.twoFactorAuthentication.platform);
            const platformObj = {};
            _.map(platforms, (v) => {
              if (twoFaAuthPlatforms[v]) {
                platformObj[v] = true;
              }
            });
            configData.twoFactorAuthentication.platform = platformObj;
            updateData.twoFactorAuthentication = _.cloneDeep(configData.twoFactorAuthentication);
          }
        }

        if (!_.isEmpty(updateData)) {
          await applicationConfigRepo.update(configData._id, updateData);
        }
      }
    }
    return OK;
  } catch (err) {
    // console.log('err: ', err);
    return SERVER_ERROR;
  }
}

/**
 *
 * Function used for update user.
 * @return json
 */
const update = (applicationRepo, schemaRepo) => async (id, params) => {
  try {
    // Validate Request
    params.selfUpdatedAt = dayjs().toISOString();
    delete params.applicationId;
    /*
     * const validationErrors = await validateData(params);
     * const errors = false
     */
    if (!id) {
      return INVALID_REQUEST_PARAMS;
    }
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidId) {
      return INVALID_REQUEST_PARAMS;
    }
    if (params.configInput) {
      const loginAccess = params?.configInput?.loginAccess;
      if (params.configInput.types && params.configInput.types.length > 0) {
        const keys = Object.keys(loginAccess);
        const values = Object.values(loginAccess);
        let flagVal;
        let flag;
        keys.forEach((k) => {
          flag = params.configInput.types.includes(k);
        });
        values.forEach((val) => {
          flagVal = _.difference(val, params.configInput.platform);
        });
        if (!flag || flagVal.length > 0) {
          return INVALID_REQUEST_PARAMS;
        }
      }
    }
    let cloneParams = _.cloneDeep(params);
    if (cloneParams.name) {
      let nameTemp = cloneParams.name;
      nameTemp = nameTemp.replace(/-/g, '');
      nameTemp = nameTemp.replace(/_/g, '');
      cloneParams.name = nameTemp;
      delete cloneParams.configInput;
      if (!(VALIDATION_RULES.APPLICATION.NAME.REGEX.test(nameTemp))) {
        return {
          data: null,
          code: MESSAGE.BAD_REQUEST.code,
          message: 'Start your application name with an alphanumeric with a minimum of 3 alphabets, and (_) are allowed after alphanumeric',
        };
      }

      const {
        value, error,
      } = applicationUpdateValidation(cloneParams);
      if (error) {
        return {
          data: null,
          code: MESSAGE.BAD_REQUEST.code,
          message: error,
        };
      }
      cloneParams = value;
    }

    // Validate Unique Criteria
    const applicationData = await getApplicationDetail(applicationRepo)({
      applicationId: id,
      isAllFields: true,
    });

    if (applicationData?.code !== MESSAGE.OK.code) {
      return applicationData;
    }

    const application = applicationData?.data;

    const {
      value, error,
    } = applicationUpdateValidation(params);
    if (error) {
      return {
        data: null,
        code: MESSAGE.BAD_REQUEST.code,
        message: error,
      };
    }
    params = value;

    const updateData = _.pick(params, applicationUpdateFields);

    if (params?.stepInput) {
      updateData.stepInput = {
        ...application?.stepInput,
        ...params?.stepInput,
      };
    }

    const updateResponse = await applicationRepo.update(id, updateData);

    const updatedApp = updateResponse.toObject();

    // Update schema-details and routes based on permissions.
    const updateSchemaDetails = await updateSchemaDetailsAndRoutes({
      schemaRepo,
      applicationRepo,
      updatedApp,
    });
    if (updateSchemaDetails.code !== OK.code) {
      return updateSchemaDetails;
    }

    // Update platform in `socialPlatform` & `fileUpload` in `applicationConfig`.
    const appConfig = await updatePlatformInApplicationConfig({ updatedApp });
    if (appConfig.code !== OK.code) {
      return appConfig;
    }

    projectApplicationUpdate({ params: { projectId: application?.projectId } });
    return {
      ...APPLICATION_UPDATED,
      data: _.pick(updateResponse, applicationUpdateFields),
    };
  } catch (err) {
    // console.log('err', err);
    return MESSAGE.SERVER_ERROR;
  }
};

module.exports = update;
