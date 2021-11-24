/* global MESSAGE, _ */
const mongoose = require('mongoose');
const {
  INVALID_REQUEST_PARAMS, PROJECT_POLICY_NOT_FOUND, RECORD_WITH_SAME_NAME_EXISTS, SERVER_ERROR, ALREADY_USED_POLICY, MIDDLEWARE_UPDATED, OK,
} = require('../../constants/message').message;

const { getApplicationDetail } = require('../util/getApplicationData');
const projectApplicationUpdate = require('../common/projectApplicationUpdate');
const SchemaDetailRepo = require('../../repo/schemaDetail');
const SchemaRepo = require('../../repo/schema');
const ProjectRouteRepo = require('../../repo/projectRoute');

const schemaDetailRepository = new SchemaDetailRepo();
const projectRouteRepository = new ProjectRouteRepo();
const schemaRepository = new SchemaRepo();
const { projectPolicyUpdateValidation } = require('../util/validation/projectPolicy');
const {
  additionalJsonObj, schemaJsonObj,
} = require('./util/dependentCond');
// Validation

/**
 *
 * Function used for validate request.
 * @description ::  Find Documentation @ http://validatejs.org/
 * @return mixed :: If error occurred then return array of errors else return undefined | null
 */
/*
 * async function validateData(data) {
 *   const constraints = {
 *     customJson: {
 *       presence: true,
 *     },
 *     fileName: {
 *       type: 'string',
 *       presence: true,
 *     },
 *     applicationId: {
 *       type: 'string',
 *       presence: true,
 *     },
 *   };
 */

//   const errors = validate(data, constraints);

/*
 *   if (errors) {
 *     return errors;
 *   }
 *   return null;
 * }
 */

/**
 * Function used to update policyName in `Schema-Details` and `Project-Route`.
 * @param  {} {params
 * @param  {} policyData
 * @param  {} }
 */
async function udpdatePolicyNameInSchemaDetailsAndRoutes ({
  params, policyData,
}) {
  try {
    // Update `policy-name` in `project-routes`.
    const projectRouteFilter = {
      find: {
        applicationId: params.applicationId,
        policies: policyData.fileName,
      },
    };
    const isValidId = mongoose.Types.ObjectId.isValid(params.applicationId);
    if (!isValidId) {
      return INVALID_REQUEST_PARAMS;
    }
    const routesData = await projectRouteRepository.getDetails(projectRouteFilter);
    if (routesData && routesData.length) {
      await Promise.all(routesData.map(async (route) => {
        let policies = [];
        if (route?.policies && _.includes(route.policies, policyData.fileName)) {
          policies = _.pull(route.policies, policyData.fileName);
          policies.push(params.fileName);
          policies = _.compact(policies);
          await projectRouteRepository.update(route._id, { policies });
        }
      }));
    }

    // Update `policy-name` in `schema-details`.
    const getSchema = await schemaRepository.getDetails({
      find: { applicationId: policyData.applicationId },
      fields: ['_id'],
    });

    const schemaIds = _.compact(_.map(getSchema, '_id'));
    if (schemaIds && _.size(schemaIds) > 0) {
      const schemaDetails = await schemaDetailRepository.getDetails({ find: { schemaId: schemaIds } });
      if (schemaDetails && _.size(schemaDetails) > 0) {
        await Promise.all(schemaDetails.map(async (scDetail) => {
          let schemaJsonUpdate = false;
          let additionalJsonUpdate = false;
          const updateData = {};
          _.each(scDetail.schemaJson, (schemaJson) => {
            _.map(schemaJson, (v) => {
              if (v?.policy && _.includes(v.policy, policyData.fileName)) {
                v.policy = _.pull(v.policy, policyData.fileName);
                v.policy.push(params.fileName);
                v.policy = _.compact(v.policy);
                schemaJsonUpdate = true;
              }
            });
          });

          _.each(scDetail.additionalJson.additionalSetting, (addJson) => {
            _.each(addJson, (v) => {
              if (v?.policy && _.includes(v.policy, policyData.fileName)) {
                v.policy = _.pull(v.policy, policyData.fileName);
                v.policy.push(params.fileName);
                v.policy = _.compact(v.policy);
                additionalJsonUpdate = true;
              }
            });
          });

          if (schemaJsonUpdate) {
            updateData.schemaJson = scDetail.schemaJson;
          }
          if (additionalJsonUpdate) {
            updateData.additionalJson = scDetail.additionalJson;
          }

          if (!_.isEmpty(updateData)) {
            await schemaDetailRepository.update(scDetail._id, updateData);
          }
        }));
      }
    }

    return OK;
  } catch (err) {
    // console.log('err: ', err);
    return SERVER_ERROR;
  }
}

