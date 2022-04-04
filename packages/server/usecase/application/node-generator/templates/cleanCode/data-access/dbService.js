/* eslint-disable */
module.exports = function mongoDbService(Model) {
  const create = async (data) => Model.create(data);

  const createMany = async (data, options = {}) => Model.create(data, options);

  const updateOne = async (filter, data, options = { new: true }) => Model.findOneAndUpdate(filter, data, options);

  const updateMany = async (filter, data, options = {}) => Model.updateMany(filter, data, options);

  const deleteOne = async (filter, options = {}) => Model.findOneAndDelete(filter, options);

  const deleteMany = async (filter, options = {}) => Model.deleteMany(filter, options);

  const softDelete = async (filter, data) => Model.updateOne(filter, data);

  const softDeleteMany = async (filter, data) => Model.updateMany(filter, data);

  const findOne = async (filter, options = {}) => {
    let projection = options.projection ? options.projection : null;
    return Model.findOne(filter, projection, options);
  }

  const findMany = async (filter, options = {}) => {
    let projection = options.projection ? options.projection : null;
    return Model.find(filter, projection, options);
  };

  const paginate = async (filter, options = {}) => Model.paginate(filter, options);

  const count = async (filter) => Model.countDocuments(filter);

  const upsert = async (filter, data, options = {}) => Model.updateMany(filter, data, {
    ...options,
    upsert: true,
  });

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
