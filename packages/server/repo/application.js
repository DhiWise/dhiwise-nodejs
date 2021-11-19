const MongoAtlasRepository = require('../models/Repo');
const { MODULE } = require('../models/constants/common');

class ProjectRepository extends MongoAtlasRepository {
  constructor () {
    super(MODULE.APPLICATION);
  }
}

module.exports = ProjectRepository;
