const MongoAtlasRepository = require('../models/Repo');
const { MODULE } = require('../models/constants/common');

class QueryBuilderRepository extends MongoAtlasRepository {
  constructor () {
    super(MODULE.QUERY_BUILDER);
  }
}

module.exports = QueryBuilderRepository;
