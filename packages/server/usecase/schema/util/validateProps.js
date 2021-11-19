/* global _ */
const {
  DATA_TYPES, DATA_TYPES_DEFAULT_PROPS, MONGOOSE_TYPES,
} = require('../../../constants/schema');

const { VALIDATION_MESSAGES } = require('../../../constants/schema');
const isRegExp = require('./isRegExp');

/**
 * Function used to make proper `schemaJson` `object`.
 * @param  {} jsonSchemaObj
 */
async function objSetAttribute (jsonSchemaObj, isJsonObj = false) {
  const keys = _.keys(jsonSchemaObj);

  /**
   * ------------------------------------------
   * Convert minlength & maxlength properties AND convert mongoDB types to ObjectId.
   * ------------------------------------------
   */
  Object.keys(jsonSchemaObj).forEach((val) => {
    if (jsonSchemaObj[val].minlength) {
      jsonSchemaObj[val].minLength = _.cloneDeep(jsonSchemaObj[val].minlength);
      delete jsonSchemaObj[val].minlength;
    }
    if (jsonSchemaObj[val].maxlength) {
      jsonSchemaObj[val].maxLength = _.cloneDeep(jsonSchemaObj[val].maxlength);
      delete jsonSchemaObj[val].maxlength;
    }
    if (typeof jsonSchemaObj[val] === 'string'
        && (_.includes(MONGOOSE_TYPES, jsonSchemaObj[val].toLowerCase()))) {
      jsonSchemaObj[val] = DATA_TYPES.OBJECTID.value;
    }

    if (typeof jsonSchemaObj[val] === 'object' && jsonSchemaObj[val].type
    && (_.includes(MONGOOSE_TYPES, jsonSchemaObj[val].type.toLowerCase()))) {
      jsonSchemaObj[val].type = DATA_TYPES.OBJECTID.value;
    }
  });
  // ------------------------------------------

  const keyCnt = _.size(jsonSchemaObj);
  if (!isJsonObj && keyCnt === 1 && jsonSchemaObj.type && DATA_TYPES[jsonSchemaObj.type.toUpperCase()]
  && DATA_TYPES[jsonSchemaObj.type.toUpperCase()].value.toUpperCase() === jsonSchemaObj.type.toUpperCase()) {
    return jsonSchemaObj;
  }

  const jsonSchemaObjCpy = _.cloneDeep(jsonSchemaObj);
  for (let j = 0; j < keys.length; j += 1) {
    const key = keys[j];
    if (typeof jsonSchemaObjCpy[key] === 'string' && DATA_TYPES[jsonSchemaObjCpy[key].toUpperCase()]?.value) {
      jsonSchemaObjCpy[key] = { type: DATA_TYPES[jsonSchemaObjCpy[key].toUpperCase()].value };
    } else if (typeof jsonSchemaObjCpy[key] === 'string') {
      jsonSchemaObjCpy[key] = { type: jsonSchemaObjCpy[key] };
    }
  }

  let isObj = true;
  _.each(jsonSchemaObjCpy, (val) => {
    if (typeof val !== 'object') {
      isObj = false;
    }
  });

  let jsonResponse = {};
  if (!isObj) {
    jsonResponse = _.cloneDeep(jsonSchemaObj);
  } else {
    jsonResponse = _.cloneDeep(jsonSchemaObjCpy);
  }

  return jsonResponse;
}

/**
 * Function used make proper `schemaJson`.
 * @param  {} jsonData
 */
