/* global  _ */
const { PROPS } = require('../../../constants/dataTypes/props');
const {
  SERVER_ERROR, OK,
} = require('../../../constants/message').message;

const updateSchemaRefAttribute = async ({
  schemaRepo, schemaParams,
}) => {
  try {
    const {
      dependencySetting, updatedName,
    } = schemaParams;
    const schemaFilter = { find: { applicationId: schemaParams.applicationId } };
    const schemas = await schemaRepo.getDetails(schemaFilter);
    if (schemas && schemas.length) {
      for (let i = 0; i < schemas.length; i += 1) {
        const schema = schemas[i];
        if (schema?.schemaJson) {
          _.each(schema.schemaJson, (val, key) => {
            if (schema.schemaJson[key] && schema.schemaJson[key][PROPS.REF] && schema.schemaJson[key][PROPS.REF].toUpperCase() === schemaParams.oldName.toUpperCase()) {
              schema.schemaJson[key][PROPS.REF] = updatedName;
            }
            // refAttribute key.
            if (schema?.schemaJson[key] && schema?.schemaJson[key][PROPS.REF_ATTR]) {
              const attrName = schema?.schemaJson[key][PROPS.REF_ATTR];
              const dependentKey = _.find(dependencySetting, { oldKey: attrName });
              if (dependentKey?.newKey && !dependentKey.parentKey && !dependentKey?.isDelete) {
                schema.schemaJson[key][PROPS.REF_ATTR] = _.cloneDeep(dependentKey.newKey);
              } else if (dependentKey?.isDelete) {
                delete schema.schemaJson[key][PROPS.REF_ATTR];
              }
            }
            // foreignField key.
            if (schema?.schemaJson[key] && schema?.schemaJson[key][PROPS.REF]
              && schema?.schemaJson[key][PROPS.FOREIGN_FIELD]
              && updatedName === schema.schemaJson[key][PROPS.REF]) {
              const dependentKey = _.find(dependencySetting, { oldKey: schema.schemaJson[key][PROPS.FOREIGN_FIELD] });
              if (dependentKey?.newKey && !dependentKey.parentKey && !dependentKey?.isDelete) {
                schema.schemaJson[key][PROPS.FOREIGN_FIELD] = _.cloneDeep(dependentKey.newKey);
              } else if (dependentKey?.isDelete) {
                delete schema.schemaJson[key][PROPS.FOREIGN_FIELD];
              }
            }
            // localField key.
            if (schema?.schemaJson[key] && schema?.schemaJson[key][PROPS.LOCAL_FIELD]) {
              const dependentKey = _.find(dependencySetting, { oldKey: schema.schemaJson[key][PROPS.LOCAL_FIELD] });
              if (dependentKey?.newKey && !dependentKey.parentKey && !dependentKey?.isDelete) {
                schema.schemaJson[key][PROPS.LOCAL_FIELD] = _.cloneDeep(dependentKey.newKey);
              } else if (dependentKey?.isDelete) {
                delete schema.schemaJson[key][PROPS.LOCAL_FIELD];
              }
            }

            // JSON type attribute.
            if (_.isObject(schema.schemaJson[key]) && !_.isArray(schema.schemaJson[key])) {
              _.each(schema.schemaJson[key], (jsonVal, jsonKey) => {
                if (schema.schemaJson[key] && schema.schemaJson[key][jsonKey] && schema.schemaJson[key][jsonKey][PROPS.REF]
                  && schema.schemaJson[key][jsonKey][PROPS.REF].toUpperCase() === schemaParams.oldName.toUpperCase()) {
                  schema.schemaJson[key][jsonKey][PROPS.REF] = updatedName;
                }
              });
            }
            // Array type attribute.
            if (_.isArray(schema.schemaJson[key])) {
              const arraySchema = _.cloneDeep(schema.schemaJson[key][0]);
              if (arraySchema) {
                _.each(arraySchema, (jsonVal, jsonKey) => {
                  if (arraySchema[jsonKey] && arraySchema[jsonKey][PROPS.REF] && arraySchema[jsonKey][PROPS.REF].toUpperCase() === schemaParams.oldName.toUpperCase()) {
                    arraySchema[jsonKey][PROPS.REF] = updatedName;
                  }
                });
              }
              schema.schemaJson[key] = [arraySchema];
            }
          });

          const schemaUpdateData = { schemaJson: schema.schemaJson };
          // eslint-disable-next-line no-await-in-loop
          await schemaRepo.update(schema._id, schemaUpdateData);
        }
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
};

module.exports = updateSchemaRefAttribute;
