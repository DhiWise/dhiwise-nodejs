/* global MESSAGE, _ */

const { CONSTANT_GENERATE_TYPE } = require('../../../../models/constants/project');

const createUseCase = require('../../../projectConstant/create');

const ProjectConstantRepository = require('../../../../repo/projectConstant');
const ApplicationRepository = require('../../../../repo/application');

const projectConstantRepo = new ProjectConstantRepository();
const applicationRepo = new ApplicationRepository();

const projectConstants = async ({ params }) => {
  const input = [];
  const constantData = params.data;

  // Prepare `request-body` for create useCase.
  Object.keys(constantData).forEach((val) => {
    input.push({
      applicationId: params.applicationId,
      fileName: val,
      customJson: constantData[val],
      type: CONSTANT_GENERATE_TYPE.MANUAL,
    });
  });

  const errors = [];
  await Promise.all(input.map(async (val) => {
    const response = await createUseCase(projectConstantRepo, applicationRepo)(_.cloneDeep(val));
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

module.exports = projectConstants;
