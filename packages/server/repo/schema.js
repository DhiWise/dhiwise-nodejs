const MongoAtlasRepository = require('../models/Repo');
const { MODULE } = require('../models/constants/common');

class SchemaRepository extends MongoAtlasRepository {
  constructor () {
    super(MODULE.SCHEMA);
  }
}

module.exports = SchemaRepository;
