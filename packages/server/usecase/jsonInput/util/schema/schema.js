/* global MESSAGE, _ */
const { getDefaultFieldsForMongoDB } = require('../../../schema/util/staticData');
const createUseCase = require('../../../schema/create');

const { PROPS } = require('../../../../constants/dataTypes/props');
const { DATA_TYPES } = require('../../../../constants/schema');

const SchemaRepository = require('../../../../repo/schema');
const ApplicationRepository = require('../../../../repo/application');

const SchemaRepo = new SchemaRepository();
const applicationRepo = new ApplicationRepository();

const schema = async ({ params }) => {
  const input = [];
  const schemaData = params.data.models;

  let authModuleName = null;
  if (params?.data?.authModule) {
    authModuleName = _.cloneDeep(params.data.authModule);
  }

  let modelConfig = {};
  if (params?.data?.modelConfig) {
    modelConfig = params.data.modelConfig;
  }

  let newModelConfig = {};
  if (params?.data?.newModelConfig) {
    newModelConfig = params.data.newModelConfig;
  }

  let hooks = {};
  if (params.data.hooks) {
    hooks = params.data.hooks;
  }

  let modelIndexes = {};
  if (params.data.modelIndexes) {
    modelIndexes = params.data.modelIndexes;
  }

  // Get default fields.
  const defaultFields = await getDefaultFieldsForMongoDB();

  // Prepare `request-body` for create useCase.
  Object.keys(schemaData).forEach((val) => {
    // Prepare `hooks` data.
    const prepareHooks = [];
    if (hooks[val]) {
      const sHooks = hooks[val];
      Object.keys(sHooks).forEach((v) => {
        _.each(sHooks[v], (h) => {
          prepareHooks.push({
            code: h.code,
            type: v,
            operation: h.operation,
          });
        });
      });
    }

    let modelIndex = [];
    if (modelIndexes[val] && !_.isEmpty(modelIndexes[val])) {
      modelIndex = modelIndexes[val];
      _.map(modelIndex, (mInd) => {
        let indexName = 'index';
        Object.keys(mInd.indexFields).forEach((field) => {
          indexName = `${indexName}_${field}`;
        });
        mInd.name = _.cloneDeep(indexName);
      });
    }

    // Add default fields.
    const schemaJson = _.cloneDeep(schemaData[val]);
    const lowerSchemaJsonKeys = Object.keys(schemaJson).map((key) => key.toLowerCase());
    Object.keys(defaultFields).forEach((field) => {
      const lowerField = field.toLowerCase();

      if (!_.includes(lowerSchemaJsonKeys, lowerField)) {
        schemaJson[field] = defaultFields[field];
      }
      if (lowerField && (lowerField === 'addedby' || lowerField === 'updatedby')) {
        schemaJson[field].type = DATA_TYPES.OBJECTID.value;
        schemaJson[field][PROPS.REF] = authModuleName;
      }
    });
    schemaData[val] = _.cloneDeep(schemaJson);

    input.push({
      applicationId: params.applicationId,
      name: val,
      schemaJson: schemaData[val],
      hooks: prepareHooks ?? [],
      jsonInputModelConfig: modelConfig[val] ?? {},
      jsonInputNewModelConfig: newModelConfig[val] ?? {},
      modelIndexes: modelIndex,
    });
  });

  const errors = [];
  await Promise.all(input.map(async (val) => {
    const response = await createUseCase(SchemaRepo, applicationRepo)(_.cloneDeep(val));
    if (response.code !== MESSAGE.OK.code) {
      errors.push({
        message: response.message,
        data: val,
      });
    }
  }));
  return {
    ...MESSAGE.OK,
    data: { errors },
  };
};

module.exports = schema;
