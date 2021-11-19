const { MODULE } = require('../models/constants/common');
const CommonQueryRepository = require('../models/Repo');

class ProjectCronRepository extends CommonQueryRepository {
  constructor () {
    super(MODULE.PROJECT_POLICY);
  }
}
module.exports = ProjectCronRepository;
