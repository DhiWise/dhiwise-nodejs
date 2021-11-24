/* global MESSAGE,_ */
const mongoose = require('mongoose');
const fs = require('fs');
const formidable = require('formidable');

const { validateProperties } = require('./util');
const { getApplicationDetail } = require('../util/getApplicationData');
const { PROPS } = require('../../constants/dataTypes/props');
const {
  DEFAULT_FIELDS, DEFAULT_TABLE_NAME, DATA_TYPES,
} = require('../../constants/schema');
const SchemaDetailRepo = require('../../repo/schemaDetail');
const ProjectRouteRepo = require('../../repo/projectRoute');
const routeInsertManyUseCase = require('../projectRoute/insertMany');
const getPermissionWiseRoute = require('../util/getPermissionWiseRoute');
const {
  getDefaultFieldsForMongoDB, schemaJsonOptions, getAdditionalJsonWithoutAuthOptions, schemaJsonAuthPlatform,
  schemaJsonAuthOptions, getAdditionalJsonAuthOptions, getAdditionalJsonAuthPlatform, reOrderSchemaJson,
} = require('./util/staticData');

const SchemaDetail = new SchemaDetailRepo();
const projectRouteRepo = new ProjectRouteRepo();

const {
  INVALID_REQUEST_PARAMS, OK, SERVER_ERROR, MODEL_UPLOADED,
} = require('../../constants/message').message;
const { applicationIdValidation } = require('../util/validation/applicationId');
/**
 * Function used to get request body and fileData.
 * @param  {} req
 */
async function getBodyAndFileData (req) {
  const form = new formidable.IncomingForm();
  form.multiples = true;
  const getFilesData = await new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        const errObj = {
          code: SERVER_ERROR.code,
          message: SERVER_ERROR.message,
          data: err,
        };
        reject(errObj);
      } else if (_.isEmpty(files)) {
        const errObj = {
          code: INVALID_REQUEST_PARAMS.code,
          message: INVALID_REQUEST_PARAMS.message,
        };
        reject(errObj);
      } else {
        let fileArr = [];
        if (!Array.isArray(files.file)) {
          fileArr.push(files.file);
        } else {
          fileArr = files.file;
        }
        const succObj = {
          code: OK.code,
          message: OK.message,
          data: {
            fileData: fileArr,
            params: fields,
          },
        };
        resolve(succObj);
      }
    });
  });

  return getFilesData;
}

/**
 *
 * Function used to check `string` is valid `JSON` or not.
 * @param  {} str
 */
