/* global __basedir, _ */
const fs = require('fs');
const constant = require('../../constants/constant');

const sqlTypes = JSON.parse(fs.readFileSync(`${__basedir}/config/sequelizeDataType.json`));

const removeKeys = (object) => {
  if (Array.isArray(object)) {
    object.forEach((a) => removeKeys(a));
  } else if (typeof object === 'object') {
    if (object !== null) {
      constant.REMOVE_KEY_FROM_MODEL_FOR_SEQUELIZE_MODEL.forEach((a) => {
        if (object !== null && object[a] !== null) {
          delete object[a];
        }
      });
      const values = Object.values(object).filter((v) => Array.isArray(v) || typeof v === 'object');
      removeKeys(values);
    }
  }
};

function setType (data, adapterType, option = {}) {
  _.forEach(data, (value, key) => {
    if (typeof value === 'object' && !Array.isArray(value)) {
      setType(value, adapterType, value);
    } else if (Array.isArray(value)) {
      setType(value, adapterType, value);
    }
    switch (key) {
    case 0:
    case 'type':
      switch (value) {
      case 'ObjectId':
        data[key] = sqlTypes.ObjectId;
        break;
      case 'String':
        if (option.maxLength) {
          data[key] = sqlTypes.String.length;
        } else if (option.maxLength === 1 || option.minLength === 1) {
          data[key] = sqlTypes.String.singleLength;
        } else {
          data[key] = sqlTypes.String.noLength;
        }

        break;
      case 'Number':
        if (option.isAutoIncrement) {
          [data[key]] = sqlTypes.Number.autoIncrement;
        } else if (option.min && option.max && adapterType === constant.ADAPTER.POSTGRESQL) {
          data[key] = sqlTypes.Number.minMax;
        } else {
          data[key] = sqlTypes.Number.noOption;
        }
        break;
      case 'Boolean':
        data[key] = sqlTypes.Boolean;
        break;
      case 'Date':
        data[key] = sqlTypes.Date;
        break;
      case 'SingleLine':
      case 'Email':
      case 'URL':
        data[key] = sqlTypes.SingleLine;
        break;
      case 'MultiLine':
        data[key] = sqlTypes.MultiLine;
        break;
      case 'Object':
        if (adapterType === constant.ADAPTER.MSSQL) {
          data[key] = sqlTypes.Object.mssql;
        } else if (adapterType === constant.ADAPTER.MYSQL) {
          data[key] = sqlTypes.Object.mysql;
        } else if (adapterType === constant.ADAPTER.POSTGRESQL) {
          [, data[key]] = sqlTypes.Object.postgres;
        }
        break;
      case 'Map':
        if (adapterType === constant.ADAPTER.MSSQL) {
          data[key] = sqlTypes.Map.mssql;
        } else if (adapterType === constant.ADAPTER.MYSQL) {
          data[key] = sqlTypes.Map.mysql;
        } else if (adapterType === constant.ADAPTER.POSTGRESQL) {
          [, data[key]] = sqlTypes.Map.postgres;
        }
        break;
      case 'JSON':
        if (adapterType === constant.ADAPTER.MSSQL) {
          data[key] = sqlTypes.JSON.mssql;
        } else if (adapterType === constant.ADAPTER.MYSQL) {
          data[key] = sqlTypes.JSON.mysql;
        } else if (adapterType === constant.ADAPTER.POSTGRESQL) {
          [, data[key]] = sqlTypes.JSON.postgres;
        }
        break;
      case 'Array':
        if (adapterType === constant.ADAPTER.MSSQL) {
          data[key] = sqlTypes.Array.mssql;
        } else if (adapterType === constant.ADAPTER.MYSQL) {
          data[key] = sqlTypes.Array.mysql;
        } else if (adapterType === constant.ADAPTER.POSTGRESQL) {
          const pgArray = sqlTypes.Array.postgres;
          const pgArrayType = `DataTypes.${data.innerDataType ?? 'STRING'}`;
          data[key] = `${pgArray}(${pgArrayType})`;
        }
        break;
      case 'Buffer':
        data[key] = sqlTypes.Buffer;
        break;
      case 'Decimal':
      case 'Percentage':
      case 'Currency':
        [, , data[key]] = sqlTypes.Decimal;
        break;
      case 'TINYSTRING':
        data[key] = 'DataTypes.TEXT(\'tiny\')';
        break;
      case 'TINYINTEGER':
        data[key] = 'DataTypes.TINYINT';
        break;
      default:
        // eslint-disable-next-line no-case-declarations
        if (sqlTypes.SequelizeTypes.includes(value)) {
          if (adapterType === constant.ADAPTER.MSSQL) {
            data[key] = `DataTypes.${value}`;
          } else if (adapterType === constant.ADAPTER.MYSQL) {
            data[key] = `DataTypes.${value}`;
          } else if (adapterType === constant.ADAPTER.POSTGRESQL) {
            data[key] = `DataTypes.${value}`;
          }
        }
        break;
      }
      break;
    case 'match':
      key = 'is';
      // eslint-disable-next-line no-prototype-builtins
      if (!data.hasOwnProperty('validate')) {
        data.validate = {};
        data.validate[key] = value;
      } else {
        data.validate[key] = value;
      }
      break;
    case 'ref':
      /*
       * key = "reference"
       * data[key] = value;
       */
      break;
    case 'required':
      key = 'allowNull';
      data[key] = !value;
      break;
    case 'default':
      key = 'defaultValue';
      if (typeof value === 'boolean') {
        data[key] = value;
      } else if (typeof value === 'number') {
        data[key] = value;
      } else if (typeof value === 'bigint') {
        data[key] = value;
      } else if (value !== undefined && value !== null) {
        if (typeof value === 'string') {
          if (!value.includes('@@')) {
            data[key] = `@@${value}@@`;
          } else {
            data[key] = `${value}`;
          }
        } else {
          data[key] = `@@${value}@@`;
        }
      }
      break;
    case 'isAutoIncrement':
      key = 'autoIncrement';
      data[key] = value;
      break;
    case 'lowercase':
      key = 'lowercase';
      data[key] = value;
      break;
    case 'trim':
      key = 'trim';
      data[key] = value;
      break;
    case 'unique':
      key = 'unique';
      // eslint-disable-next-line no-prototype-builtins
      if (data.hasOwnProperty('type')) {
        if (data.type !== 'DataTypes.TEXT') {
          data[key] = value;
        }
      }
      break;
    case 'min':
      key = 'min';
      // eslint-disable-next-line no-prototype-builtins
      if (!data.hasOwnProperty('validate')) {
        data.validate = {};
        data.validate[key] = value;
      } else {
        data.validate[key] = value;
      }
      break;
    case 'max':
      key = 'max';
      // eslint-disable-next-line no-prototype-builtins
      if (!data.hasOwnProperty('validate')) {
        data.validate = {};
        data.validate[key] = value;
      } else {
        data.validate[key] = value;
      }
      break;
    case 'primary':
      key = 'primaryKey';
      data[key] = value;
      break;
    case 'minLength':
      // eslint-disable-next-line no-prototype-builtins
      if (!data.hasOwnProperty('validate')) {
        data.validate = {};
        data.validate.len = [];
        // eslint-disable-next-line no-prototype-builtins
        if (!data.validate.hasOwnProperty('len')) {
          data.validate.len = [];
          data.validate.len.push(value ?? 18);
        }
        data.validate.len.push(value ?? 18);
      } else {
        // eslint-disable-next-line no-prototype-builtins
        if (!data.validate.hasOwnProperty('len')) {
          data.validate.len = [];
          data.validate.len.push(value ?? 18);
        }
        data.validate.len.push(value ?? 18);
      }
      break;
    case 'maxLength':
      // eslint-disable-next-line no-prototype-builtins
      if (!data.hasOwnProperty('validate')) {
        data.validate = {};
        data.validate.len = [];
        // eslint-disable-next-line no-prototype-builtins
        if (!data.validate.hasOwnProperty('len')) {
          data.validate.len = [];
          data.validate.len.push(value ?? 50);
        }
        data.validate.len.push(value ?? 50);
      } else {
        // eslint-disable-next-line no-prototype-builtins
        if (!data.validate.hasOwnProperty('len')) {
          data.validate.len = [];
          data.validate.len.push(value ?? 50);
        }
        data.validate.len.push(value ?? 50);
      }
      break;
    default:
      break;
    }
  });
  removeKeys(data);
  return data;
}

module.exports = { setType };
