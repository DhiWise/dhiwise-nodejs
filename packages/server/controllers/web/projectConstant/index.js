const ProjectConstantRepository = require('../../../repo/projectConstant');
const ApplicationRepository = require('../../../repo/application');

const applicationRepo = new ApplicationRepository();
const projectConstantRepo = new ProjectConstantRepository();

const createUseCase = require('../../../usecase/projectConstant/create')(projectConstantRepo, applicationRepo);
const paginateUseCase = require('../../../usecase/projectConstant/paginate')(projectConstantRepo);
const deleteUseCase = require('../../../usecase/projectConstant/delete')(projectConstantRepo, applicationRepo);
const updateUseCase = require('../../../usecase/projectConstant/update')(projectConstantRepo, applicationRepo);

const projectConstant = require('./projectConstant');

const create = projectConstant.create({ createUseCase });
const paginate = projectConstant.paginate({ paginateUseCase });
const update = projectConstant.update({ updateUseCase });
const destroy = projectConstant.destroy({ deleteUseCase });

module.exports = {
  create,
  paginate,
  update,
  destroy,
};
