/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
const {
  isEmpty, forEach, lowerCase,
} = require('lodash');
const { flatten } = require('flat');
const { getDeleteDependency } = require('./getDeleteDependency');
const writeOperations = require('../writeOperations');

const concatAttributes = (finalJSON, obj) => {
  let array = [];
  let internalObj = {};
  const stringAttributeArray = [];
  let formate;
  let flag = false;
  if (finalJSON) {
    for (const index of finalJSON) {
      switch (index.dataType) {
      case 'string':
        if (index.operator === 'space') {
          formate = `object.${index.attribute[0]}.toString().concat(" ",`;
        } else {
          formate = `object.${index.attribute[0]}.toString().concat("${index.operator}",`;
        }
        if (index.attribute.length >= 1) {
          formate += `object.${index.attribute[1]}.toString())`;
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
            internalObj[dateIndex] = `dayjs(object.${dateIndex}).format('${index.attribute}')`;
          }
        } else {
          internalObj[index.targetAttr] = `dayjs(${internalObj[index.targetAttr]}).format('${index.attribute}')`;
        }
        flag = true;
        break;
      default:
        break;
      }
      array.push(internalObj);
      internalObj = {};
    }
  } else {
    array = [];
  }
  return {
    array,
    stringAttributeArray,
    flag,
  };
};

const getUnique = (obj) => {
  let unique = false;
  const data = Object.keys(obj);
  for (let index = 0; index < data.length; index += 1) {
    if (data[index] === 'unique' && obj[data[index]] === true) {
      unique = true;
      break;
    } else if (typeof obj[data[index]] === 'object' && !unique) {
      if (obj[data[index]] !== null && obj[data[index]] !== undefined) {
        unique = getUnique(obj[data[index]]);
      }
    }
  }
  return unique;
};

