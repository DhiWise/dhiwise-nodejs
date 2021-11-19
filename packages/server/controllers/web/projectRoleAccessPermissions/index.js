const ProjectRoleAccessPermissionsRepository = require('../../../repo/projectRoleAccessPermissions');

const projectRoleAccessPermissionsRepo = new ProjectRoleAccessPermissionsRepository();

const upsertUseCase = require('../../../usecase/projectRoleAccessPermissions/upsert')(projectRoleAccessPermissionsRepo);
const paginateUseCase = require('../../../usecase/projectRoleAccessPermissions/paginate')(projectRoleAccessPermissionsRepo);
const destroyUseCase = require('../../../usecase/projectRoleAccessPermissions/delete')(projectRoleAccessPermissionsRepo);

const roleAccessPermissions = require('./roleAccessPermissions');

const upsert = roleAccessPermissions.upsert({ upsertUseCase });
const paginate = roleAccessPermissions.paginate({ paginateUseCase });
const destroy = roleAccessPermissions.destroy({ destroyUseCase });

module.exports = {
  upsert,
  paginate,
  destroy,
};
