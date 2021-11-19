const MongoAtlasRepository = require('../models/Repo');
const { MODULE } = require('../models/constants/common');

class DataTypeSuggestionsRepository extends MongoAtlasRepository {
  constructor () {
    super(MODULE.DATATYPE_SUGGESTIONS);
  }
}

module.exports = DataTypeSuggestionsRepository;
