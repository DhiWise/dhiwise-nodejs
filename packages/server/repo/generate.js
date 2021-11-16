const { MODULE } = require('../models/constants/common');
const MongoAtlasRepository = require('../models/Repo');

class SchemaRepository extends MongoAtlasRepository {
  constructor () {
    super(MODULE.GENERATOR);
  }
}

module.exports = SchemaRepository;
