/* eslint-disable */
const _ = require('lodash');

const validate = module.exports = {};

validate.getValidation = async function (schema, enumData) {
  let schemaObj = {}; let models;
  let modelObj = {}, updateModelObj = {}, modelTestobj = {};
  let modelType, otherTypes;
  let joiModel;
  let joiValidation = {};
  let flag = true;
  joiValidation.arrayOpen = 'joi.array().items(';
  joiValidation.objectOpen = 'joi.object({';
  joiValidation.arrayClose = ')';
  joiValidation.objectClose = '})';

  _.each(schema, (value, key) => {
    delete value['updatedBy'];
    delete value['addedBy'];
    delete value['createdAt'];
    delete value['updatedAt'];
    delete value['modifiedBy'];
  });
  let closeStatus = 0;
  for (let schemaIndex in schema) {
    for (let valueIndex in schema[schemaIndex]) {
      let status = false;
      for (let modelEnum in enumData) {
        if (schemaIndex === modelEnum) {
          for (let enumValueIndex in enumData[modelEnum]) {
            if (enumValueIndex === valueIndex) {
              if (schema[schemaIndex][valueIndex].type === 'String' || schema[schemaIndex][valueIndex].type === 'Number') {
                if (enumData[modelEnum][enumValueIndex].default) {
                  schemaObj[valueIndex] = `joi.${_.toLower(schema[schemaIndex][valueIndex].type)}().default(${enumData[modelEnum][enumValueIndex].enumFile}Default.${enumData[modelEnum][enumValueIndex].enumAttribute}.${enumData[modelEnum][enumValueIndex].default})`;
                } else {
                  schemaObj[valueIndex] = `joi.${_.toLower(schema[schemaIndex][valueIndex].type)}()`;
                }
              } else
                schemaObj[valueIndex] = `joi.string()..default(${enumData[modelEnum][enumValueIndex].enumFile}Default.${enumData[modelEnum][enumValueIndex].enumAttribute}.${enumData[modelEnum][enumValueIndex].default})`;
              status = true;
            }
          }
        }
      }
      models = schema[schemaIndex][valueIndex];
      if (models.type) {
        //'string'
        if (typeof models.type === 'string' && !status) {
          modelType = getTypes(models.type);
          otherTypes = getOtherTypes(Object.keys(models), Object.values(models));
          if (otherTypes) {
            joiModel = modelType.concat(otherTypes);
            schemaObj[valueIndex] = joiModel;
          } else {
            schemaObj[valueIndex] = modelType;
          }
          //['String']
        } else if (Array.isArray(models.type) && models.type.length === 1 && !status) {
          modelType = getTypes(models.type[0]);

          otherTypes = getOtherTypes(Object.keys(models), Object.values(models));
          if (otherTypes) {
            joiModel = joiValidation.arrayOpen.concat(modelType, otherTypes, joiValidation.arrayClose);
            schemaObj[valueIndex] = joiModel;
          } else {
            schemaObj[valueIndex] = joiValidation.arrayOpen.concat(modelType, joiValidation.arrayClose);
          }
        }
      }
      //without type('String')
      else if (!models.type && typeof models !== 'object' && !status) {
        modelType = getTypes(models);
        schemaObj[valueIndex] = modelType;

        //object
      } else if (typeof models === 'object' && !Array.isArray(models) && !status) {
        schemaObj[valueIndex] = joiValidation.objectOpen;
        for (let index in models) {
          if (models[index].type) {
            modelType = getTypes(models[index].type);
            otherTypes = getOtherTypes(Object.keys(models[index]), Object.values(models[index]));
            if (otherTypes) {
              schemaObj[valueIndex] += `${index}:${modelType}${otherTypes},`;
              closeStatus = 1;
            } else {
              schemaObj[valueIndex] += `${index}:${modelType},`;
              closeStatus = 1;
            }
          } else {
            //2 level object
            if (typeof models[index] === 'object' && !status) {
              for (let nestIndex in models[index]) {
                if (models[index][nestIndex].type && !Array.isArray(models[index])) {
                  modelType = getTypes(models[index][nestIndex].type);
                  otherTypes = getOtherTypes(Object.keys(models[index][nestIndex]), Object.values(models[index][nestIndex]));
                  if (otherTypes) {
                    schemaObj[valueIndex] = joiValidation.objectOpen;
                    schemaObj[valueIndex] += `${index}:${joiValidation.objectOpen}${nestIndex}:${modelType}${otherTypes}${joiValidation.objectClose}`;
                    schemaObj[valueIndex] += joiValidation.objectClose;
                  } else {
                    schemaObj[valueIndex] = joiValidation.objectOpen;
                    schemaObj[valueIndex] += `${index}:${joiValidation.objectOpen}${nestIndex}:${modelType}${joiValidation.objectClose}`;
                    schemaObj[valueIndex] += joiValidation.objectClose;
                  }
                  //object of array
                } else if (Array.isArray(models[index]) && !status) {
                  schemaObj[valueIndex] = joiValidation.objectOpen;
                  schemaObj[valueIndex] += `${index}:${joiValidation.arrayOpen}`;
                  schemaObj[valueIndex] += joiValidation.arrayClose;
                  schemaObj[valueIndex] += joiValidation.objectClose;
                  flag = false;
                } else {
                  //more then 2 levels
                  schemaObj[valueIndex] = 'joi.object()';
                }
              }
            } else {
              if (!models.type && typeof models === 'object' && flag) {
                schemaObj[valueIndex] = joiValidation.objectOpen;
                for (let otherModels in models) {
                  modelType = getTypes(models[otherModels]);
                  schemaObj[valueIndex] += `${otherModels}:${modelType},`;
                }
                schemaObj[valueIndex] = schemaObj[valueIndex].replace(/,\s*$/, '');
                schemaObj[valueIndex] += joiValidation.objectClose;
              }
            }
          }
        }

        if (closeStatus === 1) {
          schemaObj[valueIndex] = schemaObj[valueIndex].replace(/,\s*$/, '');
          schemaObj[valueIndex] += joiValidation.objectClose;
          closeStatus = 0;
        }
      } else if (Array.isArray(models) && !status) {
        for (let arrayIndex of models) {
          schemaObj[valueIndex] = `${joiValidation.arrayOpen}`;
          schemaObj[valueIndex] += `joi.object(`;
          for (let objectIndex in arrayIndex) {
            if (Array.isArray(objectIndex)) {
              if (arrayIndex[objectIndex].type) {
                modelType = getTypes(arrayIndex[objectIndex].type);
                otherTypes = getOtherTypes(Object.keys(arrayIndex[objectIndex]), Object.values(arrayIndex[objectIndex]));
                if (otherTypes) {
                  schemaObj[valueIndex] += `${objectIndex}:${modelType}${otherTypes},`;
                } else {
                  schemaObj[valueIndex] += `${objectIndex}:${modelType},`;
                }
              } else {
                modelType = getTypes(arrayIndex[objectIndex]);
                schemaObj[valueIndex] += `${objectIndex}:${modelType},`;
              }
            }
          }
          schemaObj[valueIndex] = schemaObj[valueIndex].replace(/,\s*$/, '');
          schemaObj[valueIndex] += ')';
          schemaObj[valueIndex] += joiValidation.arrayClose;
        }
      }
    }
    modelTestobj[schemaIndex] = schemaObj;
    schemaObj = {};
  }
  _.each(modelTestobj, (v, x) => {
    _.each(v, (val, y) => {
      if (val && !val.includes('required')) {
        val = `${val}.allow(null).allow('')`;
        v[y] = val;
      }
      v[y] = val;
      let hasActive = Reflect.has(v, 'isActive');
      if (!hasActive) {
        v.isActive = 'joi.boolean()';
      }
      let hasDelete = Reflect.has(v, 'isDeleted');
      if (!hasDelete) {
        v.isDeleted = 'joi.boolean()';
      }
      modelTestobj[x] = v;
    });

  });
  updateObj = _.cloneDeep(modelTestobj);
  _.each(updateObj, (v, y) => {
    _.each(v, (val, i) => {
      if (val && val.includes('required')) {
        val = val.split('.required()').join('.when({is:joi.exist(),then:joi.required(),otherwise:joi.optional()})');
        v[i] = val;
      }
    });
  });

  modelObj.models = modelTestobj;

  updateModelObj.models = updateObj;

  return { modelObj, updateModelObj };
}
function getTypes(modelType) {
  let type;
  switch (modelType) {
    case 'String':
    case 'string':
    case 'MultiLine':
      type = 'joi.string()';
      break;

    case 'Number':
      type = 'joi.number().integer()';
      break;

    case 'object':
    case 'JSON':
      type = 'joi.object()';
      break;

    case 'Decimal':
    case 'Currency':
      type = 'joi.number()';
      break;

    case 'ObjectId':
      type = 'joi.string().regex(/^[0-9a-fA-F]{24}$/)';
      break;

    case 'Date':
      type = 'joi.date()';
      break;

    case 'TimeStamp':
      type = 'joi.date().timestamp()';
      break;

    case 'Boolean':
      type = 'joi.boolean()';
      break;

    case 'Array':
      type = 'joi.array().items()';
      break;


    case 'Mixed':
      type = 'joi.any()';
      break;

    case 'SingleLine':
      type = 'joi.string().regex(/^[^\r\n]+$/)';
      break;

    case 'Email':
      type = 'joi.string().email()';
      break;

    case 'URL':
      type = 'joi.string().uri()';
      break;

    case 'Percentage':
      type = 'joi.number().min(0).max(100)';
  }
  return type;

}

