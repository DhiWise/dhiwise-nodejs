/* eslint-disable import/no-unresolved */
const { Op } = require('sequelize');

const OPERATORS = ['and', 'or', 'like', 'in', 'eq', 'gt', 'lt', 'gte', 'lte', 'any', 'between'];

const createOne = async (model, data) => {
  const result = await model.create(data);
  return result;
};

const createMany = async (model, data) => {
  if (data && data.length > 0) {
    const result = await model.bulkCreate(data);
    return result;
  }
  throw new Error('send array as input in create many method');
};

const updateByPk = async (model, pk, data) => {
  let result = await model.update(data, {
    returning: true,
    where: { [model.primaryKeyField]: pk },
  });
  if (result) {
    result = await model.findOne({ where: { [model.primaryKeyField]: pk } });
  }
  return result;
};

const updateMany = async (model, query, data) => {
  const result = await model.update(data, {
    returning: true,
    where: query,
  });
  return result;
};

const deleteByPk = async (model, pk) => {
  const result = await model.destroy({ where: { [model.primaryKeyField]: pk } });
  return result;
};

const deleteMany = async (model, query) => {
  const result = await model.destroy({ where: query });
  return result;
};

const findOne = async (model, query, options = {}) => {
  const result = await model.findOne({
    where: query,
    ...options,
  });
  return result;
};

const findMany = async (model, query, options = {}) => {
  options = {
    where: { ...query },
    ...options,
  };
  const result = await model.paginate(options);
  const data = {
    data: result.docs,
    paginator: {
      itemCount: result.total,
      perPage: options.paginate || 25,
      pageCount: result.pages,
      currentPage: options.page || 1,
    },
  };
  return data;
};

const findAllRecords = async (model, query, options = {}) => {
  options = {
    where: { ...query },
    ...options,
  };
  const result = await model.findAll(options);
  return result;
};

const softDeleteByPk = async (model, pk, options = {}) => {
  const result = await model.update(
    { isDeleted: true },
    {
      fields: ['isDeleted'],
      where: { [model.primaryKeyField]: pk },
      ...options,
    },
  );
  return result;
};

const softDeleteMany = async (model, query, options = {}, loggedInUserId) => {
  let result;
  if (loggedInUserId !== undefined) {
    result = await model.update(
      {
        isDeleted: true,
        updatedBy: loggedInUserId,
      },
      {
        fields: ['isDeleted'],
        where: query,
        ...options,
      },
    );
  } else {
    result = await model.update(
      { isDeleted: true },
      {
        fields: ['isDeleted'],
        where: query,
        ...options,
      },
    );
  }
  return result;
};

const count = async (model, query, options = {}) => {
  const result = await model.count({
    where: query,
    ...options,
  });
  return result;
};

const findByPk = async (model, param, options = {}) => {
  const result = await model.findByPk(param, options);
  return result;
};

const upsert = async (model, data, options = {}) => {
  const result = await model.upsert(data, options);
  return result;
};

const queryBuilderParser = (data) => {
  if (data) {
    Object.entries(data).forEach(([key]) => {
      if (typeof data[key] === 'object') {
        queryBuilderParser(data[key]);
      }
      if (OPERATORS.includes(key)) {
        data[Op[key]] = data[key];
        delete data[key];
      } else if (key === 'neq') {
        data[Op.not] = data[key];
        delete data[key];
      } else if (key === 'nin') {
        data[Op.notIn] = data[key];
        delete data[key];
      }
    });
  }

  return data;
};

const sortParser = (input) => {
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
};

module.exports = {
  createOne,
  createMany,
  updateByPk,
  updateMany,
  findOne,
  findMany,
  findByPk,
  deleteByPk,
  deleteMany,
  softDeleteByPk,
  count,
  softDeleteMany,
  upsert,
  queryBuilderParser,
  sortParser,
  findAllRecords,
};
