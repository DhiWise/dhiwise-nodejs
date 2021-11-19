/* eslint-disable no-else-return */
/* eslint-disable no-new-func */
/* eslint-disable no-empty */
/* eslint-disable valid-typeof */
/* eslint-disable no-case-declarations */
/* global _ */
const fs = require('fs');
const missMatchType = require('../config/possibleMissMatchType');
const writeOperations = require('../writeOperations');

function readFile (FileName) {
  return fs.readFileSync(FileName, { encoding: 'utf8' });
}
const mongooseConfiguration = readFile(`${__dirname}/../config/mongooseInput.json`);
const jsonMongooseConfig = JSON.parse(mongooseConfiguration);
const errorLogs = [];

const isRegExp = (string) => {
  try {
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
              /*
               * let msg = `${model} model and attribute ${modelObjKey} is not valid.`;
               * writeFile(errorLogFile, msg);
               * msg = '#########################################';
               * writeFile(errorLogFile, msg);
               */
            }
            // throw new Error(`${modelObjKey} Model Schema is not valid`);
          } else if (Array.isArray(modelObjValue)) {
            // console.log(modelObjValue, "Model OBJ value")
            if (modelObjKey !== 'enum') {
              const item = input[model][modelObjKey];
              valid = this.validSchemaObject(item, input, model);
              if (!valid) {
                const errObj = {};
                errObj.model = model;
                errObj.attribute = modelObjKey;
                errorLogs.push(errObj);
                /*
                 * let msg = `${model} model and attribute ${modelObjKey} is not valid.`;
                 * writeFile(errorLogFile, msg);
                 * msg = '#########################################';
                 * writeFile(errorLogFile, msg);
                 */
              }
            }
            // throw new Error(`${modelObjKey} Model Schema is not valid`);
          } else {
            const item = input[model];
            // console.log(modelObjKey," ",modelObjValue);
            if (jsonMongooseConfig.model.key.type.includes(modelObjValue)) {
              if (modelObjValue === 'ObjectId') {
                item[modelObjKey] = 'Schema.Types.ObjectId';
              } else if (modelObjValue === 'Mixed' || modelObjValue === 'JSON' || modelObjValue === 'Object') {
                item[modelObjKey] = 'Schema.Types.Mixed';
              }
            } else {
              valid = false;
            }
            // console.log(valid, "valid in type")
            if (!valid) {
              const errObj = {};
              errObj.model = model;
              errObj.attribute = modelObjKey;
              errorLogs.push(errObj);
              /*
               * let msg = `${modelObjKey} in ${model} Schema is not valid`;
               * writeFile(errorLogFile, msg);
               * msg = '#########################################';
               * writeFile(errorLogFile, msg);
               */
            }
            // throw new Error(`${modelObjKey} in ${model} Schema is not valid`);
          }
        });
        /*
         * set IsDelete and IsActive Field
         * if (!modelValue.isDeleted) {
         */
        modelValue.isDeleted = { type: 'Boolean' };
        /*
         * }
         * if (!modelValue.isActive) {
         */
        modelValue.isActive = { type: 'Boolean' };

        if (!_.isEmpty(modelValue._id)) {
          delete modelValue._id;
        }
        // }
      });
      if (valid) {
        return input;
      }
      /*
       * const msg = 'not valid schema';
       * writeFile(errorLogFile, msg);
       * throw new Error("not valid schema");
       */
    } catch (error) {
      /*
       * const msg = error.message;
       * writeFile(errorLogFile, msg);
       */
      throw new Error(error);
    } finally {
      if (errorLogs.length) {
        const errorTemplate = writeOperations.loadTemplate('logs/error.log');
        errorTemplate.locals.ERRORS = errorLogs;
        writeOperations.write(`${logsPath}/errors.log`, errorTemplate.render());
      }
      // console.log(errorLogs);
    }
  },
  validSchemaObject (item, input, model) {
    let valid = true;
    const possibleKeys = Object.keys(jsonMongooseConfig.model.key);
    _.map(item, (data, key) => {
      /*
       * if ((_.isEmpty(_.trim(data)) || data === '')) {
       *   delete item[key];
       *   key = '';
       * }
       * if (key) {
       */
      if (possibleKeys.includes(key) && typeof data !== 'object') {
        switch (key) {
        case 'type':
          if (!jsonMongooseConfig.model.key[key].includes(data)) {
            // console.log("not valid ", key," ", data)
            if (typeof data === 'string' && !data.startsWith('`${') && !data.endsWith('}`')) {
              const errObj = {};
              errObj.model = model;
              errObj.attribute = key;
              errObj.value = data;
              errObj.suggestion = `type should be from  ${jsonMongooseConfig.model.key[key].join()}.`;
              errorLogs.push(errObj);
              /*
               * const msg = `${model} model and it's attribute ${key} and value ${data} is not supported by mongoose.
               *               solution: type should be from  ${jsonMongooseConfig.model.key[key].join()}.`;
               * writeFile(errorLogFile, msg);
               */
              valid = false;
            }
          }
          if (data === 'ObjectId') {
            item[key] = 'Schema.Types.ObjectId';
          } else if (data === 'Mixed' || data === 'JSON' || data === 'Object') {
            item[key] = 'Schema.Types.Mixed';
          }
          // console.log(valid, "valid in type")
          break;
        case 'ref':
          const modelKey = Object.keys(input);
          if (!modelKey.includes(data) && typeof data === 'string' && !data.startsWith('`${') && !data.endsWith('}`')) {
            /*
             * const msg = `reference error!!! ${model} model and it's attribute ${key} and value ${data} is not included in models names.
             *               solution: reference should be from your models- ${modelKey.join()}.`;
             * writeFile(errorLogFile, msg);
             */
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
          // console.log(valid, "valid in ref");
          break;
        case 'index':
        case 'unique':
        case 'alias':
        case 'lowercase':
        case 'trim':
        case 'required':
        case 'immutable':
        case 'sparse':
        case 'minLength':
        case 'maxLength':
        case 'of':
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
          // console.log(valid, "valid in " + key)
          break;
        case 'default':
          // console.log(item.type," item type")
          // eslint-disable-next-line valid-typeof
          /*
           * if ((typeof data === item.type.toLowerCase()) || (typeof data === 'string' && data.startsWith('`${') && data.endsWith('}`'))) {
           *   if (typeof data === 'string') {
           *     item[key] = `@@${data}@@`;
           *   }
           * }
           */
          if ((typeof data === item.type.toLowerCase()) || (typeof data === 'string' && data.startsWith('`${') && data.endsWith('}`')) || (typeof data === 'string' && item.type === 'Date')) {
            if (typeof data === 'string') {
              if (data.startsWith('`${') && data.endsWith('}`')) {
                item[key] = `##${data}##`;
              } else {
                item[key] = `@@${data}@@`;
              }
            }
          } else if (typeof data === 'number' || typeof data === 'boolean' || typeof data === 'undefined') {
            item[key] = `@@${data}@@`;
          } else {
            /*
             * const msg = `${model} model and it's attribute default and value ${data} must have same datatype as attribute.
             *               solution: default value's type should be ${item.type}.`;
             * writeFile(errorLogFile, msg);
             */
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
            /*
             * const msg = `${model} model and it's attribute enum and value ${data} must have array or a function that returns an array`;
             * writeFile(errorLogFile, msg);
             */
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
        case 'validate':
          break;
        case 'get':
          break;
        case 'set':
          break;
        case 'transform':
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
        case 'populate':
          break;
        case 'min':
          /*
           * _.map(jsonMongooseConfig.model.key[key], (v) => {
           *   if (v !== typeof (data)) {
           *     valid = false;
           *   }
           * });
           * console.log(valid, "valid in min")
           */
          if (item.type === 'Number') {
            if ((jsonMongooseConfig.model.key.min[0] !== typeof data) || (typeof data === 'string' && !data.startsWith('`${') && !data.endsWith('}`'))) {
              valid = false;
            }
          } else if (item.type === 'Date') {
            if (jsonMongooseConfig.model.key.min[1] !== typeof data || (typeof data === 'string' && !data.startsWith('`${') && !data.endsWith('}`'))) {
              valid = false;
            }
          }
          break;
        case 'max':
          /*
           * _.map(jsonMongooseConfig.model.key[key], (v) => {
           *   if (v !== typeof (data)) {
           *     valid = false;
           *   }
           * });
           */
          if (item.type === 'Number') {
            if (jsonMongooseConfig.model.key.max[0] !== typeof data || (typeof data === 'string' && !data.startsWith('`${') && !data.endsWith('}`'))) {
              valid = false;
            }
          } else if (item.type === 'Date') {
            if (jsonMongooseConfig.model.key.max[1] !== typeof data || (typeof data === 'string' && !data.startsWith('`${') && !data.endsWith('}`'))) {
              valid = false;
            }
          }
          // console.log(valid, "valid in max")
          break;
        default:
          break;
        }
        /*
         * if (!valid) {
         *     let msg = `Model schema is not valid at ${key} and value ${data}.`;
         *     writeFile(errorLogFile, msg);
         *     // throw new Error(`Schema is not valid at ${key} and value ${data}.`);
         * }
         */
      } else if (typeof data === 'object' && !Array.isArray(data)) {
        valid = this.validSchemaObject(data, input, model);
      } else if (Array.isArray(data)) {
        valid = this.validSchemaObject(data, input, model);
      } else if ((jsonMongooseConfig.model.key.type.includes(data)) || (typeof data === 'string' && !data.startsWith('`${') && !data.endsWith('}`'))) {
        // console.log("no type key");
        if (data === 'ObjectId') {
          item[key] = 'Schema.Types.ObjectId';
        } else if (data === 'Mixed' || data === 'JSON' || data === 'Object') {
          item[key] = 'Schema.Types.Mixed';
        }
      } else if (key === 'columnType' || (key === '_id' && typeof data === 'boolean')) {
        delete item[key];
      } else {
        valid = false;
        /*
         * const msg = `${model} model and it's attribute ${key} and value ${data} is not supported by mongoose.
         *                     solution: Did you mean ${missMatchType.getCorrectName(key)} ?`;
         * writeFile(errorLogFile, msg);
         */
        const suggestionKey = missMatchType.getCorrectName(key);
        const errObj = {};
        errObj.model = model;
        errObj.attribute = key;
        errObj.value = data;
        errObj.suggestion = suggestionKey ? `Did you mean ${missMatchType.getCorrectName(key)} ?` : '';
        errorLogs.push(errObj);
        // throw new Error(`Schema is not valid at ${key} and value ${data}.`);
      }
      // }
    });
    return valid;
  },
  checkTypeInSchema (key, data) {
    // eslint-disable-next-line valid-typeof
    if (!(jsonMongooseConfig.model.key[key] === typeof (data)) && !(typeof data === 'string' && data.startsWith('`${') && data.endsWith('}`'))) {
      return false;
    }
    return true;
  },

};