async function isJson (str) {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Function used to add default fields, if not exists.
 * @param  {} jsonSchemaData
 */
async function addDefaultFields (jsonSchemaData) {
  const defaultFields = await getDefaultFieldsForMongoDB();
  _.each(jsonSchemaData, (json) => {
    const lowerSchemaJsonKeys = Object.keys(json.schemaJson).map((key) => key.toLowerCase());
    Object.keys(defaultFields).forEach((field) => {
      if (!_.includes(lowerSchemaJsonKeys, field.toLowerCase())) {
        json.schemaJson[field] = defaultFields[field];
      }
    });
    _.map(Object.keys(json.schemaJson), (key) => {
      if ((key.toLowerCase() === DEFAULT_FIELDS.ADDED_BY || key.toLowerCase() === DEFAULT_FIELDS.UPDATED_BY)) {
        if (typeof json.schemaJson[key] === 'string' && json.schemaJson[key].toLowerCase() === DATA_TYPES.OBJECTID.value.toLowerCase()) {
          json.schemaJson[key] = { type: json.schemaJson[key] };
          json.schemaJson[key][PROPS.REF] = DEFAULT_TABLE_NAME;
        } else if (json?.schemaJson[key]?.type && json?.schemaJson[key]?.type.toLowerCase() === DATA_TYPES.OBJECTID.value.toLowerCase()) {
          if (!json.schemaJson[key][PROPS.REF]) {
            json.schemaJson[key][PROPS.REF] = DEFAULT_TABLE_NAME;
          }
        }
      }
    });
  });

  return jsonSchemaData;
}

/**
 * Function used for create new user.
 * @return json
 */
const useCase = (schemaRepo, applicationRepo) => async (req) => {
  try {
    // Get request body and file-data.
    const getBodyAndFilesData = await getBodyAndFileData(req);
    if (getBodyAndFilesData.code !== OK.code) {
      return getBodyAndFilesData;
    }
    let { params } = _.cloneDeep(getBodyAndFilesData.data);

    const { fileData } = _.cloneDeep(getBodyAndFilesData.data);

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
    params = value;
    if (params.applicationId) {
      const isValidId = mongoose.Types.ObjectId.isValid(params.applicationId);
      if (!isValidId) {
        return INVALID_REQUEST_PARAMS;
      }
    }
    // Validate application.
    const applicationData = await getApplicationDetail(applicationRepo)({
      applicationId: params.applicationId,
      fields: ['name', 'configInput', 'isArchive', 'definitionId'],
    });

    if (applicationData?.code !== MESSAGE.OK.code) {
      return applicationData;
    }
    const existingProject = applicationData?.data;

    // Read file and validate JSON format in file.
    let fileErrors = [];
    const jsonData = [];
    await Promise.all(fileData.map(async (val) => {
      const err = [];
      const rawData = fs.readFileSync(val.path);
      const checkJson = await isJson(rawData.toString());
      if (!checkJson) {
        fileErrors.push({
          modelName: `${val.name}`,
          isFileErr: true,
          error: ['Invalid JSON file.'],
        });
      } else {
        let jsonSchemaData = JSON.parse(rawData.toString());
        if (!_.isArray(jsonSchemaData)) {
          err.push({
            modelName: `${val.name}`,
            isFileErr: true,
            error: ['Invalid JSON file.'],
          });
        }

        if (_.isEmpty(jsonSchemaData)) {
          err.push({
            modelName: `${val.name}`,
            isFileErr: true,
            error: ['Empty JSON file.'],
          });
        }
        if (err && _.size(err) > 0) {
          fileErrors.push(err);
        } else {
          jsonSchemaData = await addDefaultFields(jsonSchemaData);

          // Validate JSON data property.
          const validateProps = await validateProperties(_.cloneDeep(jsonSchemaData));
          if (validateProps && (validateProps.errors && _.size(validateProps.errors) > 0)) {
            fileErrors.push(validateProps.errors);
          }

          if (validateProps?.originJson) {
            const originJson = _.cloneDeep(validateProps.originJson);
            jsonData.push(originJson);
          } else {
            jsonData.push(jsonSchemaData);
          }
          /*
           * if (validateProps && (validateProps.jsonSchema && _.size(validateProps.jsonSchema) > 0)) {
           * jsonData.push(validateProps.jsonSchema);
           * }
           */
        }
      }
      return true;
    }));

    // Return bad-request error, If empty JSON file.
    if (_.isEmpty(jsonData)) {
      fileErrors = _.cloneDeep(_.flattenDeep(_.uniq(fileErrors)));
      return {
        ...OK,
        data: {
          error: fileErrors,
          success: [],
        },
      };
    }

    // Prepare JSON data.
    let jsonDetails = [];
    _.each(jsonData, (val) => {
      _.each(val, (v) => {
        jsonDetails.push(v);
      });
    });
    jsonDetails = _.cloneDeep(_.compact(jsonDetails));

    const mJsonData = jsonDetails.map((json) => {
      if (json?.modelName) {
        json.modelName = json.modelName.replace(/ /g, '_');
      }
      Object.keys(json.schemaJson).forEach((key) => {
        if (json.schemaJson[key][PROPS.REF]) {
          json.schemaJson[key][PROPS.REF] = json.schemaJson[key][PROPS.REF].replace(/ /g, '_');
        }

        if (json.schemaJson[key].type && json.schemaJson[key].description && json.schemaJson[key].type.toUpperCase() === 'JSON') {
          json.schemaJson[key] = _.cloneDeep(json.schemaJson[key].description);
        } else if (json.schemaJson[key].type && json.schemaJson[key].description && _.isArray(json.schemaJson[key].description) && json.schemaJson[key].type.toUpperCase() === 'ARRAY') {
          json.schemaJson[key] = [_.cloneDeep(json.schemaJson[key].description[0])];
        }

        const schemaJson = json.schemaJson[key];
        if (_.isArray(schemaJson)) {
          const arrData = schemaJson[0];
          Object.keys(arrData).forEach((subKey) => {
            if (arrData[subKey][PROPS.REF]) {
              arrData[subKey][PROPS.REF] = arrData[subKey][PROPS.REF].replace(/ /g, '_');
            }
          });
        } else if (!_.isArray(schemaJson) && typeof schemaJson === 'object') {
          Object.keys(schemaJson).forEach((subKey) => {
            if (schemaJson[subKey][PROPS.REF]) {
              schemaJson[subKey][PROPS.REF] = schemaJson[subKey][PROPS.REF].replace(/ /g, '_');
            }
          });
        }
      });
      return json;
    });

    const schemas = mJsonData;
    let schemaErrors = [];

    // Check model already exists.
    const modelNames = _.map(schemas, 'modelName');
    const schemaExists = await schemaRepo.getDetails({
      find: { applicationId: params.applicationId },
      multipleSearch: {
        keywords: modelNames,
        keys: ['name'],
      },
    });

    let schemaList = await Promise.all(schemas.map(async (schema) => {
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
            error: ['Schema of same name already exists.'],
          });
        }
      }

      let created = [];
      if (_.isEmpty(checkSchemaExists)) {
        const schemaData = {

          name: schema.modelName,
          applicationId: params.applicationId,
          description: schema.description,
          schemaJson: schema.schemaJson,
        };

        if (schemaData?.schemaJson && !_.isEmpty(schemaData.schemaJson)) {
          schemaData.schemaJson = await reOrderSchemaJson(_.cloneDeep(schemaData.schemaJson));
        }
        created = await schemaRepo.create(schemaData);

        let schemaJson = {};
        const additionalSetting = {};
        // add schema detail according to accessible platform.
        if (existingProject?.configInput?.loginAccess && existingProject?.configInput?.platform) {
          const customPlatform = existingProject.configInput.platform;
          let uniqPlatform = [];
          _.each(existingProject.configInput.loginAccess, (v) => {
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
        const allRouts = getPermissionWiseRoute(schemaDetails.schemaJson, created);
        await (routeInsertManyUseCase(projectRouteRepo))({ routes: allRouts });
      }
      return created;
    }));
    schemaList = _.cloneDeep(_.compact(_.filter(schemaList, _.size)));
    fileErrors = _.compact(_.flattenDeep(fileErrors));
    schemaErrors = _.compact(_.flattenDeep(schemaErrors));

    let modelErrors = _.map(fileErrors, (val) => {
      const schemaEx = _.find(schemaErrors, { modelName: val.modelName });
      if (schemaEx) {
        return {};
      }
      return val;
    });

    modelErrors = _.cloneDeep(_.compact(_.reject(modelErrors, _.isEmpty)));

    const errData = _.compact(_.flattenDeep(modelErrors));
    return {
      ...MODEL_UPLOADED,
      data: {
        error: errData,
        success: schemaList,
        existsModels: _.compact(_.flattenDeep(schemaErrors)),
      },
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    // console.log('error', err);
    return { ...SERVER_ERROR };
    // return { ...SERVER_ERROR, data: err.toString() };
  }
};

module.exports = useCase;
