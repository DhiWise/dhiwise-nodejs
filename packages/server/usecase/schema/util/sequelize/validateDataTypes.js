/* global _ */
const {
  VALIDATION_MESSAGES, RELATIONS_TYPES,
} = require('../../../../constants/schema');
const { PROPS } = require('../../../../constants/dataTypes/props');
const {
  INTEGER, BIGINT, FLOAT, REAL, DOUBLE, DECIMAL, UnsignedBigInt,
} = require('../../../../constants/dataTypes/dataTypes');
const isRegExp = require('../isRegExp');

const validateDataTypes = async ({
  model, dataTypes,
}) => {
  const notNullDataTypes = [INTEGER.VALUE, BIGINT.VALUE, FLOAT.VALUE, REAL.VALUE, DOUBLE.VALUE, DECIMAL.VALUE];

  // Convert case-sensitive properties to proper name.
  const dataTypesKeyValArr = [];
  Object.keys(PROPS).forEach((v) => {
    dataTypesKeyValArr.push({
      key: PROPS[v].toUpperCase(),
      val: PROPS[v],
    });
  });
  _.map(model.schemaJson, (val) => {
    _.map(_.keys(val), (k) => {
      const dType = _.find(dataTypesKeyValArr, { key: k.toUpperCase() });
      if (dType) {
        const keyVal = val[k];
        delete val[k];
        val[dType.val] = keyVal;
      }
    });
  });

  const errors = [];
  const schemaJson = _.cloneDeep(model.schemaJson);
  const keys = _.keys(model.schemaJson);

  for (let i = 0; i < keys.length; i += 1) {
    const keyErr = [];
    if (schemaJson[keys[i]].type) {
      if (schemaJson[keys[i]].type !== UnsignedBigInt.VALUE) {
        schemaJson[keys[i]].type = _.cloneDeep(schemaJson[keys[i]].type.toUpperCase());
      }
      const keyObj = schemaJson[keys[i]];

      let TYPE = keyObj.type;
      if (keyObj.type !== UnsignedBigInt.VALUE) {
        TYPE = keyObj.type.toUpperCase();
      }

      if (dataTypes[TYPE]) {
        const keyProps = _.keys(keyObj);
        let allowProps = _.cloneDeep(dataTypes[TYPE].ALLOW_PROPS);
        if (dataTypes[TYPE].NA_PROPS && dataTypes[TYPE].NA_PROPS.length) {
          allowProps = _.compact(_.difference(allowProps, dataTypes[TYPE].NA_PROPS));
        }
        allowProps.push('type');

        const NAProps = _.compact(_.difference(keyProps, allowProps));
        // Not allowed props.
        if (NAProps && NAProps.length) {
          _.map(NAProps, (v) => {
            keyErr.push(`${VALIDATION_MESSAGES.PROP_NOT_ALLOWED} - ${v}`);
          });
        }

        // Validate RegExp pattern.
        if (typeof keyObj === 'object' && keyObj[PROPS.PATTERN]) {
          const validPattern = isRegExp(keyObj[PROPS.PATTERN]);
          if (!validPattern) {
            keyErr.push(`${VALIDATION_MESSAGES.INVALID_REGEXP} - ${keyObj[PROPS.PATTERN]}`);
          }
        }

        // Validate MAX & DEFAULT prop.
        if (keyObj[PROPS.DEFAULT] && _.includes(allowProps, PROPS.DEFAULT)
        && keyObj[PROPS.MAX] && _.includes(allowProps, PROPS.MAX)) {
          if (keyObj[PROPS.DEFAULT] > keyObj[PROPS.MAX]) {
            keyErr.push(`${VALIDATION_MESSAGES.DEFAULT_MUST_LOWER_OR_EQUAL_TO_MAX}`);
          }
        }

        // Validate MIN & DEFAULT prop.
        if (keyObj[PROPS.DEFAULT] && _.includes(allowProps, PROPS.DEFAULT)
        && keyObj[PROPS.MIN] && _.includes(allowProps, PROPS.MIN)) {
          if (keyObj[PROPS.DEFAULT] < keyObj[PROPS.MIN]) {
            keyErr.push(`${VALIDATION_MESSAGES.DEFAULT_MUST_GREATER_OR_EQUAL_TO_MIN}`);
          }
        }

        // Validate MIN & MAX prop.
        if (keyObj[PROPS.MAX] && _.includes(allowProps, PROPS.MAX)
        && keyObj[PROPS.MIN] && _.includes(allowProps, PROPS.MIN)) {
          if (keyObj[PROPS.MAX] < keyObj[PROPS.MIN]) {
            keyErr.push(`${VALIDATION_MESSAGES.MAX_MUST_GREATER_TO_MIN}`);
          }
        }

        // Validate MAX_LENGTH & DEFAULT prop.
        if (keyObj[PROPS.DEFAULT] && _.includes(allowProps, PROPS.DEFAULT)
        && keyObj[PROPS.MAX_LENGTH] && _.includes(allowProps, PROPS.MAX_LENGTH)) {
          if (keyObj[PROPS.DEFAULT] > keyObj[PROPS.MAX_LENGTH]) {
            keyErr.push(`${VALIDATION_MESSAGES.DEFAULT_LENGTH_MUST_LOWER_OR_EQUAL_TO_MAX_LENGTH}`);
          }
        }

        // Validate MIN_LENGTH & DEFAULT prop.
        if (keyObj[PROPS.DEFAULT] && _.includes(allowProps, PROPS.DEFAULT)
        && keyObj[PROPS.MIN_LENGTH] && _.includes(allowProps, PROPS.MIN_LENGTH)) {
          if (keyObj[PROPS.DEFAULT] < keyObj[PROPS.MIN_LENGTH]) {
            keyErr.push(`${VALIDATION_MESSAGES.DEFAULT_LENGTH_MUST_GREATER_OR_EQUAL_TO_MIN_LENGTH}`);
          }
        }

        // Validate MIN_LENGTH & MAX_LENGTH prop.
        if (keyObj[PROPS.MAX_LENGTH] && _.includes(allowProps, PROPS.MAX_LENGTH)
        && keyObj[PROPS.MIN_LENGTH] && _.includes(allowProps, PROPS.MIN_LENGTH)) {
          if (keyObj[PROPS.MAX_LENGTH] < keyObj[PROPS.MIN_LENGTH]) {
            keyErr.push(`${VALIDATION_MESSAGES.MAX_LENGTH_MUST_GREATER_TO_MIN_LENGTH}`);
          }
        }

        // Validate `ref` field attribute.
        if (keyObj[PROPS.REF] && _.includes(allowProps, PROPS.REF)) {
          if (!keyObj[PROPS.REF_ATTR]) {
            keyErr.push(`${VALIDATION_MESSAGES.MISSING_RELATION_ATTR_PROP}`);
          }
        }

        // Do not allow `NULL` value in `default` prop, when field contain `required` property.
        if (keyObj[PROPS.REQUIRED] && (keyObj[PROPS.DEFAULT] === null || keyObj[PROPS.DEFAULT] === 'NULL' || keyObj[PROPS.DEFAULT] === 'null')) {
          keyErr.push(`${VALIDATION_MESSAGES.INVALID_DEFAULT_PROP_VALUE}`);
        }

        // Validate `relType` field attribute value.
        if (keyObj[PROPS.RELATION_TYPE] && _.includes(allowProps, PROPS.RELATION_TYPE)) {
          if (!_.includes([RELATIONS_TYPES.HAS_ONE, RELATIONS_TYPES.HAS_MANY], keyObj[PROPS.RELATION_TYPE])) {
            keyErr.push(`${VALIDATION_MESSAGES.INVALID_RELATION_TYPE_VAL}`);
          }
        }

        // Do not allow `default` as NULL, for below dataTypes.
        if (_.includes(notNullDataTypes, TYPE) && (keyObj[PROPS.DEFAULT] === null || keyObj[PROPS.DEFAULT] === 'NULL' || keyObj[PROPS.DEFAULT] === 'null')) {
          keyErr.push(`${VALIDATION_MESSAGES.INVALID_DEFAULT_PROP_VALUE}`);
        }
      } else {
        // Invalid type property.
        keyErr.push(`${VALIDATION_MESSAGES.INVALID_TYPE_PROP}`);
      }
    } else {
      // Missing type property.
      keyErr.push(`${VALIDATION_MESSAGES.MISSING_TYPE_PROP}`);
    }

    if (keyErr && keyErr.length > 0) {
      errors.push({
        modelName: model.modelName,
        attribute: keys[i],
        error: keyErr,
      });
    }
  }
  model.schemaJson = _.cloneDeep(schemaJson);
  return {
    errors,
    model,
  };
};
module.exports = validateDataTypes;
