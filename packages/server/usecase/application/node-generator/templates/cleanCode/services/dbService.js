/* eslint-disable */
function makeMongoDbService({ model }) {
  const createDocument = (data) => new Promise((resolve, reject) => {
    model.create(data, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });

  const updateDocument = (id, data) => {
    const newData = { ...data };
    delete newData.id;
    return new Promise((resolve, reject) => {
      model.updateOne({ _id: id }, newData, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  };

  const deleteDocument = (id) => new Promise((resolve, reject) => {
    model.deleteOne(id, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });

  const getAllDocuments = (query, options) => new Promise((resolve, reject) => {
    model.paginate(query, options, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });

  const getSingleDocumentById = (id, select = []) => new Promise((resolve, reject) => {
    model.findOne({ _id: id }, select, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });

  const getSingleDocumentByQuery = (where, select = []) => new Promise((resolve, reject) => {
    model.findOne(where, select, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
  //  Request Query
  // {
  //     "query":{
  //         "and":[
  //             {"Name":"Dhiraj"},{"Salary":300}
  //         ],
  //         "or":[
  //           {"Name":"Dhiraj"},{"Salary":300}
  //         ]
  //     },
  //     "model":"Employee"
  // }

  const findExistsData = (data) => {
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

  const softDeleteDocument = (id, loggedInUser) => new Promise(async (resolve, reject) => {
    const result = await getSingleDocumentById(id);
    if (result) {
      result.isDeleted = true;

      if (loggedInUser && loggedInUser.id) {
        result.updatedBy = loggedInUser.id
      }
      delete result.id;
      model.updateOne({ _id: id }, result, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    }
    resolve('No Data Found');
  });

  const softDeleteByQuery = (query, loggedInUser) => new Promise(async (resolve, reject) => {
    const result = await getSingleDocumentByQuery(query);
    if (result) {
      result.isDeleted = true;
      if (loggedInUser && loggedInUser.id) {
        result.updatedBy = loggedInUser.id
      }
      delete result.id;
      model.updateOne(query, result, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    }
    resolve('No Data Found');
  });
  const bulkInsert = (data) => new Promise((resolve, reject) => {
    model.insertMany(data, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });

  const bulkUpdate = (filter, data) => new Promise((resolve, reject) => {
    model.updateMany(filter, data, (err, result) => {
      if (result !== undefined) {
        resolve(result);
      } else {
        reject(err);
      }
    });
  });

  const countDocument = (where) => new Promise((resolve, reject) => {
    model.where(where).countDocuments((err, result) => {
      if (result !== undefined) {
        resolve(result);
      } else {
        reject(err);
      }
    });
  });
  const findOneAndUpdateDocument = (filter, data, options = {}) => new Promise((resolve, reject) => {
    model.findOneAndUpdate(filter, data, options, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
  const findOneAndDeleteDocument = (filter, options = {}) => new Promise((resolve, reject) => {
    model.findOneAndDelete(filter, options, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });

  const deleteMany = (filter, options = {}) => new Promise((resolve, reject) => {
    model.deleteMany(filter, options, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });


  return Object.freeze({
    createDocument,
    updateDocument,
    deleteDocument,
    getAllDocuments,
    getSingleDocumentById,
    findExistsData,
    softDeleteDocument,
    softDeleteByQuery,
    bulkInsert,
    bulkUpdate,
    countDocument,
    getSingleDocumentByQuery,
    findOneAndUpdateDocument,
    findOneAndDeleteDocument,
    deleteMany
  });
}
module.exports = makeMongoDbService;
