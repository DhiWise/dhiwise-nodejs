const MongoAtlasRepository = require('../models/Repo');

class DbRepository extends MongoAtlasRepository {
  constructor (MODULE_DATA) {
    super();
    this.table = MODULE_DATA.MODEL_NAME;
    this.module = MODULE_DATA;
  }

  async getById (options) {
    const result = await super.getById(this.module, options);
    return result;
  }

  // Revised function with Response object

  async getDetails (filter) {
    const result = await super.getDetails(this.module, filter);
    if (result.error) {
      throw new Error(result.error);
    }
    return result;
  }

  async get (filter) {
    const result = await super.getOne(this.module, filter);
    if (result && result.error) {
      throw new Error(result.error);
    }
    return result;
  }

  async create (data) {
    const result = await super.create(this.module, data);
    if (result.error) {
      throw new Error(result.error);
    }
    return result;
  }

  async update (id, data) {
    const result = await super.updateById(this.module, id, data);
    if (result.error) {
      throw new Error(result.error);
    }
    return result;
  }

  async deleteById (userId) {
    const result = await super.deleteById(this.module, userId);
    if (result.error) {
      throw new Error(result.error);
    }
    return result;
  }

  async getCount (filter) {
    const result = await super.getCount(this.module, filter);
    if (result.error) {
      throw new Error(result.error);
    }
    return result;
  }

  async search (filter) {
    const model = await this.multiTenancy(this.table);
    const result = await model.findOne({ $or: [{ username: filter.search }, { seriesNo: filter.search }] }).select(filter.fields).populate(filter.populate);
    if (result && result.error) {
      throw new Error(result.error);
    }
    return result;
  }

  async deleteMany (filter) {
    const result = await super.deleteMany(this.module, filter);
    if (result.error) {
      throw new Error(result.error);
    }
    return result;
  }
}

module.exports = DbRepository;
