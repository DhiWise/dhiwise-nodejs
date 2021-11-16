const MongoAtlasRepository = require('../models/Repo');
const { MODULE } = require('../models/constants/common');

class envVariables extends MongoAtlasRepository {
  constructor () {
    super(MODULE.ENV_VARIABLES);
  }
}

module.exports = envVariables;
