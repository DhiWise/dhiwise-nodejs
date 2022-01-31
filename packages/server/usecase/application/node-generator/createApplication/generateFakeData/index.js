/* global __basedir */
/* global _ */
const fs = require('fs');
const faker = require('faker');
const ObjectID = require('bson-objectid');
const RandExp = require('randexp');
const fields = require('./fakeDataType');
const { REMOVE_FIELD_FOR_FAKE_DATA } = require('../../constants/constant');

function readFile (FileName) {
  return fs.readFileSync(FileName, { encoding: 'utf8' });
}
const mongooseConfiguration = readFile(`${__basedir}/config/mongooseInput.json`);
const jsonMongooseConfig = JSON.parse(mongooseConfiguration);

function getFdata (data, key) {
  let fakeData;
  _.map(data, (valueData) => {
    if (_.has(data, 'match')) {
      const result = data.match.substring(1, data.match.length - 1);
      const finalRegexp = new RegExp(result);
      fakeData = new RandExp(finalRegexp).gen();
    } else {
      key = key !== 0 ? key.toLowerCase() : key;
      switch (valueData) {
      case 'String':
        // console.log(key)
        if (key) {
          key = key.toLowerCase();
        } if (fields.name.includes(key)) {
          fakeData = faker.name.findName();
        } else if (fields.gender.includes(key)) {
          fakeData = faker.name.gender();
        } else if (fields.email.includes(key)) {
          fakeData = faker.internet.email();
        } else if (fields.address.includes(key)) {
          fakeData = faker.address.streetAddress();
        } else if (fields.color.includes(key)) {
          fakeData = faker.commerce.color();
        } else if (fields.phone.includes(key)) {
          fakeData = faker.phone.phoneNumber();
        } else if (fields.password.includes(key)) {
          fakeData = faker.internet.password();
        } else if (fields.username.includes(key)) {
          fakeData = faker.internet.userName();
        } else {
          fakeData = faker.random.word();
        }
        break;
      case 'Number':
        if (fields.age.includes(key)) {
          if (_.has(data, 'min') && !_.has(data, 'max')) {
            fakeData = faker.datatype.number({ min: data.min });
          } else if (_.has(data, 'max') && !_.has(data, 'min')) {
            fakeData = faker.datatype.number({ max: data.maxLength });
          } else if (_.has(data, 'min') && _.has(data, 'max')) {
            fakeData = faker.datatype.number({
              min: data.min,
              max: data.max,
            });
          } else {
            fakeData = faker.datatype.number(
              {
                min: 10,
                max: 99,
              },
            );
          }
        } else if (fields.price.includes(key)) {
          if (_.has(data, 'min') && !_.has(data, 'max')) {
            fakeData = faker.finance.amount({ min: data.min });
          } else if (_.has(data, 'max') && !_.has(data, 'min')) {
            fakeData = faker.finance.amount({ max: data.maxLength });
          } else if (_.has(data, 'min') && _.has(data, 'max')) {
            fakeData = faker.finance.amount({
              min: data.min,
              max: data.max,
            });
          } else {
            fakeData = faker.datatype.number(
              {
                min: 10,
                max: 99,
              },
            );
          }
        } else {
          fakeData = faker.datatype.number(
            {
              min: 1,
              max: 999,
            },
          );
        }
        break;
      case 'Boolean':
        fakeData = faker.datatype.boolean();
        break;
      case 'Array':
        break;
      case 'JSON':
        break;
      case 'Mixed':
        break;
      case 'Date':
        fakeData = faker.date.future();
        break;
      case 'Buffer':
        break;
      case 'Map':
        break;
      case 'Schema.Types.ObjectId':
        // console.log(ObjectID()," objId for ",key)
        fakeData = ObjectID();
        break;
      case 'ObjectId':
        fakeData = ObjectID();
        break;
      case 'Email':
        fakeData = faker.internet.email();
        break;
      default:
        break;
      }
    }
  });
  return fakeData;
}
module.exports = {
  validSchema (input) {
    try {
      _.map(input, (modelValue, model) => {
        _.map(modelValue, (modelObjValue, modelObjKey) => {
          if (!REMOVE_FIELD_FOR_FAKE_DATA.includes(modelObjKey)) {
            if (typeof input[model][modelObjKey] === 'object' && !Array.isArray(input[model][modelObjKey])) {
              const item = input[model][modelObjKey];
              const data = this.validSchemaObject(item, modelObjKey);
              input[model][modelObjKey] = data;
            } else if (Array.isArray(modelObjValue)) {
              const item = input[model][modelObjKey];
              const data = this.validSchemaObject(item, modelObjKey);
              input[model][modelObjKey] = data;
            } else {
              const data = getFdata(modelObjValue, modelObjKey);
              input[model][modelObjKey] = data;
            }
          } else {
            delete input[model][modelObjKey];
          }
        });
        input[model].id = ObjectID();
      });
      return input;
    } catch (error) {
      throw new Error(error);
    }
  },
  validSchemaObject (item, modelObjKey) {
    let fakeData;
    const possibleKeys = Object.keys(jsonMongooseConfig.model.key);
    fakeData = getFdata(item, modelObjKey);
    _.map(item, (data, key) => {
      if (possibleKeys.includes(key)) {
        delete item[key];
        switch (key) {
        case 'type':
          break;
        case 'ref':
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
          break;
        case 'default':
          break;
        case 'enum':
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
          break;
        case 'populate':
          break;
        case 'min':
          break;
        case 'max':
          break;
        default:
          break;
        }
      } else if (typeof data === 'object' && !Array.isArray(data)) {
        /*
         * console.log(key);
         * console.log(data)
         */
        let fData;
        if (typeof key === 'number') {
          fData = this.validSchemaObject(data, modelObjKey);
        } else {
          fData = this.validSchemaObject(data, key);
        }

        item[key] = fData;
        fakeData = item;
      } else if (Array.isArray(data)) {
        const fData = this.validSchemaObject(data, key);
        item[key] = fData;
        fakeData = item;
      } else if (jsonMongooseConfig.model.key.type.includes(data)) {
        /*
         * if (typeof key === "number") {
         *     let fData = this.validSchemaObject(data, key);
         *     item[key] = fData;
         *     fakeData = item;
         * } else {
         *     let fData = this.validSchemaObject(data, key);
         *     item[key] = fData;
         *     fakeData = item;
         * }
         */
        const fData = getFdata(data, key);
        // console.log(fData," ---------fdata")
        item[key] = fData;
        fakeData = item;
      } else {
        /*
         * console.log(key, " ", data)
         * console.log("not any fake to generate.......")
         */
      }
    });
    return fakeData;
  },
  getFindAllObject () {
    const obj = {
      query: {},
      options: {
        select: ['field 1', 'field 2'],
        sort: '',
        populate: '',
        offset: 0,
        page: 1,
        limit: 10,
        pagination: true,
        options: {},
      },
      isCountOnly: false,

    };
    return obj;
  },
  getObjectId () {
    return ObjectID();
  },
};
