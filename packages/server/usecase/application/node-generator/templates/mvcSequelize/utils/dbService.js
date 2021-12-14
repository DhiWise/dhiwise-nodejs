/**
 * dbService.js
 * @description: exports all database related methods
 */
/* eslint-disable import/no-unresolved */
const { Op } = require('sequelize');

const OPERATORS = ['and', 'or', 'like', 'in', 'eq', 'gt', 'lt', 'gte', 'lte', 'any', 'between'];

/*
 * @description : create any record in database
 * @param  {obj} model : sequelize model
 * @param  {obj} data : {}
 * @return {obj} result : database result
 */
const createOne = async (model, data) => {
  const result = await model.create(data);
  return result;
};

/*
 * @description : create many records in database
 * @param  {obj} model : sequelize model
 * @param  {obj} data : {}
 * @param {obj} options : {}
 * @return {obj} result : database result
 */
const createMany = async (model, data) => {
  if (data && data.length > 0) {
    const result = await model.bulkCreate(data);
    return result;
  }
  throw new Error('send array as input in create many method');
};

/*
 * @description : update record in database by id
 * @param  {obj} model : sequelize model
 * @param  {*} pk : primary field of table
 * @param {obj} data : {}
 * @param {obj} options : {}
 * @return {obj} result : database result
 */
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

/*
 * @description : update many records in database by query
 * @param  {obj} model : sequelize model
 * @param  {*} pk : primary field of table
 * @param {obj} data : {}
 * @param {obj} options : {}
 * @return {obj} result : database result
 */
const updateMany = async (model, query, data) => {
  const result = await model.update(data, {
    returning: true,
    where: query,
  });
  return result;
};

/*
 * @description : delete any record in database by primary key
 * @param  {obj} model : sequelize model
 * @param  {*} pk : primary field of table
 * @return {obj} result : database result
 */
const deleteByPk = async (model, pk) => {
  const result = await model.destroy({ where: { [model.primaryKeyField]: pk } });
  return result;
};

/*
 * @description : delete many record in database by query
 * @param  {obj} model : sequelize model
 * @param  {obj} query : {}
 * @return {obj} result : database result
 */
const deleteMany = async (model, query) => {
  const result = await model.destroy({ where: query });
  return result;
};

/*
 * @description : find single record from table by query
 * @param  {obj} model : sequelize model
 * @param  {obj} query : {}
 * @param {obj} options : {}
 * @return {obj} result : database result
 */
const findOne = async (model, query, options = {}) => {
  const result = await model.findOne({
    where: query,
    ...options,
  });
  return result;
};

/*
 * @description : find multiple records from table by query
 * @param  {obj} model : sequelize model
 * @param  {obj} query : {}
 * @param {obj} options : {}
 * @return {obj} result : database result
 */
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

/*
 * @description : find all records from table
 * @param  {obj} model : sequelize model
 * @param  {obj} query : {}
 * @param {obj} options : {}
 * @return {obj} result : database result
 */
const findAllRecords = async (model, query, options = {}) => {
  options = {
    where: { ...query },
    ...options,
  };
  const result = await model.findAll(options);
  return result;
};

/*
 * @description : deactivate record by primary key
 * @param  {obj} model : sequelize model
 * @param  {*} pk : primary key field
 * @param {obj} options : {}
 * @return {obj} result : database result
 */
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

/*
 * @description : deactivate records by query
 * @param  {obj} model : sequelize model
 * @param  {obj} query : {}
 * @param  {obj} data : {}
 * @param {obj} options : {}
 * @return {obj} result : database result
 */
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

/*
 * @description : count total records from table by query
 * @param  {obj} model : sequelize model
 * @param  {obj} query : {}
 * @param {obj} options : {}
 * @return {obj} result : database result
 */
const count = async (model, query, options = {}) => {
  const result = await model.count({
    where: query,
    ...options,
  });
  return result;
};

/*
 * @description : get record by primary key
 * @param  {obj} model : sequelize model
 * @param  {obj} param : {}
 * @param {obj} options : {}
 * @return {obj} result : database result
 */
const findByPk = async (model, param, options = {}) => {
  const result = await model.findByPk(param, options);
  return result;
};

/*
 * @description : upsert record in database
 * @param  {obj} model : sequelize model
 * @param  {obj} param : {}
 * @param {obj} options : {}
 * @return {obj} result : database result
 */
const upsert = async (model, data, options = {}) => {
  const result = await model.upsert(data, options);
  return result;
};

/*
 * @description : parser for query builder
 * @param  {obj} data : {}
 * @return {obj} data : query
 */
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

/*
 * @description : parser for query builder of sort
 * @param  {obj} input : {}
 * @return {obj} data : query
 */
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
