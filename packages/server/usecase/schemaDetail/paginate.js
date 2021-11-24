/* global _ */
const mongoose = require('mongoose');
const {
  INVALID_REQUEST_PARAMS, SCHEMA_NOT_FOUND, OK, SERVER_ERROR, APPLICATION_NOT_FOUND,
} = require('../../constants/message').message;

const ApplicationRepository = require('../../repo/application');

const applicationRepo = new ApplicationRepository();

const paginate = (schemaDetailRepo, schemaRepo) => async (params) => {
  try {
    const filter = { find: {} };
    if (!params.applicationId) {
      return INVALID_REQUEST_PARAMS;
    }
    if (params.applicationId) {
      const isValidId = mongoose.Types.ObjectId.isValid(params.applicationId);
      if (!isValidId) {
        return INVALID_REQUEST_PARAMS;
      }
    }
    const applicationData = await applicationRepo.get({ find: { _id: params.applicationId } });

    if (!applicationData) {
      return APPLICATION_NOT_FOUND;
    }

    if (params.find) {
      filter.find = params.find;
    }

    filter.find.applicationId = params.applicationId;
    /*
     * params = {
     *     fields: "",
     *     find: {},
     *     page: 1,
     *     limit: 1
     * }
     */
    const schemas = await schemaRepo.getDetails(filter);
    if (!schemas.length) {
      return SCHEMA_NOT_FOUND;
    }
    const detailFilter = {
      find: { schemaId: _.map(schemas, '_id') },
      populate: [{ schemaId: ['name'] }],
    };
    /*
     * if (params.schemaId) {
     *   detailFilter.find.schemaId = params.schemaId;
     * }
     */
    const listData = await schemaDetailRepo.getDetails(detailFilter);

    if (applicationData?.configInput?.platform && listData && listData.length > 0) {
      const { platform } = applicationData.configInput;

      _.each(listData, (sJson) => {
        _.map(platform, (val) => {
          if (sJson?.schemaJson && !sJson.schemaJson[val]) {
            sJson.schemaJson[val] = [{
              isAuth: false,
              policy: [],
            }];
          }

          if (sJson?.additionalJson?.additionalSetting && !sJson.additionalJson.additionalSetting[val]) {
            sJson.additionalJson.additionalSetting[val] = {};
          }
        });
      });
    }

    const response = { list: listData };
    return {
      ...OK,
      data: response,
    };
  } catch (err) {
    // console.log('error', err);
    return { ...SERVER_ERROR };
    // return { ...SERVER_ERROR, data: err.toString() };
  }
};

module.exports = paginate;
