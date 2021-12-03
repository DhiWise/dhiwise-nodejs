const ApplicationRepository = require('../../../repo/application');
const SchemaRepository = require('../../../repo/schema');
const GenerateRepository = require('../../../repo/generate');
const ProjectRepository = require('../../../repo/project');

const applicationRepo = new ApplicationRepository();
const schemaRepo = new SchemaRepository();
const generateRepo = new GenerateRepository();
const projectRepo = new ProjectRepository();

const createUseCase = require('../../../usecase/application/create')(applicationRepo, schemaRepo, projectRepo);
const paginateUseCase = require('../../../usecase/application/paginate')(applicationRepo);
const generateUseCase = require('../../../usecase/application/generate')(applicationRepo, schemaRepo, generateRepo);
const structureUseCase = require('../../../usecase/application/structure')(applicationRepo, schemaRepo, generateRepo, projectRepo);
const deleteUseCase = require('../../../usecase/application/delete')(applicationRepo, schemaRepo, generateRepo);
const updateUseCase = require('../../../usecase/application/update')(applicationRepo, schemaRepo, generateRepo);
const getUseCase = require('../../../usecase/application/get')(applicationRepo);
const upsertUseCase = require('../../../usecase/application/upsert')(applicationRepo, projectRepo);
// eslint-disable-next-line max-len
const viewUseCase = require('../../../usecase/application/view')(applicationRepo, projectRepo);
// eslint-disable-next-line max-len
const openCodeUseCase = require('../../../usecase/application/openCode')();
const getLastApplicationUseCase = require('../../../usecase/application/getLastApplication')(applicationRepo);
const application = require('./application');

const create = application.create({ createUseCase });
const paginate = application.paginate({ paginateUseCase });
const generate = application.generate({ generateUseCase });
const structure = application.structure({ structureUseCase });
const update = application.update({ updateUseCase });
const get = application.get({ getUseCase });
const destroy = application.destroy({ deleteUseCase });
const upsert = application.upsert({ upsertUseCase });
const view = application.view({ viewUseCase });
const openCode = application.openCode({ openCodeUseCase });
const getLastApplication = application.getLastApplication({ getLastApplicationUseCase });

module.exports = {
  create,
  paginate,
  generate,
  structure,
  update,
  destroy,
  upsert,
  view,
  get,
  openCode,
  getLastApplication,
};
