/* global MESSAGE, _ */
const mongoose = require('mongoose');

const {
  ORM_TYPE, DATABASE_TYPE,
} = require('../../models/constants/applicationConfig');
const { ROUTE_GENERATE_TYPE } = require('../../models/constants/project');
const projectApplicationUpdate = require('../common/projectApplicationUpdate');

const { getApplicationDetail } = require('../util/getApplicationData');
const updateSchemaReferences = require('./util/updateSchemaReferences');

const validateSequelizeDataTypes = require('./util/sequelize/validateDataTypes');
const {
  mySqlDataTypes, sqlDataTypes, postGreSqlDataTypes,
} = require('../../constants/dataTypes/sequelize');
const SchemaDetailsRepository = require('../../repo/schemaDetail');
const ProjectRouteRepository = require('../../repo/projectRoute');

const schemaDetailsRepo = new SchemaDetailsRepository();
const projectRouteRepo = new ProjectRouteRepository();

const { reOrderSchemaJson } = require('./util/staticData');

const {
  INVALID_REQUEST_PARAMS, SCHEMA_NOT_FOUND, OK, SERVER_ERROR, MODEL_UPDATED, RECORD_WITH_SAME_NAME_EXISTS, INVALID_SCHEMA_ATTR,
} = require('../../constants/message').message;
const { schemaUpdateValidation } = require('../util/validation/schema');
const { updateSchemaRefAttribute } = require('./util');
const { validateRegEx } = require('./util');

/**
 *
 * Function used for update user.
 * @return json
 */