async function setAttribute (jsonData) {
  for (let k = 0; k < jsonData.length; k += 1) {
    const jsonSchemaObj = jsonData[k].schemaJson;

    const keys = _.keys(jsonSchemaObj);
    for (let i = 0; i < keys.length; i += 1) {
      const objKey = keys[i];

      /**
       * ------------------------------------------
       * Convert minlength & maxlength properties.
       * ------------------------------------------
       */
      if (jsonSchemaObj[objKey].minlength) {
        jsonSchemaObj[objKey].minLength = _.cloneDeep(jsonSchemaObj[objKey].minlength);
        delete jsonSchemaObj[objKey].minlength;
      }
      if (jsonSchemaObj[objKey].maxlength) {
        jsonSchemaObj[objKey].maxLength = _.cloneDeep(jsonSchemaObj[objKey].maxlength);
        delete jsonSchemaObj[objKey].maxlength;
      }
      // ------------------------------------------

      /**
       * ------------------------------------------
       * Convert mongoDB types to `ObjectId`.
       * ------------------------------------------
       */
      if (typeof jsonSchemaObj[objKey] === 'string'
          && (_.includes(MONGOOSE_TYPES, jsonSchemaObj[objKey].toLowerCase()))) {
        jsonSchemaObj[objKey] = DATA_TYPES.OBJECTID.value;
      }

      if (typeof jsonSchemaObj[objKey] === 'object' && jsonSchemaObj[objKey].type && typeof jsonSchemaObj[objKey].type === 'string') {
        if (_.includes(MONGOOSE_TYPES, jsonSchemaObj[objKey].type.toLowerCase())) {
          jsonSchemaObj[objKey].type = DATA_TYPES.OBJECTID.value;
        }
      }
      // ------------------------------------------

      if (typeof jsonSchemaObj[objKey] === 'string') {
        if (DATA_TYPES[jsonSchemaObj[objKey].toUpperCase()] && DATA_TYPES[jsonSchemaObj[objKey].toUpperCase()].value) {
          jsonSchemaObj[objKey] = { type: DATA_TYPES[jsonSchemaObj[objKey].toUpperCase()].value };
        } else {
          jsonSchemaObj[objKey] = { type: jsonSchemaObj[objKey] };
        }
      } else if (
        (typeof jsonSchemaObj[objKey] === 'object' && !_.isArray(jsonSchemaObj[objKey]) && !jsonSchemaObj[objKey].type)
        || (jsonSchemaObj[objKey]?.type
        && (typeof jsonSchemaObj[objKey].type === 'string' && jsonSchemaObj[objKey].type.toUpperCase() === 'JSON' && !_.isArray(jsonSchemaObj[objKey].description)))) {
        if (jsonSchemaObj[objKey].description) {
        // eslint-disable-next-line no-await-in-loop
          jsonSchemaObj[objKey].description = await objSetAttribute(jsonSchemaObj[objKey].description, true);
        } else {
        // eslint-disable-next-line no-await-in-loop
          jsonSchemaObj[objKey] = await objSetAttribute(jsonSchemaObj[objKey]);
        }
      } else if (
        (_.isArray(jsonSchemaObj[objKey]))
      || (jsonSchemaObj[objKey]?.type && (typeof jsonSchemaObj[objKey].type === 'string'
      && jsonSchemaObj[objKey].type.toUpperCase() === 'ARRAY' && jsonSchemaObj[objKey].description && jsonSchemaObj[objKey].description.length > 0))) {
        if (jsonSchemaObj[objKey].description && jsonSchemaObj[objKey].description.length > 0) {
        // eslint-disable-next-line no-await-in-loop
          const arrayObj = await objSetAttribute(jsonSchemaObj[objKey].description[0], true);
          jsonSchemaObj[objKey].description = [arrayObj];
        } else {
        // eslint-disable-next-line no-await-in-loop
          const arrayObj = await objSetAttribute(jsonSchemaObj[objKey][0], true);
          jsonSchemaObj[objKey] = [arrayObj];
        }
      }
    }
    jsonData[k].schemaJson = jsonSchemaObj;
  }
  return jsonData;
}

/**
 * Function used to validate schema properties.
 * @param  {} jsonDetails
 */
