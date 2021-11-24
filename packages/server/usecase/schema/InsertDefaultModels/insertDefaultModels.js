/* global MESSAGE,_ */
const { PROJECT_DEFINITION_CODE } = require('../../../models/constants/projectDefinition');
const {
  DATABASE_TYPE, ORM_TYPE,
} = require('../../../models/constants/applicationConfig');

const { validateProperties } = require('../util');
const { getApplicationDetail } = require('../../util/getApplicationData');
const { VALIDATION_MESSAGES } = require('../../../constants/schema');
const {
  mySqlDataTypes, sqlDataTypes, postGreSqlDataTypes,
} = require('../../../constants/dataTypes/sequelize');
const validateSequelizeDataTypes = require('../util/sequelize/validateDataTypes');

const SchemaDetailRepo = require('../../../repo/schemaDetail');
const ProjectRouteRepo = require('../../../repo/projectRoute');
const routeInsertManyUseCase = require('../../projectRoute/insertMany');
const getPermissionWiseRoute = require('../../util/getPermissionWiseRoute');
const {
  getDefaultFieldsForMongoDB, schemaJsonOptions, getAdditionalJsonWithoutAuthOptions, schemaJsonAuthPlatform,
  schemaJsonAuthOptions, getAdditionalJsonAuthOptions, getAdditionalJsonAuthPlatform, getDefaultFieldsForSequelize, reOrderSchemaJson,
} = require('../util/staticData');

const SchemaDetail = new SchemaDetailRepo();
const projectRouteRepo = new ProjectRouteRepo();

const {
  SERVER_ERROR, DEFAULT_MODELS_INSERTED,
} = require('../../../constants/message').message;
const { defaultInsertModels } = require('../../util/validation/defaultInsertModels');

/**
 * Function used to add default fields, if not exists.
 * @param  {} jsonSchemaData
 */
async function addDefaultFields (jsonSchemaData, ormType) {
  let defaultFields = {};

  if (ormType === ORM_TYPE.MONGOOSE) {
    defaultFields = await getDefaultFieldsForMongoDB();
  } else if (ormType && _.includes([ORM_TYPE.SEQUELIZE, ORM_TYPE.ELOQUENT], ormType)) {
    defaultFields = await getDefaultFieldsForSequelize({ ormType });
  }
  _.each(jsonSchemaData, (json) => {
    const lowerSchemaJsonKeys = Object.keys(json.schemaJson).map((key) => key.toLowerCase());
    Object.keys(defaultFields).forEach((field) => {
      if (!_.includes(lowerSchemaJsonKeys, field.toLowerCase())) {
        json.schemaJson[field] = defaultFields[field];
      }
    });
  });

  return jsonSchemaData;
}

/**
 * Function used for create new user.
 * @return json
 */
