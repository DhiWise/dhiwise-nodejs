/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable no-shadow */
const {
  isEmpty, forEach, groupBy, clone, cloneDeep,
} = require('lodash');
const { flatten } = require('flat');
const writeOperations = require('../../writeOperations');
const {
  getSQLRelationshipDependencies, getSQLUniqueIndexesForRelationship,
} = require('../getDeleteDependency');
const { SEQUELIZE_INDEX_TYPE } = require('../../constants/constant');

const renameKey = (object, key, newKey) => {
  const clonedObj = clone(object);
  if (Object.keys(clonedObj).length > 0) {
    Object.keys(clonedObj).forEach((s) => {
      clonedObj[s][newKey] = clonedObj[s][key];
      delete clonedObj[s][key];
    });
  } else {
    const targetKey = clonedObj[key];
    delete clonedObj[key];
    clonedObj[newKey] = targetKey;
  }
  return clonedObj;
};

const parseEnum = (object, constants) => {
  const clonedObj = clone(object);
  if (Object.keys(clonedObj).length) {
    Object.keys(clonedObj).forEach((k) => {
      const element = clonedObj[k];
      const { enumFile } = element;
      const { enumAttribute } = element;
      const enumValues = constants?.[enumFile]?.[enumAttribute];
      if (Array.isArray(enumValues)) {
        clonedObj[k].default = [enumValues.indexOf(element.default)] ?? [0];
      }
    });
  }
  return clonedObj;
};

const concatAttributes = (finalJSON, obj) => {
  const array = [];
  const stringAttributeArray = [];
  let internalObj = {};
  let formate;
  let flag = false;
  for (const index of finalJSON) {
    switch (index.dataType) {
    case 'string':
      if (index.operator === 'space') {
        formate = `values.${index.attribute[0]}.toString().concat(" ",`;
      } else {
        formate = `values.${index.attribute[0]}.toString().concat("${index.operator}",`;
      }
      if (index.attribute.length >= 1) {
        formate += `values.${index.attribute[1]}.toString())`;
      } else {
        formate += ')';
      }
      stringAttributeArray.push(index.attribute[0]);
      stringAttributeArray.push(index.attribute[1]);
      internalObj[index.targetAttr] = formate;
      break;

    case 'boolean':
      if (obj.boolKeys) {
        for (const boolIndex of obj.boolKeys) {
          const nestObj = {};
          nestObj.true = index.attribute.true;
          nestObj.false = index.attribute.false;
          internalObj[boolIndex] = nestObj;
        }
      } else {
        const nestObj = {};
        nestObj.true = index.attribute.true;
        nestObj.false = index.attribute.false;
        internalObj[index.targetAttr] = nestObj;
      }
      break;

    case 'date':
      if (obj.dateKeys) {
        for (const dateIndex of obj.dateKeys) {
          internalObj[dateIndex] = `dayjs(values.${dateIndex}).format('${index.attribute}')`;
        }
      } else {
        internalObj[index.targetAttr] = `dayjs(${internalObj[index.targetAttr]}).format('${index.attribute}')`;
      }
      flag = true;
      break;

    case 'DateOnly':
      if (obj.dateOnlyKey) {
        for (const dateOnlyIndex of obj.dateOnlyKey) {
          internalObj[dateOnlyIndex] = `dayjs(values.${dateOnlyIndex}).format('${index.attribute}')`;
        }
      } else {
        internalObj[index.targetAttr] = `dayjs(${internalObj[index.targetAttr]}).format('${index.attribute}')`;
      }
      break;
    default:
      break;
    }
    array.push(internalObj);
    internalObj = {};
  }
  return {
    array,
    stringAttributeArray,
    flag,
  };
};

