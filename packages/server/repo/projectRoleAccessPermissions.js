const { MODULE } = require('../models/constants/common');
const CommonQueryRepository = require('../models/Repo');

class ProjectRoleAccessPermissionsRepository extends CommonQueryRepository {
  constructor () {
    super(MODULE.PROJECT_ROLE_ACCESS_PERMISSIONS);
  }
}
module.exports = ProjectRoleAccessPermissionsRepository;