const useCase = (schemaRepo, applicationRepo) => async (params) => {
  try {
    const {
      value, error,
    } = defaultInsertModels(params);
    if (error) {
      return {
        data: null,
        code: MESSAGE.BAD_REQUEST.code,
        message: error,
      };
    }
    params = _.cloneDeep(value);

    // Validate application.
    const applicationData = await getApplicationDetail(applicationRepo)({
      applicationId: params.applicationId,
      fields: ['name', 'configInput', 'isArchive', 'definitionId', 'stepInput'],
    });

    if (applicationData?.code !== MESSAGE.OK.code) {
      return applicationData;
    }
    const applicationDetails = _.cloneDeep(applicationData?.data);

    let ormType = ORM_TYPE.MONGOOSE;
    let databaseType = DATABASE_TYPE.MONGODB;

    if (applicationDetails?.stepInput?.ormType) {
      ormType = applicationDetails.stepInput.ormType;
    }

    if (applicationDetails?.stepInput?.databaseType) {
      databaseType = applicationDetails.stepInput.databaseType;
    }

    // Read file and validate JSON format in file.
    const schemaErrors = [];
    let modelValidateErrors = [];

    let modelsData = _.cloneDeep(params.models);

    // Add default fields.
    modelsData = await addDefaultFields(modelsData, ormType);

    if (ormType === ORM_TYPE.MONGOOSE) {
      modelsData = modelsData.map((json) => {
        Object.keys(json.schemaJson).forEach((key) => {
          if (json.schemaJson[key].type && json.schemaJson[key].description && json.schemaJson[key].type.toUpperCase() === 'JSON') {
            json.schemaJson[key] = _.cloneDeep(json.schemaJson[key].description);
          } else if (json.schemaJson[key].type && json.schemaJson[key].description && _.isArray(json.schemaJson[key].description) && json.schemaJson[key].type.toUpperCase() === 'ARRAY') {
            json.schemaJson[key] = [_.cloneDeep(json.schemaJson[key].description[0])];
          }
        });
        return json;
      });

      const validateProps = await validateProperties(_.cloneDeep(modelsData));
      if (validateProps && (validateProps.errors && _.size(validateProps.errors) > 0)) {
        modelValidateErrors = _.cloneDeep(validateProps.errors);
      }

      if (validateProps?.originJson) {
        modelsData = _.cloneDeep(validateProps.originJson);
      }
    } else if (ormType && _.includes([ORM_TYPE.SEQUELIZE, ORM_TYPE.ELOQUENT], ormType)) {
      let validDataTypes = {};
      if (ormType === ORM_TYPE.SEQUELIZE && databaseType === DATABASE_TYPE.SQL) {
        validDataTypes = sqlDataTypes.DATA_TYPES;
      } else if (ormType === ORM_TYPE.SEQUELIZE && databaseType === DATABASE_TYPE.MYSQL) {
        validDataTypes = mySqlDataTypes.DATA_TYPES;
      } else if (ormType === ORM_TYPE.SEQUELIZE && databaseType === DATABASE_TYPE.POSTGRE_SQL) {
        validDataTypes = postGreSqlDataTypes.DATA_TYPES;
      }

      for (let i = 0; i < modelsData.length; i += 1) {
        const model = modelsData[i];

        let propErrors = [];
        // eslint-disable-next-line no-await-in-loop
        propErrors = await validateSequelizeDataTypes({
          model,
          dataTypes: validDataTypes,
        });
        modelValidateErrors = [...modelValidateErrors, ...propErrors.errors];
      }
    }

    modelValidateErrors = _.flattenDeep(modelValidateErrors);

    // Check model already exists.
    const modelNames = _.map(modelsData, 'modelName');
    const schemaExists = await schemaRepo.getDetails({
      find: { applicationId: params.applicationId },
      multipleSearch: {
        keywords: modelNames,
        keys: ['name'],
      },
    });

    let schemaList = await Promise.all(modelsData.map(async (schema) => {
      // Check schema already exists of same name.
      let checkSchemaExists = {};
      if (schemaExists && _.size(schemaExists) > 0) {
        checkSchemaExists = _.reject(_.map(schemaExists, (schemaVal) => {
          if (schemaVal.name.toUpperCase() === schema.modelName.toUpperCase()) {
            return schemaVal;
          }
          return {};
        }), _.isEmpty);

        if (!_.isEmpty(checkSchemaExists)) {
          schemaErrors.push({
            modelName: schema.modelName,
            isExists: true,
            schemaId: checkSchemaExists[0]._id,
            schemaJson: schema.schemaJson,
            error: [VALIDATION_MESSAGES.SCHEMA_ALREADY_EXISTS],
          });
        }
      }

      // Check model attribute(s) has errors.
      let modelAttrError = {};
      if (modelValidateErrors && modelValidateErrors.length > 0) {
        modelAttrError = _.find(modelValidateErrors, { modelName: schema.modelName });
      }

      let created = {};
      if (_.isEmpty(checkSchemaExists) && _.isEmpty(modelAttrError)) {
        const schemaData = {

          name: schema.modelName,
          applicationId: params.applicationId,
          description: schema.description,
          schemaJson: schema.schemaJson,
        };
        if (schema?.modelIndexes) {
          schemaData.modelIndexes = schema.modelIndexes;
        }
        if (schema?.hooks) {
          schemaData.hooks = schema.hooks;
        }

        if (schemaData?.schemaJson && !_.isEmpty(schemaData.schemaJson)) {
          schemaData.schemaJson = await reOrderSchemaJson(_.cloneDeep(schemaData.schemaJson));
        }
        created = await schemaRepo.create(schemaData);

        let schemaJson = {};
        const additionalSetting = {};
        // add schema detail according to accessible platform.
        if (applicationDetails?.configInput?.loginAccess && applicationDetails?.configInput?.platform) {
          const customPlatform = applicationDetails.configInput.platform;
          let uniqPlatform = [];
          _.each(applicationDetails.configInput.loginAccess, (v) => {
            uniqPlatform = uniqPlatform.concat(v);
          });
          uniqPlatform = _.uniq(uniqPlatform);
          if (customPlatform && _.size(customPlatform)) {
            _.each(customPlatform, (data) => {
              let schemaJsonOpt = [];
              let additionalSettingOpt = [];

              if (_.includes(uniqPlatform, data)) {
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

        if (schemaJson && !_.size(schemaJson)) {
          schemaJson = schemaJsonAuthPlatform();
        }

        let additionalJson = {};
        if (additionalSetting && !_.isEmpty(additionalSetting)) {
          additionalJson = { additionalSetting };
        } else if (!additionalSetting || _.isEmpty(additionalSetting)) {
          additionalJson = getAdditionalJsonAuthPlatform();
        }
        const detail = {
          schemaId: created._id,
          schemaJson,
          additionalJson,
        };

        const schemaDetails = await SchemaDetail.create(detail);
        const allRouts = getPermissionWiseRoute(schemaDetails.schemaJson, created, PROJECT_DEFINITION_CODE.NODE_EXPRESS);
        await (routeInsertManyUseCase(projectRouteRepo))({ routes: allRouts });
      }
      return created;
    }));
    schemaList = _.reject(schemaList, _.isEmpty);
    return {
      ...DEFAULT_MODELS_INSERTED,
      data: {
        error: modelValidateErrors,
        success: schemaList,
        existsModels: _.compact(_.flattenDeep(schemaErrors)),
      },
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    // console.log('error', err);
    return SERVER_ERROR;
  }
};

module.exports = useCase;
