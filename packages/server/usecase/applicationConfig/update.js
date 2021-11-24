/* global  _ */
const mongoose = require('mongoose');
const faker = require('faker');
const { appConfigUpdateValidation } = require('../util/validation/applicationConfig');
const {
  SERVER_ERROR, APPLICATION_CONFIG_NOT_FOUND, APPLICATION_CONFIG_UPDATED, BAD_REQUEST, INVALID_REQUEST_PARAMS, APPLICATION_DETAILS_NOT_FOUND,
} = require('../../constants/message').message;

const SchemaRepository = require('../../repo/schema');

const schemaRepo = new SchemaRepository();

/**
 * Function used to generate `FAKER` data.
 * @param  {} dataType
 * @param  {} keyName
 */
async function getFakerData (dataType, keyName) {
  let fakerData = null;
  if (keyName) {
    keyName = keyName.toLowerCase();
    if (keyName.toLowerCase() === 'username') {
      fakerData = faker.internet.userName();
    } else if (keyName === 'password') {
      fakerData = faker.internet.password();
    } else if (keyName === 'email') {
      fakerData = faker.internet.email();
    } else if (keyName === 'email') {
      fakerData = faker.internet.email();
    } else if (keyName === 'firstname') {
      fakerData = faker.name.firstName();
    } else if (keyName === 'lastname') {
      fakerData = faker.name.lastName();
    } else if (keyName === 'name') {
      fakerData = faker.internet.userName();
    } else if (keyName === 'gender') {
      fakerData = faker.name.gender();
    }
    if (fakerData) {
      return fakerData;
    }
  }

  switch (dataType.toLowerCase()) {
  case 'number':
    fakerData = faker.datatype.number();
    break;
  case 'float':
    fakerData = faker.datatype.float();
    break;
  case 'datetime':
    fakerData = faker.datatype.datetime();
    break;
  case 'string':
    fakerData = faker.random.alphaNumeric(10);
    break;
  case 'uuid':
    fakerData = faker.datatype.uuid();
    break;
  case 'boolean':
    fakerData = faker.datatype.boolean();
    break;

  default:
    fakerData = faker.random.alphaNumeric();
  }

  return fakerData;
}

/**
 *
 * Function used for update application-config.
 * @return json
 */
const update = (applicationConfig, applicationRepo) => async (id, params) => {
  try {
    const {
      value, error,
    } = appConfigUpdateValidation(params);
    if (error) {
      return {
        ...BAD_REQUEST,
        message: error,
      };
    }
    params = _.cloneDeep(value);

    // Validate Unique Criteria
    const filter = { find: { _id: id } };
    const applicationConfigData = await applicationConfig.get({ filter });

    if (!applicationConfigData) {
      return APPLICATION_CONFIG_NOT_FOUND;
    }

    const applicationDetails = await applicationRepo.get({ find: { _id: params.applicationId } });
    if (!applicationDetails) {
      return APPLICATION_DETAILS_NOT_FOUND;
    }

    if (!params.authModuleId) {
      params.authModule = null;
    }
    if (params.authModuleId) {
      const isValidId = mongoose.Types.ObjectId.isValid(params.authModuleId);
      if (!isValidId) {
        return INVALID_REQUEST_PARAMS;
      }
    }

    // Update `authentication.credentials`.
    let authData = {};
    if (applicationConfigData?.authentication) {
      authData = _.cloneDeep(applicationConfigData?.authentication);
    }
    const authModel = await schemaRepo.get({
      find: {
        _id: params.authModuleId,
        applicationId: params.applicationId,
      },
    });
    if (authModel?.schemaJson) {
      const { schemaJson } = authModel;
      let keys = [];
      if (params?.loginWith?.username) {
        keys.push(params.loginWith.username);
      }
      if (params?.loginWith?.password) {
        keys.push(params.loginWith.password);
      }
      keys = _.compact(_.uniq(_.flattenDeep(keys)));
      if (applicationDetails?.configInput?.types && applicationDetails.configInput.types.length > 0) {
        const userTypes = _.cloneDeep(applicationDetails.configInput.types);

        if (applicationConfigData?.authentication?.credentials) {
          const authCred = _.cloneDeep(applicationConfigData.authentication.credentials);
          const updatedCredentials = [];
          for (let i = 0; i < userTypes.length; i += 1) {
            const type = userTypes[i];

            let credData = {};
            credData = _.find(authCred, { type });
            if (!credData) {
              credData = { type };
            }
            if (!credData.email) {
              credData.email = faker.internet.email();
            }
            if (!credData.password) {
              credData.password = faker.internet.password();
            }
            // eslint-disable-next-line no-await-in-loop
            await Promise.all(
              _.map(keys, async (key) => {
                if (!credData[key]) {
                  const fakerData = await getFakerData(schemaJson?.[key]?.type, key);
                  credData[key] = fakerData;
                }
              }),
            );

            const credKeys = _.keys(credData);
            const diffKeys = _.difference(credKeys, keys);
            _.map(diffKeys, (k) => {
              if (!_.includes(['type', 'email', 'password'], k)) {
                delete credData[k];
              }
            });

            if (!_.isEmpty(credData)) {
              updatedCredentials.push(credData);
            }
          }
          if (updatedCredentials && updatedCredentials.length > 0) {
            authData.credentials = updatedCredentials;
          }
          params.authentication = authData;
        } else {
          const credentials = [];
          for (let i = 0; i < userTypes.length; i += 1) {
            const type = userTypes[i];
            const cred = {};
            cred.type = type;
            cred.email = faker.internet.email();
            cred.password = faker.internet.password();

            if (keys && keys.length > 0) {
              // eslint-disable-next-line no-await-in-loop
              await Promise.all(
                _.map(keys, async (key) => {
                  if (!cred[key]) {
                    const fakerData = await getFakerData(schemaJson?.[key]?.type, key);
                    cred[key] = fakerData;
                  }
                }),
              );
            }
            credentials.push(cred);
          }
          if (credentials && credentials.length > 0) {
            authData = {
              ...authData,
              credentials,
            };
          }
          params.authentication = _.cloneDeep(authData);
        }
      } else {
        params.authentication = _.cloneDeep({
          ...authData,
          credentials: null,
        });
      }
    }

    const updateResponse = await applicationConfig.update(id, params);

    const updateDataObj = _.cloneDeep(updateResponse.toObject());

    // Get schema data for responseFormatter.
    let modelIds = [];
    let resModelIds = [];

    if (updateDataObj?.responseFormatter) {
      modelIds = _.map(updateDataObj.responseFormatter, 'modelId');
      resModelIds = _.compact(_.flattenDeep(modelIds));
      resModelIds = _.cloneDeep(_.uniq(resModelIds.map(String)));
    }

    if (resModelIds && resModelIds.length > 0) {
      const schemaData = await schemaRepo.getDetails({
        find: { _id: resModelIds },
        fields: ['name'],
      });
      if (schemaData && schemaData.length > 0) {
        _.map(updateDataObj.responseFormatter, (resFormat) => {
          if (resFormat?.modelId) {
            const modelData = _.find(schemaData, { _id: resFormat.modelId });
            if (modelData) {
              resFormat.model = _.cloneDeep(modelData);
            }
          }
        });
      }
    }

    return {
      ...APPLICATION_CONFIG_UPDATED,
      data: updateDataObj,
    };
  } catch (err) {
    // console.log('err: ', err);
    return SERVER_ERROR;
  }
};

module.exports = update;