const update = (schemaRepo, applicationRepo) => async (id, params) => {
  try {
    const {
      value, error,
    } = schemaUpdateValidation(params);
    if (error) {
      return {
        data: null,
        code: MESSAGE.BAD_REQUEST.code,
        message: error,
      };
    }
    params = value;
    // Validate Unique Criteria
    const filter = { find: { _id: id } };
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidId) {
      return INVALID_REQUEST_PARAMS;
    }
    const schema = await schemaRepo.get({ filter });

    if (!schema) {
      return SCHEMA_NOT_FOUND;
    }

    // Check schema already exists.
    const schemaData = await schemaRepo.get({
      find: { applicationId: schema.applicationId },
      nin: [{ _id: id }],
      search: {
        keyword: params.name,
        keys: ['name'],
      },
    });
    if (schemaData && schemaData.name.toUpperCase() === params.name.toUpperCase()) {
      return RECORD_WITH_SAME_NAME_EXISTS;
    }

    const applicationData = await getApplicationDetail(applicationRepo)({
      applicationId: schema.applicationId,
      fields: ['stepInput.ormType', 'stepInput.databaseType', 'projectId'],
    });

    if (applicationData?.code !== MESSAGE.OK.code) {
      return applicationData;
    }
    const application = applicationData?.data;

    let dataTypeValidateErr = [];

    // Validate sequelize dataTypes.
    if (application?.stepInput?.ormType && application?.stepInput?.databaseType && _.includes([ORM_TYPE.SEQUELIZE, ORM_TYPE.ELOQUENT], application.stepInput.ormType) && params?.schemaJson) {
      const {
        databaseType, ormType,
      } = application.stepInput;
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

    if (params?.schemaJson && !_.isEmpty(params.schemaJson)) {
      params.schemaJson = await reOrderSchemaJson(_.cloneDeep(params.schemaJson));
    }
    const updateResponse = await schemaRepo.update(id, params);

    if (schema.name !== updateResponse.name) {
      // if schema name changed, then update all references.
      const updatedRes = await updateSchemaReferences({
        oldSchema: schema,
        updatedSchema: updateResponse,
      });
      if (updatedRes.code !== OK.code) {
        throw new Error(updatedRes.data);
      }
    }

    // Update `attributes` in `schema-details` and `project-routes`;
    if (params?.customJson?.dependencySetting) {
      const updatedSchemaJson = params.customJson.dependencySetting;

      // Update `additionalSetting.additionalJson.attributes` in `schema-details` collection.
      const schemaDetailsData = await schemaDetailsRepo.get({ find: { schemaId: updateResponse._id } });
      if (schemaDetailsData?.additionalJson?.additionalSetting) {
        _.each(schemaDetailsData.additionalJson.additionalSetting, (platform) => {
          _.each(platform, (p) => {
            if (p?.attributes.length > 0) {
              _.map(p?.attributes, (attr, index) => {
                const objKey = attr.split('.');
                let updatedKey = {};
                let isChild = false;
                let isParent = false;
                if (objKey[0] && objKey[1]) {
                  // Child key name changes.
                  updatedKey = _.find(updatedSchemaJson, {
                    oldKey: objKey[1],
                    parentKey: objKey[0],
                  });

                  // Parent key name changes.
                  if (!_.isEmpty(updatedKey)) {
                    isChild = true;
                  } else {
                    updatedKey = _.find(updatedSchemaJson, { oldKey: objKey[0] });
                    isParent = true;
                  }
                } else {
                  updatedKey = _.find(updatedSchemaJson, { oldKey: attr });
                }
                if (updatedKey?.isDelete) {
                  delete (p.attributes[index]);
                } else if (updatedKey?.parentKey && updatedKey.parentKey !== '' && updatedKey.newKey !== '' && isChild) {
                  delete (p.attributes[index]);
                  p.attributes.push(`${objKey[0]}.${updatedKey.newKey}`);
                } else if (updatedKey?.newKey && updatedKey.newKey !== '' && isParent) {
                  delete (p.attributes[index]);
                  p.attributes.push(`${updatedKey.newKey}.${objKey[1]}`);
                } else if (updatedKey?.newKey && updatedKey.newKey !== '') {
                  delete (p.attributes[index]);
                  p.attributes.push(updatedKey.newKey);
                }
              });
              p.attributes = _.compact(p.attributes);
            }
          });
        });
        await schemaDetailsRepo.update(schemaDetailsData._id, { 'additionalJson.additionalSetting': schemaDetailsData.additionalJson.additionalSetting });
      }

      // Update `attributes` in `project-routes`.
      const projectRouteData = await projectRouteRepo.getDetails({
        find: {
          modelId: updateResponse._id,
          applicationId: application._id,
          type: ROUTE_GENERATE_TYPE.MANUAL,
        },
      });
      if (projectRouteData && projectRouteData.length > 0) {
        for (let i = 0; i < projectRouteData.length; i += 1) {
          const route = projectRouteData[i];
          if (route?.attributes && route?.attributes.length > 0) {
            _.map(route.attributes, (attr, index) => {
              const objKey = attr.split('.');
              let updatedKey = {};
              let isChild = false;
              let isParent = false;
              if (objKey[0] && objKey[1]) {
                // Child key name changes.
                updatedKey = _.find(updatedSchemaJson, {
                  oldKey: objKey[1],
                  parentKey: objKey[0],
                });

                // Parent key name changes.
                if (!_.isEmpty(updatedKey)) {
                  isChild = true;
                } else {
                  updatedKey = _.find(updatedSchemaJson, { oldKey: objKey[0] });
                  isParent = true;
                }
              } else {
                updatedKey = _.find(updatedSchemaJson, { oldKey: attr });
              }
              if (updatedKey?.isDelete) {
                delete (route.attributes[index]);
              } else if (updatedKey?.parentKey && updatedKey.parentKey !== '' && updatedKey.newKey !== '' && isChild) {
                delete (route.attributes[index]);
                route.attributes.push(`${objKey[0]}.${updatedKey.newKey}`);
              } else if (updatedKey?.newKey && updatedKey.newKey !== '' && isParent) {
                delete (route.attributes[index]);
                route.attributes.push(`${updatedKey.newKey}.${objKey[1]}`);
              } else if (updatedKey?.newKey && updatedKey.newKey !== '') {
                delete (route.attributes[index]);
                route.attributes.push(updatedKey.newKey);
              }
            });
            route.attributes = _.compact(route.attributes);

            // eslint-disable-next-line no-await-in-loop
            await projectRouteRepo.update(route._id, { attributes: route.attributes });
          }
        }
      }
    }

    const schemaParams = {
      applicationId: schema.applicationId,
      oldName: schema.name,
      updatedName: params.name,
      updateSchema: updateResponse,
    };
    if (params?.customJson?.dependencySetting) {
      schemaParams.dependencySetting = params.customJson.dependencySetting;
    }
    // Update `ref` attribute of all models.
    const updateRefRes = await updateSchemaRefAttribute({
      schemaRepo,
      schemaParams,
    });
    if (updateRefRes?.code && updateRefRes.code !== OK.code) {
      throw new Error(updateRefRes.data);
    }
    const updatedSchema = await schemaRepo.get({ find: { _id: id } });

    projectApplicationUpdate({
      params: {
        projectId: application?.projectId,
        applicationId: schema?.applicationId,
      },
    });

    let responseMsg = OK;
    responseMsg = MODEL_UPDATED;

    return {
      ...responseMsg,
      data: updatedSchema,
    };
  } catch (err) {
    // console.log('error', err);
    return SERVER_ERROR;
  }
};

module.exports = update;
