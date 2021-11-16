const {
  isEmpty, uniqWith, isEqual,
} = require('lodash');
const { SQL_RELATIONSHIP_TYPE } = require('../constants/constant');

/* eslint-disable */
module.exports = {
  getDeleteDependency(schema) {
    const obj = {};
    let arr = [];
    for (const keyOnly in schema) {
      const myKey = `@@${keyOnly}@@`;
      if (schema.hasOwnProperty(keyOnly)) {
        for (const key in schema) {
          for (const insideKey in schema[key]) {
            if (schema[key][insideKey].ref === myKey) {
              const objKey = {};
              objKey.model = key;
              objKey.refId = insideKey;
              arr.push(objKey);
            }
            obj[keyOnly] = arr;
          }
        }
      }
      arr = [];
    }
    return obj;
  },

  getSQLRelationshipDependencies(schema) {
    const obj = {};
    let arr = [];
    for (const keyOnly in schema) {
      if (schema.hasOwnProperty(keyOnly)) {
        for (const key in schema) {
          for (const insideKey in schema[key]) {
            if (schema[key][insideKey].ref === keyOnly) {
              const objKey = {};
              objKey.model = key;
              schema[key][insideKey].hasOwnProperty('refAttribute') ? objKey.refId = insideKey : objKey.refId = '';
              schema[key][insideKey].hasOwnProperty('relType') ? objKey.relType = schema[key][insideKey]['relType'] : objKey.relType = 2;
              schema[key][insideKey].hasOwnProperty('refAttribute') ? objKey.refAttribute = schema[key][insideKey]['refAttribute'] : objKey.refAttribute = null;
              if (schema[key][insideKey].hasOwnProperty('relType')) {
                if (schema[key][insideKey]['relType'] !== null) {
                  if (schema[key][insideKey]['relType'] === SQL_RELATIONSHIP_TYPE.HAS_ONE) {
                    objKey.relType = 'HAS_ONE';
                  } else if (schema[key][insideKey]['relType'] === SQL_RELATIONSHIP_TYPE.HAS_MANY) {
                    objKey.relType = 'HAS_MANY';
                  } else {
                    objKey.relType = 'HAS_MANY';
                  }
                } else {
                  objKey.relType = 'HAS_MANY';
                }
              }
              if (objKey.refAttribute !== null) {
                arr.push(objKey);
              }

            }
            obj[keyOnly] = arr;
          }
        }
      }
      arr = [];
    }
    return obj;
  },

  // not using currently, but it will be useful when we need all the dependent models of any model
  getDeleteDependency2(modelList) {
    const obj = {}
    for (const modelName in modelList) {
      const mainRefKey = `@@${modelName}@@`;
      const refList = getChildDeleteDependency(modelList, mainRefKey, modelName)
      obj[modelName] = refList
    }
    return obj;
  },

  getSQLUniqueIndexesForRelationship(models) {
    let uniqueIndexColumns = {};
    if (Object.keys(models).length) {
      Object.keys(models).forEach((d) => {
        if (Object.keys(models[d]).length) {
          Object.keys(models[d]).forEach((attributes) => {
            if (
              models[d][attributes].ref !== undefined &&
              models[d][attributes].refAttribute !== undefined &&
              models[d][attributes].relType !== undefined
            ) {
              const refTable = models[d][attributes].ref;
              const refAttribute = models[d][attributes].refAttribute;
              if (models[refTable][refAttribute] !== undefined) {
                if (!models[refTable][refAttribute].hasOwnProperty('primary')) {
                  if (!models[refTable][refAttribute].hasOwnProperty('unique')) {
                    models[refTable][refAttribute].unique = true;
                    Object.assign(uniqueIndexColumns, { [refTable]: refAttribute });
                  }
                }
              }
            }
          });
        }
      });
    }
    return uniqueIndexColumns;
  }

};

function getChildDeleteDependency(modelList, refKey, currentModel) {
  let arr = []
  for (const model in modelList) {
    for (const field in modelList[model]) {
      if (modelList[model][field].ref === refKey) {
        const obj1 = {}
        obj1.model = model
        obj1.refId = field
        obj1.parentModel = currentModel
        arr.push(obj1)
        const nestedRef = getChildDeleteDependency(modelList, `@@${model}@@`, model)
        if (!isEmpty(nestedRef)) {
          arr = arr.concat(nestedRef)
        }
      }
    }
  }
  return uniqWith(arr, isEqual)
}