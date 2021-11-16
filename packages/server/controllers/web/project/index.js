const ProjectRepository = require('../../../repo/project');
const ApplicationRepository = require('../../../repo/application');

const projectRepo = new ProjectRepository();
const applicationRepo = new ApplicationRepository();

const createUseCase = require('../../../usecase/project/create')(projectRepo);
const paginateUseCase = require('../../../usecase/project/paginate')(projectRepo, applicationRepo);
const deleteUseCase = require('../../../usecase/project/delete')(projectRepo);
const updateUseCase = require('../../../usecase/project/update')(projectRepo);
const getUseCase = require('../../../usecase/project/get')(projectRepo);
const upsertUseCase = require('../../../usecase/project/upsert')(projectRepo, applicationRepo);

const project = require('./project');

const create = project.create({ createUseCase });
const paginate = project.paginate({ paginateUseCase });
const update = project.update({ updateUseCase });
const destroy = project.destroy({ deleteUseCase });
const get = project.get({ getUseCase });
const upsert = project.upsert({ upsertUseCase });
const applicationRestriction = project.applicationRestriction({});

module.exports = {
  create,
  paginate,
  update,
  destroy,
  get,
  upsert,
  applicationRestriction,
};