function getOtherTypes(key, value) {
  let type = '';
  if (Array.isArray(key) && Array.isArray(value)) {
    for (let i = 0; i < key.length; i++) {
      if (key[i] === 'required') {
        if (value[i]) {
          type = '.required()';
        }
      } else if (key[i] === 'default') {
        if (typeof value[i] === 'string') {
          type += `.${key[i]}('${value[i]}')`;
        } else {
          type += `.${key[i]}(${value[i]})`;
        }
      } else if (key[i] === 'trim') {
        type += '.trim()';
      } else if (key[i] === 'match') {
        type += `.regex(${value[i]})`;
      } else if (key[i] === 'minLength' || key[i] === 'mix') {
        type += `.min(${value[i]})`;
      } else if (key[i] === 'maxLength' || key[i] === 'max') {
        type += `.max(${value[i]})`;
      } else if (key[i] === 'enum') {
        if (Array.isArray(value[i])) {
          value[i] = value[i].join();
          value[i] = value[i].split(',').map((word) => `'${word.trim()}'`).join(',');
          type += `.valid(${value[i]})`;
        } if (typeof value[i] === 'string') {
          type += `.valid(${value[i]})`;
        }
      } else if (key[i] === 'lowercase') {
        type += '.case(\'lower\')';
      } else if (key[i] === 'uppercase') {
        type += '.case(\'upper\')';
      } else if (key[i] === 'precision') {
        type += `.precision(${value[i]})`;
      }
    }
  }
  return type;

}
