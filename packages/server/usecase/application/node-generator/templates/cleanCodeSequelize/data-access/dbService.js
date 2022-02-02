/* eslint-disable */
const { Op } = require('sequelize');
const models = require('./models');

const OPERATORS = ['$and', '$or', '$like', '$in', '$eq', '$gt', '$lt', '$gte', '$lte', '$any', '$between'];

module.exports = function sequelizeDbService (Model) {
  function queryBuilderParser (data) {
    if (data) {
      Object.entries(data).forEach(([key]) => {
        if (typeof data[key] === 'object') {
          queryBuilderParser(data[key]);
        }
        if (OPERATORS.includes(key)) {
          const opKey = key.replace('$', '');
          data[Op[opKey]] = data[key];
          delete data[key];
        } else if (key === '$ne') {
          data[Op.not] = data[key];
          delete data[key];
        } else if (key === '$nin') {
          data[Op.notIn] = data[key];
          delete data[key];
        }
      });
    }
    return data;
  }

  function sortParser (input) {
    const newSortedObject = [];
    if (input) {
      Object.entries(input).forEach(([key, value]) => {
        if (value === 1) {
          newSortedObject.push([key, 'ASC']);
        } else if (value === -1) {
          newSortedObject.push([key, 'DESC']);
        }
      });
    }
    return newSortedObject;
  }

  const create = async (data) => Model.create(data);

  const createMany = async (data) => Model.bulkCreate(data);

  const updateOne = async (filter, data) => {
    filter = queryBuilderParser(filter);
    const recordToUpdate = await Model.findOne({ where: filter });
    const query = { [Model.primaryKeyField]: recordToUpdate[Model.primaryKeyField] };
    await Model.update(data, { where: query });
    return Model.findOne({ where: filter });
  };

  const updateMany = async (filter, data) => {
    filter = queryBuilderParser(filter);
    const [noOfUpdatedRecords] = await Model.update(data, { where: filter });
    if (noOfUpdatedRecords > 0) {
      return Model.findAll({ where: filter });
    }
    return null;
  };

  const deleteOne = async (filter, options = {}) => {
    filter = queryBuilderParser(filter);
    const recordToDelete = await Model.findOne({ where: filter });
    const query = { [Model.primaryKeyField]: recordToDelete[Model.primaryKeyField] };
    return Model.destroy({
      where: query,
      ...options,
    });
  };

  const deleteMany = async (filter, options = {}) => {
    filter = queryBuilderParser(filter);
    const noOfDeletedRecords = await Model.destroy(filter, options);
    return noOfDeletedRecords;
  };

  const softDelete = async (filter, data = { isDeleted: true }) => {
    filter = queryBuilderParser(filter);
    const recordToUpdate = await Model.findOne({ where: filter });

    const query = { [Model.primaryKeyField]: recordToUpdate[Model.primaryKeyField] };
    await Model.update(data, { where: query });
    return Model.findOne({ where: query });
  };

  const softDeleteMany = async (filter) => {
    filter = queryBuilderParser(filter);
    return Model.update({ isDeleted: true }, {
      where: filter,
      returning: true,
    });
  };

  const findOne = async (filter, options = {}) => {
    filter = queryBuilderParser(filter);
    if (options && options.select && options.select.length) {
      options.attributes = options.select;
      delete options.select;
    }
    if (options && options.include && options.include.length) {
      const include = [];
      options.include.forEach((i) => {
        i.model = models[i.model];
        if (i.query) {
          i.where = queryBuilderParser(i.query);
        }
        include.push(i);
      });
      options.include = include;
    }
    options = {
      where: filter,
      ...options,
    };
    return Model.findOne(options);
  };

  const findMany = async (filter, options = {}) => {
    filter = queryBuilderParser(filter);
    if (options && options.select && options.select.length) {
      options.attributes = options.select;
    }
    if (options && options.sort) {
      options.order = sortParser(options.sort);
      delete options.sort;
    }
    if (options && options.include && options.include.length) {
      const include = [];
      options.include.forEach((i) => {
        i.model = models[i.model];
        if (i.query) {
          i.where = queryBuilderParser(i.query);
        }
        include.push(i);
      });
      options.include = include;
    }
    options = {
      where: filter,
      ...options,
    };
    return Model.findAll(options);
  };

  const paginate = async (filter, options = {}) => {
    filter = queryBuilderParser(filter);
    if (options && options.sort) {
      options.order = sortParser(options.sort);
      delete options.sort;
    }
    if (options && options.include && options.include.length) {
      const include = [];
      options.include.forEach((i) => {
        i.model = models[i.model];
        if (i.query) {
          i.where = queryBuilderParser(i.query);
        }
        include.push(i);
      });
      options.include = include;
    }
    options = {
      where: filter,
      ...options,
    };
    return Model.paginate(options);
  };

  const count = async (filter, options = {}) => {
    filter = queryBuilderParser(filter);
    options = {
      where: filter,
      ...options,
    };
    return Model.count(options);
  };

  const upsert = async (data, options = {}) => Model.upsert(data, options);

  return Object.freeze({
    create,
    createMany,
    updateOne,
    updateMany,
    deleteOne,
    deleteMany,
    softDelete,
    softDeleteMany,
    findOne,
    findMany,
    paginate,
    count,
    upsert,

  });
};
