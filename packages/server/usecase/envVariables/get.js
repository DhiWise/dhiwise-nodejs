/* global _ */
const { decrypt } = require('../../util-service/crypto');
const {
  INVALID_REQUEST_PARAMS, OK, SERVER_ERROR, ENV_VARIABLE_NOT_FOUND,
} = require('../../constants/message').message;

const get = (envVariablesRepo) => async (params) => {
  try {
    if (!params || !params.applicationId) {
      return INVALID_REQUEST_PARAMS;
    }

    const envData = await envVariablesRepo.get({ find: { applicationId: params.applicationId } });

    if (!envData) {
      return ENV_VARIABLE_NOT_FOUND;
    }

    if (envData && envData.customJson) {
      // Convert Encrypted values in Decrypted form.
      _.each(envData.customJson, (val) => {
        if (val && val.value) {
          _.each(val.value, async (v, k) => {
            let isDecrypt = true;
            if ((val?.dataType) && _.indexOf(['string'], val.dataType.toLowerCase()) < 0) {
              isDecrypt = false;
            }
            if (isDecrypt) {
              const decryptedValue = await decrypt(v);
              val.value[k] = decryptedValue;
            }
          });
        }
      });
    }

    return {
      ...OK,
      data: envData,
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    // console.log('error', err);
    return SERVER_ERROR;
  }
};
module.exports = get;
