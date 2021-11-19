const ApplicationConfigRepository = require('../../../repo/applicationConfig');
const ApplicationRepository = require('../../../repo/application');

const applicationRepo = new ApplicationRepository();
const applicationConfigRepo = new ApplicationConfigRepository();

const createUseCase = require('../../../usecase/applicationConfig/create')(applicationConfigRepo, applicationRepo);
const paginateUseCase = require('../../../usecase/applicationConfig/paginate')(applicationConfigRepo);
const deleteUseCase = require('../../../usecase/applicationConfig/delete')(applicationConfigRepo, applicationRepo);
const updateUseCase = require('../../../usecase/applicationConfig/update')(applicationConfigRepo, applicationRepo);
const getUseCase = require('../../../usecase/applicationConfig/get')(applicationConfigRepo);

const applicationConfig = require('./applicationConfig');

const create = applicationConfig.create({ createUseCase });
const paginate = applicationConfig.paginate({ paginateUseCase });
const update = applicationConfig.update({ updateUseCase });
const destroy = applicationConfig.destroy({ deleteUseCase });
const get = applicationConfig.get({ getUseCase });

module.exports = {
  create,
  paginate,
  update,
  destroy,
  get,
};
