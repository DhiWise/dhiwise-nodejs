/* global MESSAGE, _ */
const {
  DATABASE_TYPE, ORM_TYPE,
} = require('../../../models/constants/applicationConfig');
const {
  SERVER_ERROR, MODELS_UPDATED, BAD_REQUEST,
} = require('../../../constants/message').message;

const {
  VALIDATION_MESSAGES, DEFAULT_FIELDS,
} = require('../../../constants/schema');

const { getApplicationDetail } = require('../../util/getApplicationData');
const validateSequelizeDataTypes = require('../util/sequelize/validateDataTypes');
const {
  mySqlDataTypes, sqlDataTypes, postGreSqlDataTypes,
} = require('../../../constants/dataTypes/sequelize');
const { sequelizeExistingSchemaUpdateValidation } = require('../../util/validation/schema');
const { PROPS } = require('../../../constants/dataTypes/props');

const {
  getDefaultFieldsForSequelize, reOrderSchemaJson,
} = require('../util/staticData');

const existsSchemaUpdate = (schemaRepo, applicationRepo) => async (params) => {
  try {
    const {
      value, error,
    } = sequelizeExistingSchemaUpdateValidation(params);
    if (error) {
      return {
        ...BAD_REQUEST,
        message: error,
      };
    }

    params = _.cloneDeep(value);

    // Validate application.
    const applicationData = await getApplicationDetail(applicationRepo)({
      applicationId: params.applicationId,
      fields: ['name', 'configInput', 'stepInput', 'isArchive', 'definitionId'],
    });

    if (applicationData?.code !== MESSAGE.OK.code) {
      return applicationData;
    }

    const applicationDetails = _.cloneDeep(applicationData.data);

    const dbType = applicationDetails.stepInput.databaseType;
    const { ormType } = applicationDetails.stepInput;

    let modelErrors = [];
    const success = [];

    await Promise.all(params.models.map(async (model) => {
      let propErrors = [];
      if (model.isUploadedFile === true) {
        const schemaFilter = {
          find: {
            applicationId: params.applicationId,
            _id: model.schemaId,
          },
        };
        const schema = await schemaRepo.get(schemaFilter);
        if (!schema) {
          modelErrors.push({
            modelName: model.modelName,
            error: VALIDATION_MESSAGES.MODEL_NOT_FOUND,
          });
        } else {
          if (ormType === ORM_TYPE.SEQUELIZE && dbType === DATABASE_TYPE.SQL) {
            // eslint-disable-next-line no-await-in-loop
            propErrors = await validateSequelizeDataTypes({
              model,
              dataTypes: sqlDataTypes.DATA_TYPES,
            });
          } else if (ormType === ORM_TYPE.SEQUELIZE && dbType === DATABASE_TYPE.MYSQL) {
            // eslint-disable-next-line no-await-in-loop
            propErrors = await validateSequelizeDataTypes({
              model,
              dataTypes: mySqlDataTypes.DATA_TYPES,
            });
          } else if (ormType === ORM_TYPE.SEQUELIZE && dbType === DATABASE_TYPE.POSTGRE_SQL) {
            // eslint-disable-next-line no-await-in-loop
            propErrors = await validateSequelizeDataTypes({
              model,
              dataTypes: postGreSqlDataTypes.DATA_TYPES,
            });
          }

          if (propErrors && (propErrors.errors && _.size(propErrors.errors) > 0)) {
            modelErrors.push(propErrors.errors);
          }

          if (propErrors?.model && _.size(propErrors.model) > 0) {
            model.schemaJson = _.cloneDeep(propErrors.model.schemaJson);
          }

          const defaultFields = await getDefaultFieldsForSequelize({ ormType: applicationDetails?.stepInput?.ormType });

          const lowerSchemaJsonKeys = Object.keys(model.schemaJson).map((key) => key.toLowerCase());
          Object.keys(defaultFields).forEach((field) => {
            if (!_.includes(lowerSchemaJsonKeys, field.toLowerCase())) {
              model.schemaJson[field] = defaultFields[field];
            }
          });

          _.map(Object.keys(model.schemaJson), (key) => {
            if (key.toLowerCase() === DEFAULT_FIELDS.ID) {
              model.schemaJson[key][PROPS.IS_AUTO_INCREMENT] = true;
              model.schemaJson[key][PROPS.PRIMARY] = true;
            }
          });

          const updateModelInput = { schemaJson: model.schemaJson };
          if (updateModelInput?.schemaJson && !_.isEmpty(updateModelInput.schemaJson)) {
            updateModelInput.schemaJson = await reOrderSchemaJson(_.cloneDeep(updateModelInput.schemaJson));
          }
          const schemaUpdate = await schemaRepo.update(model.schemaId, updateModelInput);
          if (schemaUpdate) {
            success.push(schemaUpdate.toObject());
          } else {
            modelErrors.push({
              modelName: model.modelName,
              error: VALIDATION_MESSAGES.UPDATE_MODEL_ERROR,
            });
          }
        }
      }
    }));

    modelErrors = _.cloneDeep(_.flattenDeep(_.uniq(modelErrors)));

    return {
      ...MODELS_UPDATED,
      data: {
        error: modelErrors,
        success,
      },
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    // console.log('error', err);
    return SERVER_ERROR;
  }
};

module.exports = existsSchemaUpdate;
