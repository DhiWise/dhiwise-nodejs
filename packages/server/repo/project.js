const { MODULE } = require('../models/constants/common');
const CommonQueryRepository = require('../models/Repo');

class ProjectRepository extends CommonQueryRepository {
  constructor () {
    super(MODULE.PROJECT);
  }
}
module.exports = ProjectRepository;
