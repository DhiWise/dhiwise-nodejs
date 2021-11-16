const { MODULE } = require('../models/constants/common');
const CommonQueryRepository = require('../models/Repo');

class ProjectRouteRepository extends CommonQueryRepository {
  constructor () {
    super(MODULE.PROJECT_ROUTE);
  }
}
module.exports = ProjectRouteRepository;
