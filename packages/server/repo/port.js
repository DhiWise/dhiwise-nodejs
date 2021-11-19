const { MODULE } = require('../models/constants/common');
const CommonQueryRepository = require('../models/Repo');

class PortRepository extends CommonQueryRepository {
  constructor () {
    super(MODULE.PORT);
  }
}
module.exports = PortRepository;
