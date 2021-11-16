/* global MESSAGE, _ */

const { POLICY_GENERATE_TYPE } = require('../../../../models/constants/project');

const createUseCase = require('../../../projectPolicy/create');

const ProjectPolicyRepository = require('../../../../repo/projectPolicy');
const ApplicationRepository = require('../../../../repo/application');

const projectPolicyRepo = new ProjectPolicyRepository();
const applicationRepo = new ApplicationRepository();

const projectPolicy = async ({ params }) => {
  const input = [];
  const policyData = params.data;

  // Prepare `request-body` for create useCase.
  Object.keys(policyData).forEach((val) => {
    input.push({
      applicationId: params.applicationId,
      fileName: val,
      customJson: policyData[val].code,
      type: POLICY_GENERATE_TYPE.MANUAL,
    });
  });

  const errors = [];
  await Promise.all(input.map(async (val) => {
    const response = await createUseCase(projectPolicyRepo, applicationRepo)(_.cloneDeep(val));
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

module.exports = projectPolicy;
