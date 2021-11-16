const { MODULE } = require('../models/constants/common');
const CommonQueryRepository = require('../models/Repo');

class ApplicationConfigRepository extends CommonQueryRepository {
  constructor () {
    super(MODULE.APPLICATION_CONFIG);
  }
}
module.exports = ApplicationConfigRepository;
