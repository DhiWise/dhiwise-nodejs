const ProjectPolicyRepository = require('../../../repo/projectPolicy');
const ApplicationRepository = require('../../../repo/application');

const applicationRepo = new ApplicationRepository();
const projectPolicyRepo = new ProjectPolicyRepository();

const createUseCase = require('../../../usecase/projectPolicy/create')(projectPolicyRepo, applicationRepo);
const paginateUseCase = require('../../../usecase/projectPolicy/paginate')(projectPolicyRepo);
const deleteUseCase = require('../../../usecase/projectPolicy/delete')(projectPolicyRepo, applicationRepo);
const updateUseCase = require('../../../usecase/projectPolicy/update')(projectPolicyRepo, applicationRepo);

const projectPolicy = require('./projectPolicy');

const create = projectPolicy.create({ createUseCase });
const paginate = projectPolicy.paginate({ paginateUseCase });
const update = projectPolicy.update({ updateUseCase });
const destroy = projectPolicy.destroy({ deleteUseCase });

module.exports = {
  create,
  paginate,
  update,
  destroy,
};