const createModels = async (dir, jsonData, forValidationModels, authObject = false) => {
  let alreadyDoneUser = false;
  const allEJSModel = {};
  const deleteDependency = getDeleteDependency(jsonData.models);
  const modelIndexes = jsonData.modelIndexes ? jsonData.modelIndexes : {};
  forEach(jsonData.models, (value, key) => {
    const model = writeOperations.loadTemplate(`${dir}/model.js`);
    {
      const unique = getUnique(value);
      if (authObject) {
        if (authObject.userModel !== '' && authObject.isAuth && !alreadyDoneUser && key === authObject.userModel) {
          model.locals.IS_AUTH = authObject.isAuth;
          model.locals.USER = true;
          model.locals.PASSWORD = authObject.userLoginWith?.password || 'password';

          // add key role and resetPassword in model
          value.role = {
            type: 'Number',
            enum: 'convertObjectToEnum(USER_ROLE)',
            required: true,
          };
          value.resetPasswordLink = {
            code: 'String',
            expireTime: 'Date',
          };

          // add key role and resetPassword in validation
          forValidationModels[key].role = {
            type: 'Number',
            enum: '...convertObjectToEnum(USER_ROLE)',
          };
          forValidationModels[key].resetPasswordLink = {
            code: 'String',
            expireTime: 'Date',
          };

          // add key loginRetry limit in model and validation
          if (!isEmpty(authObject.userLoginRetryLimit) && authObject.userLoginRetryLimit.key) {
            value[authObject.userLoginRetryLimit.key] = {
              type: 'Number',
              default: 0,
            };
            value.loginReactiveTime = { type: 'Date' };
          }

          if (authObject.socialAuth !== undefined && authObject.socialAuth.required) {
            const ssoAuthKeys = { sso_auth: {} };
            for (let i = 0; i < authObject.socialAuth.platforms.length; i += 1) {
              Object.assign(ssoAuthKeys.sso_auth, { [`${authObject.socialAuth.platforms[i].type.toLowerCase()}Id`]: { type: 'String' } });
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
          alreadyDoneUser = true;
        } else {
          model.locals.IS_AUTH = false;
          model.locals.USER = false;
        }

        // add key addedBy in model and validation
        if (!isEmpty(jsonData.filterByLoggedInUser)) {
          if (jsonData.filterByLoggedInUser.models[key]) {
            const addedKey = jsonData.filterByLoggedInUser.models[key].addedByKey;
            if (!addedKey) {
              value.addedBy = {
                type: 'Schema.Types.ObjectId',
                ref: `@@${authObject.userModel}@@`,
              };
            } else if (!Object.keys(value).includes(addedKey)) {
              value[addedKey] = {
                type: 'Schema.Types.ObjectId',
                ref: `@@${authObject.userModel}@@`,
              };
            }
          } else {
            value.addedBy = {
              type: 'Schema.Types.ObjectId',
              ref: `@@${authObject.userModel}@@`,
            };
          }
        } else {
          value.addedBy = {
            type: 'Schema.Types.ObjectId',
            ref: `@@${authObject.userModel}@@`,
          };
        }
      }
      let virtualRelationships = null;
      if (!isEmpty(jsonData.virtualRelationship)) {
        if (!isEmpty(jsonData.virtualRelationship[key])) {
          virtualRelationships = jsonData.virtualRelationship[key];
        } else {
          virtualRelationships = null;
        }
      }

      model.locals.VIRTUAL_RELATION = virtualRelationships;

      if (jsonData.modelEnum) {
        const modelKeys = Object.keys(value);
        forEach(jsonData.modelEnum[key], (enumValue, enumKey) => {
          if (modelKeys.includes(enumKey)) {
            forEach(enumValue, (nestEnumValue, nestEnumKey) => {
              if (Array.isArray(value[enumKey])) {
                forEach(value[enumKey], (arrayValue) => {
                  if (nestEnumValue.default) {
                    arrayValue[nestEnumKey].default += `${nestEnumValue.default}`;
                  }
                });
              } else if (typeof value[enumKey] === 'object') {
                if (nestEnumKey in value[enumKey]) {
                  forEach(value[enumKey], (objectValue) => {
                    if (nestEnumValue.default) {
                      objectValue.default = `${nestEnumValue.enumFile}Enum`;
                      objectValue.default += `.${nestEnumValue.enumAttribute}`;
                      objectValue.default += `.${nestEnumValue.default}`;
                    }
                  });
                } else if (enumValue.default) {
                  value[enumKey].default = `${enumValue.enumFile}Enum`;
                  value[enumKey].default += `.${enumValue.enumAttribute}`;
                  value[enumKey].default += `.${enumValue.default}`;
                }
              }
            });
          }
        });
      }

      model.locals.DB_MODEL = key;
      model.locals.DB_SCHEMA = value;
      // managing auto-sequence in models
      model.locals.ATTRS_WITH_SEQ = jsonData.sequenceGenerator[key] ? jsonData.sequenceGenerator[key] : null;
      model.locals.DB_UNIQUE = unique;
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

      if (!isEmpty(jsonData.modelComment) && !isEmpty(jsonData.modelComment[key])) {
        model.locals.COMMENT = jsonData.modelComment[key];
      } else {
        model.locals.COMMENT = false;
      }
      if (!isEmpty(jsonData.hooks) && !isEmpty(jsonData.hooks[key])) {
        model.locals.HOOKS = jsonData.hooks[key];
      } else {
        model.locals.HOOKS = false;
      }
      if (!isEmpty(jsonData.modelEnum) && !isEmpty(jsonData.modelEnum[key])) {
        model.locals.MODEL_ENUM = jsonData.modelEnum[key];
      } else {
        model.locals.MODEL_ENUM = false;
      }
      if (!isEmpty(jsonData.modelVariables) && !isEmpty(jsonData.modelVariables[key])) {
        model.locals.VARIABLES = jsonData.modelVariables[key];
      }

      const modelIndex = modelIndexes ? modelIndexes[key] : [];
      model.locals.INDEXES = modelIndex;
      let privateAttributeArray;
      const modelPrivateArray = [];
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
            forEach(jsonData.models[key], (val, k) => {
              Object.keys(privateAttributeObject).forEach((d) => {
                if (d.includes(k)) {
                  if (Array.isArray(val)) {
                    modelPrivateArray.push(d);
                    delete privateAttributeObject[d];
                  }
                }
              });
            });
            model.locals.IS_PRIVATE_ATTR = true;
            model.locals.PRIVATE_ATTRS = privateAttributeObject;
            const arrayPrivatePropertyObj = {};
            if (modelPrivateArray.length) {
              forEach(jsonData.models[key], (val, k) => {
                for (let j = 0; j < modelPrivateArray.length; j += 1) {
                  const firstElement = modelPrivateArray[j].split('.')[0];
                  if (firstElement !== undefined && firstElement !== null) {
                    if (k === firstElement) {
                      const privateInputArray = jsonData.modelPrivate[key][k];
                      if (privateInputArray) {
                        Object.keys(privateInputArray).forEach((pi) => {
                          Object.assign(arrayPrivatePropertyObj, { [k]: pi });
                        });
                      } else {
                        model.locals.IS_PRIVATE_ARRAY_PROPERTY = false;
                      }
                    } else {
                      model.locals.IS_PRIVATE_ARRAY_PROPERTY = true;
                    }
                  } else {
                    model.locals.IS_PRIVATE_ARRAY_PROPERTY = true;
                  }
                }
              });
              if (Object.keys(arrayPrivatePropertyObj).length) {
                model.locals.ARRAY_PRIVATE_PROPERTY = arrayPrivatePropertyObj;
                model.locals.IS_PRIVATE_ARRAY_PROPERTY = true;
              } else {
                model.locals.IS_PRIVATE_ARRAY_PROPERTY = false;
              }
            } else {
              model.locals.IS_PRIVATE_ARRAY_PROPERTY = false;
            }
          } else {
            model.locals.IS_PRIVATE_ATTR = false;
            model.locals.IS_PRIVATE_ARRAY_PROPERTY = false;
          }
        } else {
          model.locals.IS_PRIVATE_ATTR = false;
          model.locals.IS_PRIVATE_ARRAY_PROPERTY = false;
        }
      } else {
        model.locals.IS_PRIVATE_ATTR = false;
        model.locals.IS_PRIVATE_ARRAY_PROPERTY = false;
      }
      allEJSModel[key] = model;
      if (!isEmpty(jsonData.authentication.addDataFormate)) {
        jsonData.addDataFormate = jsonData.authentication.addDataFormate;
        let boolKeys = []; let dateKeys = [];
        // if (jsonData.addDataFormate.allModels_data_format) {
        for (const index in value) {
          if (lowerCase(value[index].type) === 'boolean') {
            boolKeys.push(index);
          } if (lowerCase(value[index].type) === 'date') {
            dateKeys.push(index);
          }
        }
        if (jsonData.addDataFormate[key]) {
          Array.prototype.push.apply(jsonData.addDataFormate[key], jsonData.addDataFormate.allModels_data_format);
        } else {
          jsonData.addDataFormate[key] = jsonData.addDataFormate.allModels_data_format;
        }
        // }
        let formateArray = [];
        formateArray = concatAttributes(jsonData.addDataFormate[key], {
          boolKeys,
          dateKeys,
        });
        model.locals.CONCAT_HOOK = formateArray.array;
        model.locals.STRING_ATT = formateArray.stringAttributeArray;
        model.locals.FLAG = formateArray.flag;
        boolKeys = [];
        dateKeys = [];
      } else {
        model.locals.CONCAT_HOOK = false;
      }
    }
  });
  return {
    deleteDependency,
    allEJSModel,
  };
};

module.exports = {
  createModels,
  concatAttributes,
};
