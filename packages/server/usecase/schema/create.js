/* global MESSAGE,_ */
const mongoose = require('mongoose');

const {
  ORM_TYPE, DATABASE_TYPE,
} = require('../../models/constants/applicationConfig');
const { PROJECT_DEFINITION_CODE } = require('../../models/constants/projectDefinition');
const projectApplicationUpdate = require('../common/projectApplicationUpdate');
const { getApplicationDetail } = require('../util/getApplicationData');

const SchemaDetailRepo = require('../../repo/schemaDetail');
const ProjectRouteRepo = require('../../repo/projectRoute');
const routeInsertManyUseCase = require('../projectRoute/insertMany');
const getPermissionWiseRoute = require('../util/getPermissionWiseRoute');

const validateSequelizeDataTypes = require('./util/sequelize/validateDataTypes');
const {
  mySqlDataTypes, sqlDataTypes, postGreSqlDataTypes,
} = require('../../constants/dataTypes/sequelize');
const {
  schemaJsonAuthOptions, getAdditionalJsonAuthOptions,
  schemaJsonOptions, getAdditionalJsonWithoutAuthOptions, schemaJsonAuthPlatform, schemaJsonWithoutAuthPlatform, getAdditionalJsonAuthPlatform,
} = require('./util/staticData');

const SchemaDetail = new SchemaDetailRepo();
const projectRouteRepo = new ProjectRouteRepo();

const {
  FAILED_TO_CREATE, OK, SERVER_ERROR, INVALID_REQUEST_PARAMS, RECORD_WITH_SAME_NAME_EXISTS, INVALID_SCHEMA_ATTR, MODEL_CREATED,
} = require('../../constants/message').message;
const { schemaCreateValidation } = require('../util/validation/schema');
const { validateRegEx } = require('./util');

/**
 * Function used for create new user.
 * @return json
 */
