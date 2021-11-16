/* global  _ */
const fs = require('fs');
const path = require('path');
const writeOperations = require('../../writeOperations');
const { SEQUELIZE_DATATYPE_MAPPING_WITH_JAVASCRIPT } = require('../../constants/constant');

function readFile (FileName) {
  return fs.readFileSync(FileName, { encoding: 'utf8' });
}
const sequelizeConfiguration = readFile(path.join(__dirname, '../../config/sequelizeTypeInput.json'));
const jsonSequelizeConfig = JSON.parse(sequelizeConfiguration);
const errorLogs = [];

const isRegExp = (string) => {
  try {
    // eslint-disable-next-line no-new-func
    return new Function(`
              "use strict";
              try {
                  new RegExp(${string});
                  return true;
              } catch (e) {
                  return false;
              }
          `)();
  } catch (e) {
    return false;
  }
};

module.exports = {
  // eslint-disable-next-line consistent-return
  validSchema (input, logsPath) {
    try {
      let valid = true;
      _.map(input, (modelValue, model) => {
        _.map(modelValue, (modelObjValue, modelObjKey) => {
          if (typeof input[model][modelObjKey] === 'object' && !Array.isArray(input[model][modelObjKey])) {
            const item = input[model][modelObjKey];
            valid = this.validSchemaObject(item, input, model);
            if (!valid) {
              const errObj = {};
              errObj.model = model;
              errObj.attribute = modelObjKey;
              errorLogs.push(errObj);
            }
          }
        });
      });
      if (valid) {
        return input;
      }
    } catch (error) {
      throw new Error(error);
    } finally {
      if (errorLogs.length) {
        const errorTemplate = writeOperations.loadTemplate('logs/error.log');
        errorTemplate.locals.ERRORS = errorLogs;
        writeOperations.write(`${logsPath}/errors.log`, errorTemplate.render());
      }
    }
  },
  validSchemaObject (item, input, model) {
    let valid = true;
    const possibleKeys = Object.keys(jsonSequelizeConfig.model.key);
    _.map(item, (data, key) => {
      if ((_.isEmpty(_.trim(data)) || data === '')) {
        delete item[key];
        key = '';
      }
      if (possibleKeys.includes(key) && typeof data !== 'object') {
        switch (key) {
        case 'type':
          if (!jsonSequelizeConfig.model.key[key].includes(data)) {
            if (typeof data === 'string' && !data.startsWith('`${') && !data.endsWith('}`')) {
              const errObj = {};
              errObj.model = model;
              errObj.attribute = key;
              errObj.value = data;
              errObj.suggestion = `type should be from  ${jsonSequelizeConfig.model.key[key].join()}.`;
              errorLogs.push(errObj);
              valid = false;
            }
          }
          break;
        case 'ref':
          // eslint-disable-next-line no-case-declarations
          const modelKey = Object.keys(input);
          if (!modelKey.includes(data) && typeof data === 'string' && !data.startsWith('`${') && !data.endsWith('}`')) {
            const errObj = {};
            errObj.message = 'reference error !!!';
            errObj.model = model;
            errObj.attribute = key;
            errObj.value = data;
            errObj.suggestion = `Reference should be from your models - ${modelKey.join()}.`;
            errorLogs.push(errObj);
            valid = false;
          }
          if (valid) {
            if (typeof data === 'string' && data.startsWith('`${') && data.endsWith('}`')) {
              item[key] = `##${data}##`;
            } else {
              item[key] = `@@${data}@@`;
            }
          }
          break;
        case 'refAttribute':
          // eslint-disable-next-line no-case-declarations
          const refModel = item.ref !== undefined && item.ref !== null ? item.ref.split('@').join('') : '';
          // eslint-disable-next-line no-case-declarations
          const refModelKey = Object.keys(input[refModel]);
          if (!refModelKey.includes(data) && typeof data === 'string' && !data.startsWith('`${') && !data.endsWith('}`')) {
            const errObj = {};
            errObj.message = 'reference error !!!';
            errObj.model = model;
            errObj.attribute = key;
            errObj.value = data;
            errObj.suggestion = `Reference should be from your models - ${refModelKey.join()}.`;
            errorLogs.push(errObj);
            valid = false;
          }
          if (valid) {
            if (typeof data === 'string' && data.startsWith('`${') && data.endsWith('}`')) {
              item[key] = `##${data}##`;
            } else {
              item[key] = `@@${data}@@`;
            }
          }
          break;
        case 'default':
          // eslint-disable-next-line valid-typeof
          if ((typeof data === SEQUELIZE_DATATYPE_MAPPING_WITH_JAVASCRIPT[item.type]) || (typeof data === 'string' && data.startsWith('`${') && data.endsWith('}`'))) {
            if (typeof data === 'string') {
              if (data.startsWith('`${') && data.endsWith('}`')) {
                item[key] = `##${data}##`;
              } else {
                item[key] = `@@${data}@@`;
              }
            } else if (typeof data === 'boolean') {
              item[key] = data;
            } else if (typeof data === 'number') {
              item[key] = data;
            }
            // eslint-disable-next-line max-len
          } else if (typeof data === 'number' || typeof data === 'boolean' || typeof data === 'string' || typeof data === 'undefined') {
            // ? add condition for enum's validation
            item[key] = `@@${data}@@`;
          } else {
            const errObj = {};
            errObj.model = model;
            errObj.attribute = 'default';
            errObj.value = data;
            errObj.message = 'value must have same datatype as attribute.';
            errObj.suggestion = `default value's type should be ${item.type}.`;
            errorLogs.push(errObj);
            valid = false;
          }
          break;
        case 'enum':
          if (Array.isArray(data) || !(_.startsWith(data, '`${') && _.endsWith(data, '}`'))) {
            const errObj = {};
            errObj.model = model;
            errObj.attribute = 'enum';
            errObj.value = data;
            errObj.suggestion = 'value must have array or a function that returns an array.';
            errorLogs.push(errObj);
            valid = false;
          }
          // console.log(valid, "valid in enum")
          break;
        case 'min':
          if (item.type === 'Number') {
            // eslint-disable-next-line valid-typeof
            if ((jsonSequelizeConfig.model.key.min[0] !== typeof data) || (typeof data === 'string' && !data.startsWith('`${') && !data.endsWith('}`'))) {
              valid = false;
            }
          } else if (item.type === 'Date') {
            // eslint-disable-next-line valid-typeof
            if (jsonSequelizeConfig.model.key.min[1] !== typeof data || (typeof data === 'string' && !data.startsWith('`${') && !data.endsWith('}`'))) {
              valid = false;
            }
          }
          break;
        case 'max':
          if (item.type === 'Number') {
            // eslint-disable-next-line valid-typeof
            if (jsonSequelizeConfig.model.key.max[0] !== typeof data || (typeof data === 'string' && !data.startsWith('`${') && !data.endsWith('}`'))) {
              valid = false;
            }
          } else if (item.type === 'Date') {
            // eslint-disable-next-line valid-typeof
            if (jsonSequelizeConfig.model.key.max[1] !== typeof data || (typeof data === 'string' && !data.startsWith('`${') && !data.endsWith('}`'))) {
              valid = false;
            }
          }
          break;
        case 'lowercase':
        case 'trim':
        case 'required':
        case 'unique':
        case 'isAutoIncrement':
        case 'tiny':
        case 'primary':
        case 'relType':
          valid = this.checkTypeInSchema(key, data);
          if (valid === true && key === 'unique' && item.type === 'String') {
            item.uniqueCaseInsensitive = true;
          } else if (valid === true && (key === 'alias' || key === 'of')) {
            if (typeof data === 'string' && data.startsWith('`${') && data.endsWith('}`')) {
              item[key] = `##${data}##`;
            } else {
              item[key] = `@@${data}@@`;
            }
          }
          break;
        case 'innerDataType':
          if (!jsonSequelizeConfig.model.key[key].includes(data)) {
            if (typeof data === 'string' && !data.startsWith('`${') && !data.endsWith('}`')) {
              const errObj = {};
              errObj.model = model;
              errObj.attribute = key;
              errObj.value = data;
              errObj.suggestion = `type should be from  ${jsonSequelizeConfig.model.key[key].join()}.`;
              errorLogs.push(errObj);
              valid = false;
            }
          }
          break;
        case 'match':
          if (typeof data === 'string' && !data.startsWith('`${') && !data.endsWith('}`')) {
            const validRegex = isRegExp(data);
            if (!validRegex) {
              const errObj = {};
              errObj.model = model;
              errObj.attribute = 'match';
              errObj.value = data;
              errObj.message = 'not a valid regular expression.';
              errorLogs.push(errObj);
              valid = false;
            }
            item[key] = data;
          }
          break;
        default:
          break;
        }
      }
    });
    return valid;
  },
  checkTypeInSchema (key, data) {
    // eslint-disable-next-line valid-typeof
    if (!(jsonSequelizeConfig.model.key[key] === typeof (data)) && !(typeof data === 'string' && data.startsWith('`${') && data.endsWith('}`'))) {
      return false;
    }
    return true;
  },
};