const validateProps = async (jsonDetails) => {
  const allFieldTypes = DATA_TYPES;
  const defaultProps = DATA_TYPES_DEFAULT_PROPS;
  const attErrors = [];
  // Validate property
  jsonDetails = await setAttribute(jsonDetails);
  _.each(jsonDetails, async (json) => {
    Object.keys(json.schemaJson).forEach(async (key) => {
      if (json.schemaJson && json.schemaJson[key] && typeof json.schemaJson[key].type === 'string' && json.schemaJson[key].type
      && !_.includes(['JSON', 'ARRAY'], json.schemaJson[key].type.toUpperCase())) {
        const typeKey = json.schemaJson[key].type.toUpperCase();
        const allowProps = allFieldTypes[typeKey];

        if (typeKey === 'JSON' && typeKey === 'ARRAY') {
          json.schemaJson[key].type = _.cloneDeep(allowProps.value);
        } else if (allowProps && allowProps.attributes) {
          const aProps = _.compact(_.uniq([...defaultProps, ...allowProps.attributes]));

          let appliedProps = Object.keys(json.schemaJson[key]);
          appliedProps = _.cloneDeep(_.compact(_.remove(appliedProps, (v) => {
            if (v === 'type') {
              return '';
            }
            return v;
          })));

          const keyErr = [];
          if (!_.isEmpty(appliedProps)) {
            _.each(appliedProps, (prop) => {
              if (!_.includes(aProps, prop)) {
                keyErr.push(`Property not allowed - ${prop}.`);
              }
            });
          }

          // Validate RegExp.
          if (json?.schemaJson[key]?.match) {
            const match = isRegExp(json.schemaJson[key].match);
            if (!match) {
              keyErr.push(`${key} - Invalid regular expression - ${json.schemaJson[key].match}`);
            }
          }

          json.schemaJson[key].type = _.cloneDeep(allowProps.value);
          /**
           * -----------------------------------------------
           * Check properties of virtual-relation.
           * -----------------------------------------------
           */
          if (typeKey === 'VIRTUAL_RELATION') {
            if (!_.includes(appliedProps, 'ref')) {
              keyErr.push(VALIDATION_MESSAGES.MISSING_REF_PROPS);
            }
            if (!_.includes(appliedProps, 'localField')) {
              keyErr.push(VALIDATION_MESSAGES.MISSING_LOCAL_FIELD_PROPS);
            }
            if (!_.includes(appliedProps, 'foreignField')) {
              keyErr.push(VALIDATION_MESSAGES.MISSING_FOREIGN_FIELD_PROPS);
            }
          }
          //-----------------------------------------------

          /**
           * -----------------------------------------------
           * Validate Min-Max property.
           * -----------------------------------------------
           */
          if (_.includes(appliedProps, 'min') && _.includes(appliedProps, 'max')) {
            if (json.schemaJson[key].min > json.schemaJson[key].max) {
              keyErr.push(VALIDATION_MESSAGES.MAX_MUST_GREATER_TO_MIN);
            }
          }

          if (_.includes(appliedProps, 'min') && _.includes(appliedProps, 'default')) {
            if (json.schemaJson[key].default < json.schemaJson[key].min) {
              keyErr.push(VALIDATION_MESSAGES.DEFAULT_MUST_GREATER_OR_EQUAL_TO_MIN);
            }
          }

          if (_.includes(appliedProps, 'max') && _.includes(appliedProps, 'default')) {
            if (json.schemaJson[key].default > json.schemaJson[key].max) {
              keyErr.push(VALIDATION_MESSAGES.DEFAULT_MUST_LOWER_OR_EQUAL_TO_MAX);
            }
          }
          //-----------------------------------------------

          /**
           * -----------------------------------------------
           * Validate minLength-maxLength property.
           * -----------------------------------------------
           */
          if (_.includes(appliedProps, 'minLength') && _.includes(appliedProps, 'maxLength')) {
            if (json.schemaJson[key].minLength > json.schemaJson[key].maxLength) {
              keyErr.push(VALIDATION_MESSAGES.MAX_LENGTH_MUST_GREATER_TO_MIN_LENGTH);
            }
          }

          if (_.includes(appliedProps, 'minLength') && _.includes(appliedProps, 'default')) {
            if (json.schemaJson[key].default < json.schemaJson[key].minLength) {
              keyErr.push(VALIDATION_MESSAGES.DEFAULT_LENGTH_MUST_GREATER_OR_EQUAL_TO_MIN_LENGTH);
            }
          }

          if (_.includes(appliedProps, 'maxLength') && _.includes(appliedProps, 'default')) {
            if (json.schemaJson[key].default > json.schemaJson[key].maxLength) {
              keyErr.push(VALIDATION_MESSAGES.DEFAULT_LENGTH_MUST_LOWER_OR_EQUAL_TO_MAX_LENGTH);
            }
          }
          //-----------------------------------------------

          // Do not allow `NULL` value in `default` prop, when field contain `required` property.
          if (json.schemaJson[key].required && (json.schemaJson[key].default === null || json.schemaJson[key].default === 'NULL' || json.schemaJson[key].default === 'null')) {
            keyErr.push(`${VALIDATION_MESSAGES.INVALID_DEFAULT_PROP_VALUE}`);
          }

          if (keyErr && _.size(keyErr) > 0) {
            attErrors.push({
              modelName: json.modelName,
              attribute: key,
              error: keyErr,
            });
          }
        } else {
          attErrors.push({
            modelName: json.modelName,
            attribute: key,
            error: [VALIDATION_MESSAGES.INVALID_TYPE_PROP],
          });
        }
      } else if (_.isObject(json.schemaJson[key]) || _.isArray(json.schemaJson[key])) {
        // Check validation for `JSON` Object.
        if ((!json.schemaJson[key].type && _.isObject(json.schemaJson[key]) && !_.isArray(json.schemaJson[key]))
          || (json.schemaJson[key].type
            && ((typeof json.schemaJson[key].type === 'string' && json.schemaJson[key].type.toUpperCase() === 'JSON'
            && json.schemaJson[key].description && !_.isArray(json.schemaJson[key].description))
              || (typeof json.schemaJson[key].type === 'object')))) {
          let jsonObj = json.schemaJson[key];
          if (json.schemaJson[key].description && json.schemaJson[key].type && typeof json.schemaJson[key].type === 'string' && json.schemaJson[key].type.toUpperCase() === 'JSON') {
            jsonObj = json.schemaJson[key].description;
          }

          Object.keys(jsonObj).forEach((key1) => {
            const nestedJsonKey = jsonObj[key1];
            if (!nestedJsonKey.type) {
              attErrors.push({
                modelName: json.modelName,
                attribute: `${key}.${key1}`,
                error: [VALIDATION_MESSAGES.MISSING_TYPE_PROP],
              });
            } else {
              const typeKey = nestedJsonKey.type.toUpperCase();
              const allowProps = allFieldTypes[typeKey];
              if (allowProps && allowProps.attributes) {
                const aProps = _.compact(_.uniq([...defaultProps, ...allowProps.attributes]));
                let appliedProps = Object.keys(jsonObj[key1]);
                appliedProps = _.cloneDeep(_.compact(_.remove(appliedProps, (v) => {
                  if (v === 'type' || v === 'description') {
                    return '';
                  }
                  return v;
                })));

                const keyErr = [];
                if (!_.isEmpty(appliedProps)) {
                  _.each(appliedProps, (prop) => {
                    if (!_.includes(aProps, prop)) {
                      keyErr.push(`Property not allowed - ${prop}.`);
                    }
                  });
                }

                // Validate RegExp
                if (jsonObj[key1]?.match) {
                  const match = isRegExp(jsonObj[key1].match);
                  if (!match) {
                    keyErr.push(`${key}.${key1} - Invalid regular expression - ${jsonObj[key1].match}`);
                  }
                }

                jsonObj[key1].type = _.cloneDeep(allowProps.value);
                json.schemaJson[key] = _.cloneDeep(jsonObj);

                /**
                 * -----------------------------------------------
                 * Check properties of virtual-relation.
                 * -----------------------------------------------
                 */
                if (typeKey === 'VIRTUAL_RELATION') {
                  if (!_.includes(appliedProps, 'ref')) {
                    keyErr.push(VALIDATION_MESSAGES.MISSING_REF_PROPS);
                  }
                  if (!_.includes(appliedProps, 'localField')) {
                    keyErr.push(VALIDATION_MESSAGES.MISSING_LOCAL_FIELD_PROPS);
                  }
                  if (!_.includes(appliedProps, 'foreignField')) {
                    keyErr.push(VALIDATION_MESSAGES.MISSING_FOREIGN_FIELD_PROPS);
                  }
                }
                //-----------------------------------------------

                /**
                 * -----------------------------------------------
                 * Validate Min-Max property.
                 * -----------------------------------------------
                 */
                if (_.includes(appliedProps, 'min') && _.includes(appliedProps, 'max')) {
                  if (jsonObj[key1].min > jsonObj[key1].max) {
                    keyErr.push(VALIDATION_MESSAGES.MAX_MUST_GREATER_TO_MIN);
                  }
                }

                if (_.includes(appliedProps, 'min') && _.includes(appliedProps, 'default')) {
                  if (jsonObj[key1].default < jsonObj[key1].min) {
                    keyErr.push(VALIDATION_MESSAGES.DEFAULT_MUST_GREATER_OR_EQUAL_TO_MIN);
                  }
                }

                if (_.includes(appliedProps, 'max') && _.includes(appliedProps, 'default')) {
                  if (jsonObj[key1].default > jsonObj[key1].max) {
                    keyErr.push(VALIDATION_MESSAGES.DEFAULT_MUST_LOWER_OR_EQUAL_TO_MAX);
                  }
                }
                //-----------------------------------------------

                /**
                 * -----------------------------------------------
                 * Validate minLength-maxLength property.
                 * -----------------------------------------------
                 */
                if (_.includes(appliedProps, 'minLength') && _.includes(appliedProps, 'maxLength')) {
                  if (jsonObj[key1].minLength > jsonObj[key1].maxLength) {
                    keyErr.push(VALIDATION_MESSAGES.MAX_LENGTH_MUST_GREATER_TO_MIN_LENGTH);
                  }
                }

                if (_.includes(appliedProps, 'minLength') && _.includes(appliedProps, 'default')) {
                  if (jsonObj[key1].default < jsonObj[key1].minLength) {
                    keyErr.push(VALIDATION_MESSAGES.DEFAULT_LENGTH_MUST_GREATER_OR_EQUAL_TO_MIN_LENGTH);
                  }
                }

                if (_.includes(appliedProps, 'maxLength') && _.includes(appliedProps, 'default')) {
                  if (jsonObj[key1].default > jsonObj[key1].maxLength) {
                    keyErr.push(VALIDATION_MESSAGES.DEFAULT_LENGTH_MUST_LOWER_OR_EQUAL_TO_MAX_LENGTH);
                  }
                }
                //-----------------------------------------------

                // Do not allow `NULL` value in `default` prop, when field contain `required` property.
                if (jsonObj[key1].required && (jsonObj[key1].default === null || jsonObj[key1].default === 'NULL' || jsonObj[key1].default === 'null')) {
                  keyErr.push(`${VALIDATION_MESSAGES.INVALID_DEFAULT_PROP_VALUE}`);
                }

                if (keyErr && _.size(keyErr) > 0) {
                  attErrors.push({
                    modelName: json.modelName,
                    attribute: `${key}.${key1}`,
                    error: keyErr,
                  });
                }
              } else {
                attErrors.push({
                  modelName: json.modelName,
                  attribute: `${key}.${key1}`,
                  error: [VALIDATION_MESSAGES.INVALID_TYPE_PROP],
                });
              }
            }
          });
        }

        // Check validation for `ARRAY` Object.
        if ((!json.schemaJson[key].type && _.isArray(json.schemaJson[key]))
        || (json.schemaJson[key].type && typeof json.schemaJson[key].type === 'string'
          && json.schemaJson[key].type.toUpperCase() === 'ARRAY' && json.schemaJson[key].description && _.isArray(json.schemaJson[key].description))) {
          let jsonArr = json.schemaJson[key];
          if (json.schemaJson[key].description && json.schemaJson[key].type && json.schemaJson[key].type.toUpperCase() === 'ARRAY') {
            jsonArr = json.schemaJson[key].description;
          }

          if (jsonArr.length > 1) {
            attErrors.push({
              modelName: json.modelName,
              attribute: `${key}`,
              error: [VALIDATION_MESSAGES.ONLY_ZERO_INDEX_ALLOW],
            });
          }

          const indexObj = jsonArr[0];
          Object.keys(indexObj).forEach((key1) => {
            const nestedJsonKey = indexObj[key1];
            if (!nestedJsonKey.type && key1 !== '_id') {
              attErrors.push({
                modelName: json.modelName,
                attribute: `${key}.${key1}`,
                error: [VALIDATION_MESSAGES.MISSING_TYPE_PROP],
              });
            } else if (nestedJsonKey?.type) {
              const typeKey = nestedJsonKey.type.toUpperCase();
              const allowProps = allFieldTypes[typeKey];
              if (allowProps && allowProps.attributes) {
                const aProps = _.compact(_.uniq([...defaultProps, ...allowProps.attributes]));
                let appliedProps = Object.keys(indexObj[key1]);
                appliedProps = _.cloneDeep(_.compact(_.remove(appliedProps, (v) => {
                  if (v === 'type' || v === 'description') {
                    return '';
                  }
                  return v;
                })));

                const keyErr = [];
                if (!_.isEmpty(appliedProps)) {
                  _.each(appliedProps, (prop) => {
                    if (!_.includes(aProps, prop)) {
                      keyErr.push(`Property not allowed - ${prop}.`);
                    }
                  });
                }

                // Validate RegExp.
                if (jsonArr[0][key1]?.match) {
                  const match = isRegExp(jsonArr[0][key1].match);
                  if (!match) {
                    keyErr.push(`${key}.${key1} - Invalid regular expression - ${jsonArr[0][key1].match}`);
                  }
                }

                jsonArr[0][key1].type = _.cloneDeep(allowProps.value);
                json.schemaJson[key] = _.cloneDeep(jsonArr);

                /**
                 * -----------------------------------------------
                 * Check properties of virtual-relation.
                 * -----------------------------------------------
                 */
                if (typeKey === 'VIRTUAL_RELATION') {
                  if (!_.includes(appliedProps, 'ref')) {
                    keyErr.push(VALIDATION_MESSAGES.MISSING_REF_PROPS);
                  }
                  if (!_.includes(appliedProps, 'localField')) {
                    keyErr.push(VALIDATION_MESSAGES.MISSING_LOCAL_FIELD_PROPS);
                  }
                  if (!_.includes(appliedProps, 'foreignField')) {
                    keyErr.push(VALIDATION_MESSAGES.MISSING_FOREIGN_FIELD_PROPS);
                  }
                }
                //-----------------------------------------------

                /**
                 * -----------------------------------------------
                 * Validate Min-Max property.
                 * -----------------------------------------------
                 */
                if (_.includes(appliedProps, 'min') && _.includes(appliedProps, 'max')) {
                  if (indexObj[key1].min > indexObj[key1].max) {
                    keyErr.push(VALIDATION_MESSAGES.MAX_MUST_GREATER_TO_MIN);
                  }
                }

                if (_.includes(appliedProps, 'min') && _.includes(appliedProps, 'default')) {
                  if (indexObj[key1].default < indexObj[key1].min) {
                    keyErr.push(VALIDATION_MESSAGES.DEFAULT_MUST_GREATER_OR_EQUAL_TO_MIN);
                  }
                }

                if (_.includes(appliedProps, 'max') && _.includes(appliedProps, 'default')) {
                  if (indexObj[key1].default > indexObj[key1].max) {
                    keyErr.push(VALIDATION_MESSAGES.DEFAULT_MUST_LOWER_OR_EQUAL_TO_MAX);
                  }
                }
                //-----------------------------------------------

                /**
                 * -----------------------------------------------
                 * Validate minLength-maxLength property.
                 * -----------------------------------------------
                 */
                if (_.includes(appliedProps, 'minLength') && _.includes(appliedProps, 'maxLength')) {
                  if (indexObj[key1].minLength > indexObj[key1].maxLength) {
                    keyErr.push(VALIDATION_MESSAGES.MAX_LENGTH_MUST_GREATER_TO_MIN_LENGTH);
                  }
                }

                if (_.includes(appliedProps, 'minLength') && _.includes(appliedProps, 'default')) {
                  if (indexObj[key1].default < indexObj[key1].minLength) {
                    keyErr.push(VALIDATION_MESSAGES.DEFAULT_LENGTH_MUST_GREATER_OR_EQUAL_TO_MIN_LENGTH);
                  }
                }

                if (_.includes(appliedProps, 'maxLength') && _.includes(appliedProps, 'default')) {
                  if (indexObj[key1].default > indexObj[key1].maxLength) {
                    keyErr.push(VALIDATION_MESSAGES.DEFAULT_LENGTH_MUST_LOWER_OR_EQUAL_TO_MAX_LENGTH);
                  }
                }
                //-----------------------------------------------

                // Do not allow `NULL` value in `default` prop, when field contain `required` property.
                if (indexObj[key1].required && (indexObj[key1].default === null || indexObj[key1].default === 'NULL' || indexObj[key1].default === 'null')) {
                  keyErr.push(`${VALIDATION_MESSAGES.INVALID_DEFAULT_PROP_VALUE}`);
                }

                if (keyErr && _.size(keyErr) > 0) {
                  attErrors.push({
                    modelName: json.modelName,
                    attribute: `${key}.${key1}`,
                    error: keyErr,
                  });
                }
              } else {
                attErrors.push({
                  modelName: json.modelName,
                  attribute: `${key}.${key1}`,
                  error: [VALIDATION_MESSAGES.INVALID_TYPE_PROP],
                });
              }
            }
          });
        }
      } else {
        attErrors.push({
          modelName: json.modelName,
          attribute: key,
          error: [VALIDATION_MESSAGES.MISSING_TYPE_PROP],
        });
      }
    });
  });

  let models = _.map(jsonDetails, (val) => {
    const errModel = _.find(attErrors, { modelName: val.modelName });
    if (errModel) {
      return {};
    }
    return val;
  });
  models = _.compact(_.reject(models, _.isEmpty));
  return {
    errors: attErrors,
    jsonSchema: models,
    originJson: jsonDetails,
  };
};

module.exports = validateProps;
