/* global MESSAGE,_ */
const {
  SERVER_ERROR, MODELS_UPDATED,
} = require('../../constants/message').message;

const { validateProperties } = require('./util');
const { existingSchemaUpdateValidation } = require('../util/validation/schema');

const {
  VALIDATION_MESSAGES, DEFAULT_FIELDS, DEFAULT_TABLE_NAME, DATA_TYPES,
} = require('../../constants/schema');
const {
  getDefaultFieldsForMongoDB, reOrderSchemaJson,
} = require('./util/staticData');
const { PROPS } = require('../../constants/dataTypes/props');
/**
 *
 * Function used for validate request.
 * @description ::  Find Documentation @ http://validatejs.org/
 * @return mixed :: If error occurred then return array of errors else return undefined | null
 */

/*
 * async function validateData(data) {
 *   const constraints = {
 */

/*
 *     applicationId: {
 *       presence: true,
 *       type: 'string',
 *     },
 *     models: {
 *       presence: true,
 *       type: 'array',
 *     },
 *   };
 */

//   const errors = validate(data, constraints);

/*
 *   if (errors) {
 *     return errors;
 *   }
 */

/*
 *   return null;
 * }
 */

const existsSchemaUpdate = (schemaRepo) => async (params) => {
  try {
    const {
      value, error,
    } = existingSchemaUpdateValidation(params);
    if (error) {
      return {
        data: null,
        code: MESSAGE.BAD_REQUEST.code,
        message: error,
      };
    }
    params = value;

    let modelErrors = [];
    const success = [];

    await Promise.all(params.models.map(async (model) => {
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
          const validateProps = await validateProperties([
            {
              modelName: model.modelName,
              schemaJson: model.schemaJson,
            },
          ]);

          if (validateProps && (validateProps.errors && _.size(validateProps.errors) > 0)) {
            modelErrors.push(validateProps.errors);
          }

          if (validateProps?.originJson && _.size(validateProps.originJson) > 0) {
            model.schemaJson = _.cloneDeep(validateProps.originJson[0].schemaJson);
          }
          Object.keys(model.schemaJson).forEach((key) => {
            if (model.schemaJson[key].type && model.schemaJson[key].description && model.schemaJson[key].type.toUpperCase() === 'JSON') {
              model.schemaJson[key] = _.cloneDeep(model.schemaJson[key].description);
            } else if (model.schemaJson[key].type && model.schemaJson[key].description && _.isArray(model.schemaJson[key].description) && model.schemaJson[key].type.toUpperCase() === 'ARRAY') {
              model.schemaJson[key] = [_.cloneDeep(model.schemaJson[key].description[0])];
            }
          });

          const lowerSchemaJsonKeys = Object.keys(model.schemaJson).map((key) => key.toLowerCase());
          const defaultFields = await getDefaultFieldsForMongoDB();

          Object.keys(defaultFields).forEach((field) => {
            if (!_.includes(lowerSchemaJsonKeys, field.toLowerCase())) {
              model.schemaJson[field] = defaultFields[field];
            }
          });

          _.map(Object.keys(model.schemaJson), (key) => {
            if ((key.toLowerCase() === DEFAULT_FIELDS.ADDED_BY || key.toLowerCase() === DEFAULT_FIELDS.UPDATED_BY)) {
              if (typeof model.schemaJson[key] === 'string' && model.schemaJson[key].toLowerCase() === DATA_TYPES.OBJECTID.value.toLowerCase()) {
                model.schemaJson[key] = { type: model.schemaJson[key] };
                model.schemaJson[key][PROPS.REF] = DEFAULT_TABLE_NAME;
              } else if (model?.schemaJson[key]?.type && model?.schemaJson[key]?.type.toLowerCase() === DATA_TYPES.OBJECTID.value.toLowerCase()) {
                if (!model.schemaJson[key][PROPS.REF]) {
                  model.schemaJson[key][PROPS.REF] = DEFAULT_TABLE_NAME;
                }
              }
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
    return { ...SERVER_ERROR };
    // return { ...SERVER_ERROR, data: err.toString() };
  }
};

module.exports = existsSchemaUpdate;
