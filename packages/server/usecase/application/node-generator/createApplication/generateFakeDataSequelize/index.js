/* global __basedir */
/* global  _ */
const fs = require('fs');
const faker = require('faker');
const ObjectID = require('bson-objectid');
const RandExp = require('randexp');
const fields = require('./fakeDataType');
const {
  REMOVE_FIELD_FOR_FAKE_DATA, SEQUELIZE_DATATYPE_MAPPINGS,
} = require('../../constants/constant');

function readFile (FileName) {
  return fs.readFileSync(FileName, { encoding: 'utf8' });
}
const mongooseConfiguration = readFile(`${__basedir}/config/mongooseInput.json`);
const jsonMongooseConfig = JSON.parse(mongooseConfiguration);

function getFdata (data, key) {
  let fakeData;
  _.map(data, () => {
    if (_.has(data, 'match')) {
      const result = data.match.substring(1, data.match.length - 1);
      const finalRegexp = new RegExp(result);
      fakeData = new RandExp(finalRegexp).gen();
    } else {
      key = key !== 0 ? key.toLowerCase() : key;
      if (SEQUELIZE_DATATYPE_MAPPINGS.SEQUELIZE_STRING_TYPE.includes(data)) {
        if (fields.name.includes(key.toLowerCase())) {
          fakeData = faker.name.findName();
        } else if (fields.gender.includes(key.toLowerCase())) {
          fakeData = faker.name.gender();
        } else if (fields.email.includes(key.toLowerCase())) {
          fakeData = faker.internet.email();
        } else if (fields.address.includes(key.toLowerCase())) {
          fakeData = faker.address.streetAddress();
        } else if (fields.color.includes(key.toLowerCase())) {
          fakeData = faker.commerce.color();
        } else if (fields.phone.includes(key.toLowerCase())) {
          fakeData = faker.phone.phoneNumber();
        } else if (fields.password.includes(key.toLowerCase())) {
          fakeData = faker.internet.password();
        } else if (fields.username.includes(key.toLowerCase())) {
          fakeData = faker.internet.userName();
        } else {
          fakeData = faker.random.word();
        }
      }
      if (SEQUELIZE_DATATYPE_MAPPINGS.SEQUELIZE_NUMBER_TYPE.includes(data)) {
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
      }
      if (SEQUELIZE_DATATYPE_MAPPINGS.SEQUELIZE_DECIMAL_TYPE.includes(data)) {
        if (fields.age.includes(key)) {
          fakeData = faker.datatype.float(
            {
              min: 10,
              max: 99,
            },
          );
        } else if (fields.price.includes(key)) {
          fakeData = faker.finance.amount();
        } else {
          fakeData = faker.datatype.float(
            {
              min: 1,
              max: 999,
            },
          );
        }
      }
      if (SEQUELIZE_DATATYPE_MAPPINGS.SEQUELIZE_UUID_TYPE.includes(data)) {
        fakeData = faker.datatype.uuid();
      }
      if (SEQUELIZE_DATATYPE_MAPPINGS.SEQUELIZE_DATE_TYPE.includes(data)) {
        fakeData = faker.date.future();
      }
      if (SEQUELIZE_DATATYPE_MAPPINGS.SEQUELIZE_BLOB_TYPE.includes(data)) {
        fakeData = faker.datatype.string();
      }
      if (SEQUELIZE_DATATYPE_MAPPINGS.SEQUELIZE_JSON_TYPE.includes(data)) {
        fakeData = faker.datatype.json();
      }
      if (SEQUELIZE_DATATYPE_MAPPINGS.SEQUELIZE_ARRAY_TYPE.includes(data)) {
        fakeData = faker.datatype.array();
      }
      if (SEQUELIZE_DATATYPE_MAPPINGS.SEQUELIZE_GEOMETRY_TYPE.includes(data)) {
        fakeData = faker.datatype.float();
      }
      if (SEQUELIZE_DATATYPE_MAPPINGS.SEQUELIZE_RANGE_TYPE.includes(data)) {
        fakeData = faker.datatype.number();
      }
      if (SEQUELIZE_DATATYPE_MAPPINGS.SEQUELIZE_BOOLEAN_TYPE.includes(data)) {
        fakeData = faker.datatype.boolean();
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
      // console.log(input);
      return input;
    } catch (error) {
      throw new Error(error);
    }
  },
  validSchemaObject (item, modelObjKey) {
    let fakeData;
    const possibleKeys = Object.keys(jsonMongooseConfig.model.key);
    _.map(item, (data, key) => {
      if (possibleKeys.includes(key)) {
        delete item[key];
        switch (key) {
        case 'type':
          // console.log(modelObjKey)
          fakeData = getFdata(data, modelObjKey);
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
        collation: '',
        sort: '',
        populate: '',
        projection: '',
        lean: false,
        leanWithId: true,
        offset: 0,
        page: 1,
        limit: 10,
        pagination: true,
        useEstimatedCount: false,
        useCustomCountFn: false,
        forceCountFn: false,
        read: {},
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