const createModels = async (dir, jsonData, forValidationModels, modelData, authObject = false) => {
  let alreadyDoneUser = false;
  const allEJSModel = {};
  let tableRelationships = {};
  if (modelData && modelData.models) {
    const sqlRelationShip = getSQLRelationshipDependencies(modelData.models);
    const uniqueIndexForRelationships = getSQLUniqueIndexesForRelationship(modelData.models);
    const deleteDependency = sqlRelationShip;
    const index = writeOperations.loadTemplate(`${dir}/index.js`);
    const modelIndexesJson = jsonData.modelIndexes ? jsonData.modelIndexes : {};
    if (isEmpty(jsonData.hooks)) Object.assign(jsonData, { hooks: {} });
    if (Object.keys(uniqueIndexForRelationships).length) {
      Object.keys(uniqueIndexForRelationships).forEach((ui) => {
        jsonData.models[ui][uniqueIndexForRelationships[ui]].unique = true;
      });
    }
    forEach(jsonData.models, (value, key) => {
      const model = writeOperations.loadTemplate(`${dir}/model.js`);
      if (authObject) {
        if (authObject.userModel !== '' && authObject.isAuth && !alreadyDoneUser && key === authObject.userModel) {
          model.locals.IS_AUTH = authObject.isAuth;
          model.locals.USER = true;
          model.locals.PASSWORD = authObject.userLoginWith?.password || 'password';
          value.role = {
            type: 'DataTypes.INTEGER',
            required: true,
          };
          alreadyDoneUser = true;
          if (!jsonData.hooks[key]) {
            Object.assign(jsonData.hooks, { [key]: {} });
          }
          if (!jsonData.hooks[key].pre) {
            Object.assign(jsonData.hooks[key], { pre: [] });
          }
          if (!jsonData.hooks[key].post) {
            Object.assign(jsonData.hooks[key], { post: [] });
          }
          jsonData.hooks[key].pre.push({
            operation: 'beforeCreate',
            code: `if(${key}.${authObject.userLoginWith?.password || 'password'}){ ${key}.${authObject.userLoginWith?.password || 'password'} =
          await bcrypt.hash(${key}.${authObject.userLoginWith?.password || 'password'}, 8);}\n${key}.isActive=true;\n${key}.isDeleted=false`,
          });
          jsonData.hooks[key].post.push({
            operation: 'afterCreate',
            code: `sequelize.model('userAuthSettings').create({
            userId:${key}.id
          })`,
          });

          if (authObject.socialAuth !== undefined && authObject.socialAuth.required) {
            const ssoAuthKeys = {};
            for (let i = 0; i < authObject.socialAuth.platforms.length; i += 1) {
              Object.assign(ssoAuthKeys, { [`${authObject.socialAuth.platforms[i].type.toLowerCase()}Id`]: { type: 'DataTypes.STRING' } });
            }
            const entries = Object.entries(value);
            for (let i = 0; i < entries.length; i += 1) {
              const [k] = entries[i];
              if (k.includes('SSO'.toLowerCase())) {
                delete value[k];
              }
            }
            Object.assign(value, ssoAuthKeys);
          }
        } else {
          model.locals.IS_AUTH = false;
          model.locals.USER = false;
        }
      } else {
        model.locals.USER = false;
      }
      if (key !== authObject.userModel) {
        if (!jsonData.hooks[key]) {
          Object.assign(jsonData.hooks, { [key]: {} });
        }
        if (!jsonData.hooks[key].pre) {
          Object.assign(jsonData.hooks[key], { pre: [] });
        }
        const modelName = key;
        jsonData.hooks[key].pre.push({
          operation: 'beforeCreate',
          code: `${modelName}.isActive=true;\n${modelName}.isDeleted=false`,
        });
        jsonData.hooks[key].pre.push({
          operation: 'beforeBulkCreate',
          // eslint-disable-next-line max-len
          code: `if (${modelName} !== undefined && ${modelName}.length) { \n for (let index = 0; index < ${modelName}.length; index++) { \n const element = ${modelName}[index]; \n element.isActive = true; \n element.isDeleted = false; \n } \n }`,
        });
      }
      const modelArrayIndexes = [];
      if (modelIndexesJson) {
        // eslint-disable-next-line array-callback-return
        Object.keys(modelIndexesJson).map((i) => {
          if (i === key) {
            const currentIndexModel = cloneDeep(value);
            const modelIndexes = modelIndexesJson[i];
            // if (Object.keys(modelIndexesJson[key]).length) {
            if (modelIndexes.length) {
              let fieldsArray = [];
              // eslint-disable-next-line no-shadow
              for (let index = 0; index < modelIndexes.length; index += 1) {
                const element = modelIndexes[index];
                if (element.indexType === SEQUELIZE_INDEX_TYPE.UNIQUE) {
                  if (element.fields.length) {
                    fieldsArray = element.fields ?? [];
                  }
                  if (fieldsArray.length) {
                    modelArrayIndexes.push({
                      unique: true,
                      fields: fieldsArray,
                      name: `${key}_unique_indexes_${Math.floor((Math.random() * 1000000) + 1)}`,
                    });
                  }
                }
                if (element.indexType === SEQUELIZE_INDEX_TYPE.BTREE) {
                  const customizedFieldsArray = [];
                  if (element.indexFields !== undefined && element.indexFields.length) {
                    // ? Operation for remove collate key in BTree index for sequelize
                    for (let mIndex = 0; mIndex < element.indexFields.length; mIndex += 1) {
                      const customFields = element.indexFields[mIndex];
                      if ('collate' in customFields) {
                        delete customFields.collate;
                      }
                      const x = currentIndexModel[customFields.attribute].type;
                      if (x === 'DataTypes.INTEGER' && 'length' in customFields) {
                        delete customFields.length;
                      }
                      customizedFieldsArray.push(customFields);
                    }
                  }
                  modelArrayIndexes.push({
                    using: element.indexType,
                    fields: customizedFieldsArray,
                    name: `${element.name}_index_${Math.floor((Math.random() * 1000000) + 1)}`,
                  });
                }
                if (element.indexType === SEQUELIZE_INDEX_TYPE.PARTIAL) {
                  if (element.indexFields && element.indexFields.length) {
                    const fields = element.fields ?? [];
                    if (fields.length > 0) {
                      for (let jIndex = 0; jIndex < element.indexFields.length; jIndex += 1) {
                        if (fields.includes(element.indexFields[jIndex].attribute)) {
                          modelArrayIndexes.push({
                            name: `${key}_${element.indexFields[jIndex].attribute}_partial_index`,
                            fields: [element.indexFields[jIndex].attribute],
                            where: { [element.indexFields[jIndex].operator]: element.indexFields[jIndex].value },
                          });
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        });
      }
      model.locals.INDEX = modelArrayIndexes;
      model.locals.DB_MODEL = key;
      model.locals.DB_MODEL_FC = key.charAt(0).toUpperCase() + key.slice(1);
      model.locals.DB_SCHEMA = value;
      let deleteModels = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const k in deleteDependency) {
        if (k === key) {
          deleteModels = deleteDependency[k];
          break;
        } else {
          deleteModels = [];
        }
      }
      if (deleteModels.length) {
        model.locals.DELETE_DEPENDENT_MODEL = deleteModels;
      } else {
        model.locals.DELETE_DEPENDENT_MODEL = false;
      }
      if (jsonData.hooks && jsonData.hooks[key]) {
        let hooks = [];
        if (jsonData.hooks[key].pre) {
          hooks.push(...jsonData.hooks[key].pre);
        }
        if (jsonData.hooks[key].post) {
          hooks.push(...jsonData.hooks[key].post);
        }
        hooks = groupBy(hooks, 'operation');
        model.locals.HOOKS = hooks;
      }
      if (!isEmpty(jsonData.modelEnum) && !isEmpty(jsonData.modelEnum[key])) {
        const allConstants = jsonData.constants;
        parseEnum(jsonData.modelEnum[key], allConstants);
        renameKey(jsonData.modelEnum[key], 'default', 'defaultValue');
        renameKey(jsonData.modelEnum[key], 'enumAttribute', 'values');
        // const constantForCurrentModel = allConstants[jsonData.modelEnum[key].enumFile[jsonData.modelEnum[key].enumAttribute]];
        model.locals.MODEL_ENUM = jsonData.modelEnum[key];
        model.locals.IMPORT_KEY = Object.keys(jsonData.modelEnum[key]);
      } else {
        model.locals.MODEL_ENUM = false;
      }
      index.locals.RELATIONSHIPS = sqlRelationShip;
      let privateAttributeArray;
      if (!isEmpty(jsonData.modelPrivate)) {
        // ? model private attribute
        if (!isEmpty(jsonData.modelPrivate[key])) {
          privateAttributeArray = flatten(jsonData.modelPrivate[key]);
          if (!isEmpty(privateAttributeArray) && Object.keys(privateAttributeArray).length) {
            const privateAttributeObject = {};
            // eslint-disable-next-line array-callback-return
            Object.keys(privateAttributeArray).map((m) => {
              if (privateAttributeArray[m]) {
                Object.assign(privateAttributeObject, { [m.split('.private').join('')]: true });
              }
            });
            model.locals.IS_PRIVATE_ATTR = true;
            model.locals.PRIVATE_ATTRS = privateAttributeObject;
          } else {
            model.locals.IS_PRIVATE_ATTR = true;
          }
        } else {
          model.locals.IS_PRIVATE_ATTR = false;
        }
      } else {
        model.locals.IS_PRIVATE_ATTR = false;
      }
      if (!isEmpty(jsonData.authentication.addDataFormate)) {
        jsonData.addDataFormate = jsonData.authentication.addDataFormate;
        let boolKeys = []; let dateKeys = []; const dateOnlyKey = [];
        for (const index in value) {
          if (value[index].type === 'DataTypes.BOOLEAN') {
            boolKeys.push(index);
          } if (value[index].type === 'DataTypes.DATE') {
            dateKeys.push(index);
          } if (value[index].type === 'DataTypes.DATEONLY') {
            dateOnlyKey.push(index);
          }
        }
        if (jsonData.addDataFormate[key]) {
          Array.prototype.push.apply(jsonData.addDataFormate[key], jsonData.addDataFormate.allModels_data_format);
        } else {
          jsonData.addDataFormate[key] = jsonData.addDataFormate.allModels_data_format;
        }
        let formateArray = [];
        if (jsonData.addDataFormate[key]) {
          formateArray = concatAttributes(jsonData.addDataFormate[key], {
            boolKeys,
            dateKeys,
            dateOnlyKey,
          });
          model.locals.CONCAT_HOOK = formateArray.array;
          model.locals.STRING_ATT = formateArray.stringAttributeArray;
          model.locals.FLAG = formateArray.flag;
          boolKeys = [];
          dateKeys = [];
        }
      } else {
        model.locals.CONCAT_HOOK = false;
      }
      allEJSModel[key] = model;
    });
    if (isEmpty(jsonData.virtualRelationship)) {
      index.locals.VIRTUAL_RELATION = undefined;
    } else {
      index.locals.VIRTUAL_RELATION = jsonData.virtualRelationship;
    }
    tableRelationships = index;
    return {
      deleteDependency,
      allEJSModel,
      tableRelationships,
    };
  }
  return {};
};
module.exports = { createModels };
