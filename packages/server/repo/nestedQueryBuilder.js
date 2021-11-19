const MongoAtlasRepository = require('../models/Repo');
const { MODULE } = require('../models/constants/common');

class NestedQueryBuilderRepository extends MongoAtlasRepository {
  constructor () {
    super(MODULE.NESTED_QUERY_BUILDER);
  }
}

module.exports = NestedQueryBuilderRepository;
