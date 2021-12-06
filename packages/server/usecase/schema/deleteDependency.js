/* global MESSAGE */
const {
  SERVER_ERROR, MODEL_DELETED, OK, APP_CONFIG_MODEL, SCHEMA_DELETE_DEPENDENCY,
} = require('../../constants/message').message;
const { getApplicationDetail } = require('../util/getApplicationData');
const projectApplicationUpdate = require('../common/projectApplicationUpdate');

const ApplicationConfigRepo = require('../../repo/applicationConfig');

const applicationConfigRepo = new ApplicationConfigRepo();

const {
  deleteSchemaRefInfo, deleteSchemaReferences,
} = require('./util');

/**
 *Function used to update application config data.
 * @param  {} data
 */
async function getAuthModule (data) {
  const { schemaId } = data;

  const appConfigUpdateFilter = { find: { authModuleId: schemaId } };
  const appConfig = await applicationConfigRepo.get(appConfigUpdateFilter);
  return appConfig;
}

// { filter: { find: { applicationId: params.id } } }
const deleteMany = (schemaRepo, applicationRepo) => async (params) => {
  try {
    const {
      isHardDelete, isDependencyInfo,
    } = params;
    const filter = { find: { _id: params.id } };

    const response = await schemaRepo.getDetails(filter);
    if (response && response.length) {
      const applicationData = await getApplicationDetail(applicationRepo)({
        applicationId: response?.[0]?.applicationId,
        fields: ['projectId'],
      });

      if (applicationData?.code !== MESSAGE.OK.code) {
        return applicationData;
      }
      const application = applicationData?.data;

      // Check requested model, used in Application-Config.
      const authModuleRes = await getAuthModule({ schemaId: response[0]._id });
      if (authModuleRes) {
        return APP_CONFIG_MODEL;
      }

      const schemaReferenceInput = {
        delSchemaDetails: response[0],
        isInfo: isDependencyInfo,
      };

      // Update schema dependency.
      const delRefRes = await deleteSchemaRefInfo(schemaReferenceInput);
      if (delRefRes?.code && delRefRes.code !== OK.code) {
        throw new Error(delRefRes.data);
      }
      if (isDependencyInfo) {
        return {
          ...SCHEMA_DELETE_DEPENDENCY,
          data: delRefRes.data.schemaErrors,
        };
      }

      if (isHardDelete) {
        await schemaRepo.deleteMany(filter);
      } else {
        const updateData = {
          filter,
          data: { isDeleted: true },
        };
        await schemaRepo.updateMany(updateData);
      }

      // Function used to delete `schema` related references.
      const delRef = await deleteSchemaReferences({
        schemaData: response[0],
        isHardDelete,
      });
      if (delRef?.code && delRef.code !== OK.code) {
        return delRef;
      }

      projectApplicationUpdate({
        params: {
          projectId: application?.projectId,
          applicationId: application._id,
        },
      });
    }

    let responseMsg = OK;
    responseMsg = MODEL_DELETED;

    return {
      ...responseMsg,
      data: null,
    };
  } catch (err) {
    // console.log('error', err);
    return { ...SERVER_ERROR };
    // return { ...SERVER_ERROR, data: err.toString() };
  }
};

module.exports = deleteMany;
