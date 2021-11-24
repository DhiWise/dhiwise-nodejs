/* global _ */
const mongoose = require('mongoose');
const {
  INVALID_REQUEST_PARAMS, OK, SERVER_ERROR,
} = require('../../constants/message').message;

const SchemaRepository = require('../../repo/schema');

const schemaRepo = new SchemaRepository();

const paginate = (applicationConfigRepo) => async (param) => {
  try {
    let params = param;
    if (!params) {
      params = {};
    }

    if (!params.applicationId) {
      return INVALID_REQUEST_PARAMS;
    }
    if (params.applicationId) {
      const isValidId = mongoose.Types.ObjectId.isValid(params.applicationId);
      if (!isValidId) {
        return INVALID_REQUEST_PARAMS;
      }
    }
    /*
     * params = {
     *     fields: "",
     *     find: {},
     *     page: 1,
     *     limit: 1
     * }
     */
    if (!params.find) {
      params.find = {};
    }
    params.find.applicationId = params.applicationId;
    const filter = params;
    const list = await applicationConfigRepo.getDetails(filter);

    let resModelIds = [];

    // Get schema data for responseFormatter.
    _.map(list, (config) => {
      if (config?.responseFormatter) {
        const mIds = _.map(config.responseFormatter, 'modelId');
        resModelIds.push(mIds);
      }
    });
    resModelIds = _.compact(_.flattenDeep(resModelIds));
    resModelIds = _.cloneDeep(_.uniq(resModelIds.map(String)));

    if (resModelIds && resModelIds.length > 0) {
      const schemaData = await schemaRepo.getDetails({
        find: { _id: resModelIds },
        fields: ['name'],
      });
      if (schemaData && schemaData.length > 0) {
        _.map(list, (config) => {
          if (config?.responseFormatter) {
            _.map(config.responseFormatter, (resFormat) => {
              if (resFormat?.modelId) {
                const modelData = _.find(schemaData, { _id: resFormat.modelId });
                if (modelData) {
                  resFormat.model = _.cloneDeep(modelData);
                }
              }
            });
          }
        });
      }
    }

    const response = {
      list,
      count: await applicationConfigRepo.getCount(filter),
    };
    return {
      ...OK,
      data: response,
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    // console.log('error', err);
    return SERVER_ERROR;
  }
};
module.exports = paginate;
