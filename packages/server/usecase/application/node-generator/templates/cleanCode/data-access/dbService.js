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

  const aggregate = async (query) => {
    let keyInJson; let
      valuesOfAggregate;
    let valuesOfFields; let
      keysOfFields;
    let input = {}; let finalInput = {}; let
      aggregate = {};
    const array = [];
    for (const [keys, values] of Object.entries(query)) {
      for (const [key, value] of Object.entries(values)) {
        switch (keys) {
          case 'group':
            keyInJson = 'key' in value;
            if (keyInJson) {
              valuesOfAggregate = Object.values(value);
              valuesOfFields = Object.values(valuesOfAggregate[0]);
              keysOfFields = Object.keys(valuesOfAggregate[0]);
              for (const [nestKey, nestValue] of Object.entries(valuesOfFields)) {
                if (Array.isArray(nestValue)) {
                  input._id = `$${keysOfFields[nestKey]}`;
                  for (const [i, j] of Object.entries(nestValue)) {
                    finalInput[`$${key}`] = '';
                    finalInput[`$${key}`] += `$${j}`;
                    input[j] = finalInput;
                    finalInput = {};
                  }
                  aggregate.$group = input;
                  array.push(aggregate);
                } else {
                  input._id = `$${keysOfFields[nestKey]}`;
                  finalInput[`$${key}`] = '';
                  finalInput[`$${key}`] = `$${nestValue}`;
                  input[nestValue] = finalInput;
                  aggregate.$group = input;
                  array.push(aggregate);
                }
              }
            }
            aggregate = {};
            finalInput = {};
            input = {};
            break;

          case 'match':
            valuesOfFields = Object.values(value).flat();
            keysOfFields = Object.keys(value);
            if (Array.isArray(valuesOfFields) && valuesOfFields.length > 1) {
              finalInput.$in = valuesOfFields;
              input[keysOfFields[0]] = finalInput;
            } else {
              input[keysOfFields[0]] = valuesOfFields[0];
            }
            aggregate.$match = input;
            array.push(aggregate);
            aggregate = {};
            input = {};
            finalInput = {};
            break;

          case 'project':
            valuesOfFields = Object.values(value);
            if (valuesOfFields.length === 1) {
              const projectValues = Object.values(valuesOfFields[0]).toString();
              const projectKeys = Object.keys(valuesOfFields[0]).toString();
              const projectArr = [];

              if (isNaN(projectValues)) {
                projectArr.push(`$${projectKeys}`);
                projectArr.push(`$${projectValues}`);
              } else {
                projectArr.push(`$${projectKeys}`);
                projectArr.push(projectValues);
              }
              finalInput[`$${key}`] = projectArr;
              input[projectKeys] = finalInput;
              aggregate.$project = input;
              array.push(aggregate);
            }
            aggregate = {};
            input = {};
            finalInput = {};
            break;
        }
      }
    }
    return await Model.aggregate(array);
  };

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
    aggregate,
  });
};