const useCase = (schemaRepo, applicationRepo) => async (params) => {
  try {
    // Validate Request
    const {
      value, error,
    } = schemaCreateValidation(params);
    if (error) {
      return {
        data: null,
        code: MESSAGE.BAD_REQUEST.code,
        message: error,
      };
    }
    params = value;
    const isValidId = mongoose.Types.ObjectId.isValid(params.applicationId);
    if (!isValidId) {
      return INVALID_REQUEST_PARAMS;
    }
    const applicationData = await getApplicationDetail(applicationRepo)({
      applicationId: params.applicationId,
      fields: ['configInput', 'definitionId', 'stepInput', 'projectId'],
    });

    if (applicationData?.code !== MESSAGE.OK.code) {
      return applicationData;
    }

    const existingProject = applicationData?.data;
    // Check schema already exists.
    const schemaData = await schemaRepo.get({
      find: { applicationId: params.applicationId },
      search: {
        keyword: params.name,
        keys: ['name'],
      },
    });
    if (schemaData && schemaData.name.toUpperCase() === params.name.toUpperCase()) {
      return RECORD_WITH_SAME_NAME_EXISTS;
    }

    let dataTypeValidateErr = [];

    // Validate sequelize dataTypes.
    if (existingProject?.stepInput?.ormType && existingProject?.stepInput?.databaseType
      && _.includes([ORM_TYPE.SEQUELIZE, ORM_TYPE.ELOQUENT], existingProject.stepInput.ormType) && params?.schemaJson) {
      const {
        databaseType, ormType,
      } = existingProject.stepInput;
      if (ormType === ORM_TYPE.SEQUELIZE && databaseType === DATABASE_TYPE.SQL) {
        dataTypeValidateErr = await validateSequelizeDataTypes({
          model: params,
          dataTypes: sqlDataTypes.DATA_TYPES,
        });
      } else if (ormType === ORM_TYPE.SEQUELIZE && databaseType === DATABASE_TYPE.MYSQL) {
        dataTypeValidateErr = await validateSequelizeDataTypes({
          model: params,
          dataTypes: mySqlDataTypes.DATA_TYPES,
        });
      } else if (ormType === ORM_TYPE.SEQUELIZE && databaseType === DATABASE_TYPE.POSTGRE_SQL) {
        dataTypeValidateErr = await validateSequelizeDataTypes({
          model: params,
          dataTypes: postGreSqlDataTypes.DATA_TYPES,
        });
      }
    } else {
      // Validate `RegExp` pattern.
      // eslint-disable-next-line no-lonely-if
      if (params?.schemaJson) {
        const validateRegExp = await validateRegEx(params.schemaJson);
        if (validateRegExp.code !== OK.code) {
          return validateRegExp;
        }
      }
    }
    if (dataTypeValidateErr.errors && dataTypeValidateErr.errors.length) {
      return {
        ...INVALID_SCHEMA_ATTR,
        data: dataTypeValidateErr.errors,
      };
    }
    if (params?.schemaJson && dataTypeValidateErr?.model?.schemaJson) {
      params.schemaJson = _.cloneDeep(dataTypeValidateErr.model.schemaJson);
    }

    const created = await schemaRepo.create(params);

    if (!created) {
      return FAILED_TO_CREATE;
    }

    let schemaJson = {};
    const additionalSetting = {};
    // add schema detail according to accessible platform
    if (existingProject?.configInput?.loginAccess && existingProject?.configInput?.platform) {
      let uniqPlatform = [];
      _.each(existingProject.configInput.loginAccess, (v) => {
        uniqPlatform = uniqPlatform.concat(v);
      });
      uniqPlatform = _.uniq(uniqPlatform);
      const customPlatform = existingProject.configInput.platform;
      if (customPlatform && _.size(customPlatform)) {
        _.each(customPlatform, (data) => {
          let schemaJsonOpt = [];
          let additionalSettingOpt = [];
          if (_.includes(uniqPlatform, data) && (existingProject?.stepInput?.ormType && existingProject?.stepInput?.ormType !== ORM_TYPE.ELOQUENT)) {
            schemaJsonOpt = schemaJsonAuthOptions();
            additionalSettingOpt = getAdditionalJsonAuthOptions();
          } else {
            schemaJsonOpt = schemaJsonOptions();
            additionalSettingOpt = getAdditionalJsonWithoutAuthOptions();
          }
          schemaJson[data] = schemaJsonOpt;
          additionalSetting[data] = additionalSettingOpt;
        });
      }
    }

    // If modelConfig key found in `params`
    if (existingProject?.configInput?.platform && (!_.isEmpty(params.jsonInputModelConfig) || !_.isEmpty(params.jsonInputNewModelConfig))) {
      const customPlatform = existingProject.configInput.platform;

      /*
       * let uniqPlatform = [];
       * _.each(existingProject.configInput.loginAccess, (v) => {
       * uniqPlatform = uniqPlatform.concat(v);
       * });
       * uniqPlatform = _.uniq(uniqPlatform);
       */
      if (customPlatform && _.size(customPlatform)) {
        _.each(customPlatform, (data) => {
          if (params.jsonInputModelConfig[data]) {
            schemaJson[data] = params.jsonInputModelConfig[data];
          } else {
            schemaJson[data] = schemaJsonOptions();
          }

          if (params.jsonInputNewModelConfig[data]) {
            additionalSetting[data] = params.jsonInputNewModelConfig[data];
          } else {
            additionalSetting[data] = getAdditionalJsonWithoutAuthOptions();
          }
        });
      }
    }

    if (schemaJson && !_.size(schemaJson)) {
      if ((existingProject?.stepInput?.ormType && existingProject?.stepInput?.ormType !== ORM_TYPE.ELOQUENT)) {
        schemaJson = schemaJsonAuthPlatform();
      } else {
        schemaJson = schemaJsonWithoutAuthPlatform();
      }
    }

    let additionalJson = {};
    if (additionalSetting && !_.isEmpty(additionalSetting)) {
      additionalJson = { additionalSetting };
    } else if (!additionalSetting || _.isEmpty(additionalSetting)) {
      if ((existingProject?.stepInput?.ormType && existingProject?.stepInput?.ormType !== ORM_TYPE.ELOQUENT)) {
        additionalJson = await getAdditionalJsonAuthPlatform();
      } else {
        additionalJson = await getAdditionalJsonWithoutAuthOptions();
      }
    }

    const detail = {
      schemaId: created._id,
      schemaJson,
      additionalJson,
    };

    const schemaDetails = await SchemaDetail.create(detail);

    const allRouts = getPermissionWiseRoute(schemaDetails.schemaJson, created, PROJECT_DEFINITION_CODE.NODE_EXPRESS);
    await (routeInsertManyUseCase(projectRouteRepo))({ routes: allRouts });

    projectApplicationUpdate({
      params: {
        projectId: existingProject?.projectId,
        applicationId: params.applicationId,
      },
    });

    let responseMsg = OK;
    responseMsg = MODEL_CREATED;

    return {
      ...responseMsg,
      data: created,
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    // console.log('error', err);
    return { ...SERVER_ERROR };
    // return { ...SERVER_ERROR, data: err.toString() };
  }
};

module.exports = useCase;