/**
 *
 * Function used for update user.
 * @return json
 */
const update = (projectPolicyRepo, applicationRepo) => async (id, params) => {
  try {
    /*
     * Validate Request
     * const errors = await validateData(params);
     */

    /*
     * if (errors || !id) {
     *   return { ...INVALID_REQUEST_PARAMS, data: errors };
     * }
     */
    const {
      value, error,
    } = projectPolicyUpdateValidation(params);
    if (error) {
      return {
        data: null,
        code: MESSAGE.BAD_REQUEST.code,
        message: error,
      };
    }
    params = value;

    const applicationData = await getApplicationDetail(applicationRepo)({
      applicationId: params.applicationId,
      fields: ['configInput', 'projectId'],
    });

    if (applicationData?.code !== MESSAGE.OK.code) {
      return applicationData;
    }

    const applicationDetails = _.cloneDeep(applicationData.data);

    const checkFilter = {
      or: [{ fileName: params.fileName }],
      ne: [{ _id: id }],
      in: [{ isActive: [true, false] }],
      find: { applicationId: params.applicationId },
    };
    const checkProjectPolicy = await projectPolicyRepo.get({ filter: checkFilter });

    // Validate Unique Criteria
    if (checkProjectPolicy) {
      return RECORD_WITH_SAME_NAME_EXISTS;
    }

    const filter = {
      find: {
        _id: id,
        isActive: { $in: [true, false] },
      },
    };
    const policyData = await projectPolicyRepo.get({ filter });

    if (!policyData) {
      return PROJECT_POLICY_NOT_FOUND;
    }

    if (params.isActive === false) {
      // Check policy dependency in `Schem-Details`.

      // Get applicationId from `Schema` collection.
      const getSchema = await schemaRepository.getDetails({
        find: { applicationId: policyData.applicationId },
        fields: ['_id'],
      });

      const schemaIds = _.compact(_.map(getSchema, '_id'));
      if (schemaIds && _.size(schemaIds) > 0) {
        const schemaJsonData = await schemaJsonObj(applicationDetails, policyData);
        const additionalJsonData = await additionalJsonObj(applicationDetails, policyData);

        const orCondArr = [...schemaJsonData, ...additionalJsonData];

        const schemaFilter = {
          find: { schemaId: schemaIds },
          or: orCondArr,
        };
        const schemaDetails = await schemaDetailRepository.getDetails(schemaFilter);
        if (schemaDetails && _.size(schemaDetails) > 0) {
          return ALREADY_USED_POLICY;
        }
      }

      // Check policy dependency in `Project-Routes`.
      const projectRouteFilter = {
        find: {
          applicationId: params.applicationId,
          policies: policyData.fileName,
        },
      };
      const projectRoutes = await projectRouteRepository.getDetails(projectRouteFilter);
      if (projectRoutes && _.size(projectRoutes) > 0) {
        return ALREADY_USED_POLICY;
      }
    }

    // Update policyName in `Schema-Details` and `Project-Route`.
    if (params.fileName !== policyData.fileName) {
      const updateRes = await udpdatePolicyNameInSchemaDetailsAndRoutes({
        params,
        policyData,
      });

      if (updateRes.code !== OK.code) {
        return updateRes;
      }
    }

    projectApplicationUpdate({
      params: {
        projectId: applicationData?.data?.projectId,
        applicationId: params.applicationId,
      },
    });
    const updateResponse = await projectPolicyRepo.update(id, params);
    return {
      ...MIDDLEWARE_UPDATED,
      data: updateResponse,
    };
  } catch (err) {
    // console.log('error', err);
    return SERVER_ERROR;
  }
};

module.exports = update;
