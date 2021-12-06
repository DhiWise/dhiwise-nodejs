/* global  _ */
const mongoose = require('mongoose');
const {
  encrypt, decrypt,
} = require('../../util-service/crypto');
const {
  INVALID_REQUEST_PARAMS, SERVER_ERROR, ENV_DETAILS_UPDATED,
} = require('../../constants/message').message;
const { VALIDATION_RULES } = require('../../constants/validation');
const projectApplicationUpdate = require('../common/projectApplicationUpdate');

const upsert = (envVariablesRepo) => async (params) => {
  try {
    if (!params.applicationId || !params.customJson) {
      return INVALID_REQUEST_PARAMS;
    }
    if (params.applicationId) {
      const isValidId = mongoose.Types.ObjectId.isValid(params.applicationId);
      if (!isValidId) {
        return INVALID_REQUEST_PARAMS;
      }
    }

    // check variable name
    let isValid = true;
    if (params.environments && params.environments.length) {
      // eslint-disable-next-line for-direction
      for (let i = 0; i < params.environments.length; i += 1) {
        const p = new RegExp(VALIDATION_RULES.APPLICATION_FILE_NAME);
        if (!p.test(params.environments[i])) {
          isValid = false;
          break;
        }
      }
    }
    if (!isValid) {
      return INVALID_REQUEST_PARAMS;
    }
    // Convert values in Encrypted form.
    _.each(params.customJson, (val) => {
      if (val && val.value) {
        _.each(val.value, async (v, k) => {
          let isEncrypt = true;
          if ((val?.dataType) && _.indexOf(['string'], val.dataType.toLowerCase()) < 0) {
            isEncrypt = false;
          }
          if (isEncrypt && v !== '') {
            const encryptedValue = await encrypt(v);
            val.value[k] = encryptedValue;
          }
        });
      }
    });

    // Check record already exists for same `Application`.
    if (!params.id) {
      const envData = await envVariablesRepo.get({
        find: {
          applicationId: params.applicationId,
          isActive: { $in: [true, false] },
        },
      });

      if (envData) {
        params.id = envData._id;
      }
    }

    let environmentData = {};
    if (params.id) {
      const { id } = params;
      delete params.id;
      environmentData = await envVariablesRepo.update(id, params);
    } else {
      environmentData = await envVariablesRepo.create(params);
    }

    // Convert Encrypted values in Decrypted form.
    _.each(environmentData.customJson, (val) => {
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

    projectApplicationUpdate({
      params: { applicationId: params.applicationId },
      isProjectId: true,
    });
    const responseMsg = ENV_DETAILS_UPDATED;

    return {
      ...responseMsg,
      data: environmentData,
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    // console.log('error', err);
    return SERVER_ERROR;
  }
};
module.exports = upsert;
