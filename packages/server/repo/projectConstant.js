const { MODULE } = require('../models/constants/common');
const CommonQueryRepository = require('../models/Repo');

class ProjectConstantRepository extends CommonQueryRepository {
  constructor () {
    super(MODULE.PROJECT_CONSTANT);
  }
}
module.exports = ProjectConstantRepository;
