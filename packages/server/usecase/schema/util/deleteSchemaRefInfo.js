/* global _ */

const SchemaRepository = require('../../../repo/schema');

const schemaRepo = new SchemaRepository();

const {
  OK, SERVER_ERROR,
} = require('../../../constants/message').message;

// Function used to give info and update schema-name related data, `schema` collection.
const deleteSchemaRefInfo = async ({
  delSchemaDetails, isInfo,
}) => {
  try {
    const filter = { find: { applicationId: delSchemaDetails.applicationId } };
    const schemaData = await schemaRepo.getDetails(filter);
    const schemaErrors = [];
    if (schemaData && schemaData.length > 0) {
      for (let i = 0; i < schemaData.length; i += 1) {
        const {
          schemaJson, name, _id,
        } = schemaData[i];
        _.each(schemaJson, async (val, key) => {
          if (schemaJson[key]?.ref && schemaJson[key].ref.toUpperCase() === delSchemaDetails.name.toUpperCase()) {
            if (isInfo) {
              schemaErrors.push({
                modelName: name,
                key,
              });
            } else {
              delete schemaJson[key];
            }
          }
          // JSON
          if (typeof schemaJson[key] === 'object') {
            _.each(schemaJson[key], (jVal, jKey) => {
              if (schemaJson[key][jKey]?.ref && schemaJson[key][jKey].ref.toUpperCase() === delSchemaDetails.name.toUpperCase()) {
                if (isInfo) {
                  schemaErrors.push({
                    modelName: name,
                    key: jKey,
                    parentKey: key,
                  });
                } else {
                  delete schemaJson[key][jKey];
                }
              }
            });
          }
          // Array
          if (_.isArray(schemaJson[key])) {
            _.each(schemaJson[key][0], (jVal, jKey) => {
              if (schemaJson[key][0][jKey]?.ref && schemaJson[key][0][jKey].ref.toUpperCase() === delSchemaDetails.name.toUpperCase()) {
                if (isInfo) {
                  schemaErrors.push({
                    modelName: name,
                    key: jKey,
                    parentKey: key,
                  });
                } else {
                  delete schemaJson[key][0][jKey];
                }
              }
            });
          }
        });
        if (!isInfo) {
          // eslint-disable-next-line no-await-in-loop
          await schemaRepo.update(_id, { schemaJson });
        }
      }
    }

    return {
      ...OK,
      data: { schemaErrors },
    };
  } catch (err) {
    // console.log('err: ', err);
    return {
      ...SERVER_ERROR,
      data: err.toString(),
    };
  }
};

module.exports = deleteSchemaRefInfo;
