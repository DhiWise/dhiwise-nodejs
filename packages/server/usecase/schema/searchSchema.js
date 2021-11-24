/* global _ */
const axios = require('axios');
const cheerio = require('cheerio');
const { DATABASE_TYPE } = require('../../models/constants/applicationConfig');
const mongoDBDataTypes = require('../../constants/schema').DATA_TYPES;
const { SCHEMA_ORG_URL } = require('../../constants/schema');
const {
  mySqlDataTypes, postGreSqlDataTypes, sqlDataTypes,
} = require('../../constants/dataTypes/sequelize');

const { schemaSearchValidation } = require('../util/validation/schema');

const {
  OK, SERVER_ERROR, SCHEMA_SEARCH_FAILED, APPLICATION_DETAILS_NOT_FOUND, BAD_REQUEST,
} = require('../../constants/message').message;

const searchSchema = (applicationRepo) => async (params) => {
  try {
    const {
      value, error,
    } = schemaSearchValidation(params);
    if (error) {
      return {
        ...BAD_REQUEST,
        message: error,
      };
    }
    params = _.cloneDeep(value);

    const applicationDetails = await applicationRepo.get({ find: { _id: params.applicationId } });
    if (!applicationDetails) {
      return APPLICATION_DETAILS_NOT_FOUND;
    }

    const url = `${SCHEMA_ORG_URL}/${params.schemaName}`;
    const apiResponse = await axios(url)
      .then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);
        const statsTable = $('.definition-table > tbody > tr');
        const schemaData = [];
        statsTable.each(() => {
          const group = $(this).find('tr.supertype > th > a').text();
          const attribute = $(this).find('tr > th.prop-nam > code > a').text();
          const dataType = $(this).find('tr > td.prop-ect > a').text();
          const description = $(this).find('tr > td.prop-desc').text();

          schemaData.push({
            group,
            attribute,
            dataType,
            description,
          });
        });
        return schemaData;
      })
      .catch((errors) => errors);

    if (!apiResponse || !_.isArray(apiResponse) || apiResponse.length <= 0) {
      return {
        ...SCHEMA_SEARCH_FAILED,
        data: apiResponse.toString(),
      };
    }

    // Mapping dataTypes
    let dataTypes = _.keys(mongoDBDataTypes);
    let defaultDataType = _.cloneDeep(mongoDBDataTypes.STRING.value);
    if (applicationDetails?.stepInput?.databaseType === DATABASE_TYPE.SQL) {
      dataTypes = _.keys(sqlDataTypes.DATA_TYPES);
      defaultDataType = _.cloneDeep(sqlDataTypes.DATA_TYPES.STRING.VALUE);
    } else if (applicationDetails?.stepInput?.databaseType === DATABASE_TYPE.MYSQL) {
      dataTypes = _.keys(mySqlDataTypes.DATA_TYPES);
      defaultDataType = _.cloneDeep(mySqlDataTypes.DATA_TYPES.STRING.VALUE);
    } else if (applicationDetails?.stepInput?.databaseType === DATABASE_TYPE.POSTGRE_SQL) {
      dataTypes = _.keys(postGreSqlDataTypes.DATA_TYPES);
      defaultDataType = _.cloneDeep(postGreSqlDataTypes.DATA_TYPES.STRING.VALUE);
    }

    const schemaJsonData = {
      name: params.schemaName,
      schemaJson: {},
    };
    _.each(apiResponse, (schema) => {
      let dataTypeMatch = false;
      if (schema?.attribute && schema.attribute !== '') {
        if (schema?.attribute && schema.attribute !== '' && schema?.dataType && schema.dataType !== '') {
          _.each(dataTypes, (type) => {
            let schDataType = schema.dataType.replace(/([a-z](?=[A-Z]))/g, '$1 ').split(' ');
            schDataType = schDataType.map((v) => v.toLowerCase());
            if (_.includes(schDataType, type.toLowerCase())) {
              dataTypeMatch = true;
              schema.dataType = type;
            }
          });
        }
        if (!dataTypeMatch) {
          schema.dataType = defaultDataType;
        }
        const { attribute } = schema;
        schemaJsonData.schemaJson[attribute] = {
          type: schema.dataType,
          description: schema.description,
        };
      }
    });
    return {
      ...OK,
      data: schemaJsonData,
    };
  } catch (err) {
    // console.log('error', err);
    return SERVER_ERROR;
  }
};

module.exports = searchSchema;
