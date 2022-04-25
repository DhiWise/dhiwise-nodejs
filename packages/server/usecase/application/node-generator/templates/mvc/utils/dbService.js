/*
 * @description : create any mongoose document
 * @param  {object} model : mongoose model
 * @param  {object} data : {}
 * @return Promise
 */
const createDocument = (model, data) => new Promise((resolve, reject) => {
  model.create(data, (err, result) => {
    if (err) reject(err);
    else resolve(result);
  });
});

/*
 * @description : update any existing mongoose document
 * @param  {object} model : mongoose model
 * @param {ObjectId} id : mongoose document's _id
 * @param {object} data : {}
 * @return Promise
 */
const updateDocument = (model, id, data) => new Promise((resolve, reject) => {
  model.updateOne({ _id: id }, data, {
    runValidators: true,
    context: 'query',
  }, (err, result) => {
    if (err) reject(err);
    else resolve(result);
  });
});

/*
 * @description : delete any existing mongoose document
 * @param  {object} model : mongoose model
 * @param  {ObjectId} id : mongoose document's _id
 * @return Promise
 */
const deleteDocument = (model, id) => new Promise((resolve, reject) => {
  model.deleteOne({ _id: id }, (err, data) => {
    if (err) reject(err);
    else resolve(data);
  });
});

/*
 * @description : find all the mongoose document
 * @param  {object} model : mongoose model
 * @param {object} query : {}
 * @param {object} options : {}
 * @return Promise
 */
const getAllDocuments = (model, query, options) => new Promise((resolve, reject) => {
  model.paginate(query, options, (err, data) => {
    if (err) reject(err);
    else resolve(data);
  });
});

/*
 * @description : find single mongoose document
 * @param  {object} model : mongoose model
 * @param  {ObjectId} id : mongoose document's _id
 * @param  {Array} select : [] *optional
 * @return Promise
 */
const getSingleDocumentById = (model, id, select = []) => new Promise((resolve, reject) => {
  model.findOne({ _id: id }, select, (err, data) => {
    if (err) reject(err);
    else resolve(data);
  });
});

/*
 * @description : find existing mongoose document
 * @param  {object} model  : mongoose model
 * @params {object} data   : {
 *                   "query":{
 *                       "and":[{"Name":"Dhiraj"},{"Salary":300}],
 *                        "or":[{"Name":"Dhiraj"},{"Salary":300}]
 *                   }
 * }
 * @return Promise
 */
const findExistsData = (model, data) => {
  // let { model } = data;
  const { query } = data;
  const { and } = query;
  const { or } = query;
  const q = {};

  if (and) {
    q.$and = [];
    for (let index = 0; index < and.length; index += 1) {
      q.$and.push(and[index]);
    }
  }
  if (or) {
    q.$or = [];
    for (let index = 0; index < or.length; index += 1) {
      q.$or.push(or[index]);
    }
  }

  return new Promise((resolve, reject) => {
    model.find(q, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

/*
 * @description : soft delete ( partially delete ) mongoose document
 * @param  {object} model : mongoose model
 * @param  {ObjectId} id : mongoose document's _id
 * @return Promise
 */
// eslint-disable-next-line no-async-promise-executor
const softDeleteDocument = (model, id) => new Promise(async (resolve, reject) => {
  const result = await getSingleDocumentById(model, id);
  result.isDeleted = true;
  model.updateOne({ _id: id }, result, (err, data) => {
    if (err) reject(err);
    else resolve(data);
  });
});

/*
 * bulkInsert     : create document in bulk mongoose document
 * @param  {object} model  : mongoose model
 * @param  {object} data   : {}
 * @return Promise
 */
const bulkInsert = (model, data) => new Promise((resolve, reject) => {
  model.insertMany(data, (err, result) => {
    if (result !== undefined && result.length > 0) {
      resolve(result);
    } else {
      reject(err);
    }
  });
});

/*
 * @description     : update existing document in bulk mongoose document
 * @param  {object} model  : mongoose model
 * @param  {object} filter : {}
 * @param  {object} data   : {}
 * @return Promise
 */
const bulkUpdate = (model, filter, data) => new Promise((resolve, reject) => {
  model.updateMany(filter, data, (err, result) => {
    if (result !== undefined) {
      resolve(result);
    } else {
      reject(err);
    }
  });
});

/*
 * @description : count total number of records in particular model
 * @param  {object} model : mongoose model
 * @param {object} where  : {}
 * @return Promise
 */
const countDocument = (model, where) => new Promise((resolve, reject) => {
  model.where(where).countDocuments((err, result) => {
    if (result !== undefined) {
      resolve(result);
    } else {
      reject(err);
    }
  });
});

/*
 * @description : find document by dynamic query
 * @param  {object} model : mongoose model
 * @param  {object} where : {}
 * @param  {Array} select : [] *optional
 */
const getDocumentByQuery = (model, where, select = []) => new Promise((resolve, reject) => {
  model.findOne(where, select, (err, data) => {
    if (err) reject(err);
    else resolve(data);
  });
});

/*
 * @description : find existing document and update mongoose document
 * @param  {object} model   : mongoose model
 * @param  {object} filter  : {}
 * @param  {object} data    : {}
 * @param  {object} options : {} *optional
 * @return Promise
 */
const findOneAndUpdateDocument = (model, filter, data, options = { new: true }) => new Promise((resolve, reject) => {
  model.findOneAndUpdate(filter, data, options, (err, result) => {
    if (err) reject(err);
    else resolve(result);
  });
});

/*
 * @description : find existing document and delete mongoose document
 * @param  {object} model  : mongoose model
 * @param  {object} filter  : {}
 * @param  {object} options : {} *optional
 * @return Promise
 */
const findOneAndDeleteDocument = (model, filter, options = { new: true }) => new Promise((resolve, reject) => {
  model.findOneAndDelete(filter, options, (err, data) => {
    if (err) reject(err);
    else resolve(data);
  });
});

/*
 * @description : delete multiple document
 * @param  {object} model  : mongoose model
 * @param  {object} filter  : {}
 * @param  {object} options : {} *optional
 * @return Promise
 */
const deleteMany = (model, filter, options = {}) => new Promise((resolve, reject) => {
  model.deleteMany(filter, options, (err, data) => {
    if (err) reject(err);
    else resolve(data);
  });
});

/*
 * @description : find all the mongoose document
 * @param  {Object} model   : mongoose model
 * @param {Object} query    : {}
 * @param {Object} options  : {}
 * @return Promise
 */
const findAllDocuments = (model, filter = {}, options = {}) => new Promise((resolve, reject) => {
  let query = model.find(filter);
  if (options.select) {
    query = query.select(options.select);
  }
  if (options.populate) {
    query = query.populate(options.populate);
  }
  if (options.lean) {
    query = query.lean();
  }
  query.exec((error, data) => {
    if (error) reject(error);
    else resolve(data);
  });
});

module.exports = {
  createDocument,
  getAllDocuments,
  updateDocument,
  deleteDocument,
  getSingleDocumentById,
  findExistsData,
  softDeleteDocument,
  bulkInsert,
  bulkUpdate,
  countDocument,
  getDocumentByQuery,
  findOneAndUpdateDocument,
  findOneAndDeleteDocument,
  deleteMany,
  findAllDocuments,
};
