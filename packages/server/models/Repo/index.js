const mongoose = require('mongoose');
const MongoAtlasRepository = require('./Connection');

class CommonQueryRepository extends MongoAtlasRepository {
  constructor (model) {
    super(model);
    this.model = mongoose.model(model.MODEL_NAME);
  }

  async getById (options) {
    const result = await super.getById(options);
    return result;
  }

  // Revised function with Response object

  async getDetails (filter) {
    const result = await super.getDetails(filter);
    if (result?.error) {
      throw new Error(result.error);
    }
    return result;
  }

  async get (filter) {
    const result = await super.getOne(filter);
    if (result && result?.error) {
      throw new Error(result.error);
    }
    return result;
  }

  async create (data) {
    const result = await super.create(data);
    if (result?.error) {
      throw new Error(result.error);
    }
    return result;
  }

  async update (id, data) {
    const result = await super.updateById(id, data);
    if (result?.error) {
      throw new Error(result.error);
    }
    return result;
  }

  async deleteById (userId) {
    const result = await super.deleteById(userId);
    if (result?.error) {
      throw new Error(result.error);
    }
    return result;
  }

  async getCount (filter) {
    const result = await super.getCount(filter);
    if (result?.error) {
      throw new Error(result.error);
    }
    return result;
  }

  async search (filter) {
    const result = await this.model.findOne({ $or: [{ username: filter.search }, { seriesNo: filter.search }] }).select(filter.fields).populate(filter.populate);
    if (result && result?.error) {
      throw new Error(result.error);
    }
    return result;
  }

  async deleteMany (filter) {
    const result = await super.deleteMany(filter);
    if (result?.error) {
      throw new Error(result.error);
    }
    return result;
  }

  async updateMany (filter) {
    const result = await super.updateMany(filter);
    if (result?.error) {
      throw new Error(result.error);
    }
    return result;
  }

  async insertMany (data) {
    const result = await super.insertMany(data);
    if (result?.error) {
      throw new Error(result.error);
    }
    return result;
  }

  async rawUpdateMany (filter) {
    const result = await super.rawUpdateMany(filter);
    if (result?.error) {
      throw new Error(result.error);
    }
    return result;
  }

  async aggregate (options) {
    const result = await super.aggregate(options);
    if (result?.error) {
      throw new Error(result.error);
    }
    return result;
  }

  async updateOne (filter, data) {
    const result = await super.updateOne(filter, data);
    if (result?.error) {
      throw new Error(result.error);
    }
    return result;
  }

  async getAll (filter) {
    const result = await super.getAll(filter);
    if (result?.error) {
      throw new Error(result.error);
    }
    return result;
  }
}

module.exports = CommonQueryRepository;
