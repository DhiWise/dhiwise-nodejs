/*
 * createDocument : create any mongoose document
 * @param  model  : mongoose model
 * @param  data   : {}
 */
const createDocument = (model, data) => new Promise((resolve, reject) => {
  model.create(data, (err, result) => {
    if (err) reject(err);
    else resolve(result);
  });
});

/*
 * updateDocument : update any existing mongoose document
 * @param  model  : mongoose model
 * @param id      : mongoose document's _id
 * @param data    : {}
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
 * deleteDocument : delete any existing mongoose document
 * @param  model  : mongoose model
 * @param  id     : mongoose document's _id
 */
const deleteDocument = (model, id) => new Promise((resolve, reject) => {
  model.deleteOne({ _id: id }, (err, data) => {
    if (err) reject(err);
    else resolve(data);
  });
});

/*
 * getAllDocuments : find all the mongoose document
 * @param  model   : mongoose model
 * @param query    : {}
 * @param options  : {}
 */
const getAllDocuments = (model, query, options) => new Promise((resolve, reject) => {
  model.paginate(query, options, (err, data) => {
    if (err) reject(err);
    else resolve(data);
  });
});

/*
 * getSingleDocumentById : find single mongoose document
 * @param  model  : mongoose model
 * @param  id     : mongoose document's _id
 * @param  select : [] *optional
 */
const getSingleDocumentById = (model, id, select = []) => new Promise((resolve, reject) => {
  model.findOne({ _id: id }, select, (err, data) => {
    if (err) reject(err);
    else resolve(data);
  });
});

/*
 * findExistsData : find existing mongoose document
 * @param  model  : mongoose model
 * @params data   : {
 *                   "query":{
 *                       "and":[{"Name":"Dhiraj"},{"Salary":300}],
 *                        "or":[{"Name":"Dhiraj"},{"Salary":300}]
 *                   }
 * }
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
 * softDeleteDocument : soft delete ( partially delete ) mongoose document
 * @param  model      : mongoose model
 * @param  id         : mongoose document's _id
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
 * @param  model  : mongoose model
 * @param  data   : {}
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
 * bulkInsert     : update existing document in bulk mongoose document
 * @param  model  : mongoose model
 * @param  filter : {}
 * @param  data   : {}
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
 * countDocument : count total number of records in particular model
 * @param  model : mongoose model
 * @param where  : {}
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
 * getDocumentByQuery : find document by dynamic query
 * @param  model      : mongoose model
 * @param  where      : {}
 * @param  select     : [] *optional
 */
const getDocumentByQuery = (model, where, select = []) => new Promise((resolve, reject) => {
  model.findOne(where, select, (err, data) => {
    if (err) reject(err);
    else resolve(data);
  });
});

/*
 * findOneAndUpdateDocument : find existing document and update mongoose document
 * @param  model   : mongoose model
 * @param  filter  : {}
 * @param  data    : {}
 * @param  options : {} *optional
 */
const findOneAndUpdateDocument = (model, filter, data, options = {}) => new Promise((resolve, reject) => {
  model.findOneAndUpdate(filter, data, options, (err, result) => {
    if (err) reject(err);
    else resolve(result);
  });
});

/*
 * findOneAndDeleteDocument : find existing document and delete mongoose document
 * @param  model  : mongoose model
 * @param  filter  : {}
 * @param  options : {} *optional
 */
const findOneAndDeleteDocument = (model, filter, options = {}) => new Promise((resolve, reject) => {
  model.findOneAndDelete(filter, options, (err, data) => {
    if (err) reject(err);
    else resolve(data);
  });
});

/*
 * deleteMany : delete multiple document
 * @param  model  : mongoose model
 * @param  filter  : {}
 * @param  options : {} *optional
 */
const deleteMany = (model, filter, options = {}) => new Promise((resolve, reject) => {
  model.deleteMany(filter, options, (err, data) => {
    if (err) reject(err);
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
};
