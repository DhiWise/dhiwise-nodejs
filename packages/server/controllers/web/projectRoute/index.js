const ProjectRouteRepository = require('../../../repo/projectRoute');
const ApplicationRepository = require('../../../repo/application');

const applicationRepo = new ApplicationRepository();
const projectRouteRepo = new ProjectRouteRepository();

const createUseCase = require('../../../usecase/projectRoute/create')(projectRouteRepo, applicationRepo);
const paginateUseCase = require('../../../usecase/projectRoute/paginate')(projectRouteRepo);
const deleteUseCase = require('../../../usecase/projectRoute/delete')(projectRouteRepo, applicationRepo);
const updateUseCase = require('../../../usecase/projectRoute/update')(projectRouteRepo, applicationRepo);
const uploadPostmanFileUseCase = require('../../../usecase/projectRoute/uploadPostmanFile')(projectRouteRepo, applicationRepo);

const requestApiUseCase = require('../../../usecase/projectRoute/requestApi')();

const projectRoute = require('./projectRoute');

const create = projectRoute.create({ createUseCase });
const paginate = projectRoute.paginate({ paginateUseCase });
const update = projectRoute.update({ updateUseCase });
const destroy = projectRoute.destroy({ deleteUseCase });
const uploadPostmanFile = projectRoute.uploadPostmanFile({ uploadPostmanFileUseCase });
const requestApi = projectRoute.requestApi({ requestApiUseCase });

module.exports = {
  create,
  paginate,
  update,
  destroy,
  uploadPostmanFile,
  requestApi,
};
