import pluralize from 'pluralize';
import { toLower } from 'lodash';
import { APPLICATION_CODE, DATABASE_TYPE } from './Project/applicationStep';

export const DB_TYPE = {
  MONGODB: 'MONGODB',
  SQL: 'SQL',
  MYSQL: 'MYSQL',
  POSTRAGSQL: 'POSTRAGSQL',
};

export const DB_CONST = {
  [DATABASE_TYPE.MONGODB]: DB_TYPE.MONGODB,
  [DATABASE_TYPE.SQL]: DB_TYPE.SQL,
  [DATABASE_TYPE.MYSQL]: DB_TYPE.MYSQL,
  [DATABASE_TYPE.POSTGRE_SQL]: DB_TYPE.POSTRAGSQL,
};

export const TABS = {
  SCHEMA_TAB: 0,
  HOOK_SETUP: 1,
  INDEXING: 2,
};

export const SCHEMA_TAB = {
  TABLE_VIEW: 0,
};

export const HOOK_TAB_TITLE = {
  [APPLICATION_CODE.nodeExpress]: 'Hook setup',
};

export const MODEL_ERROR_TABS = {
  JSON_ERROR: 'Json error',
  MODEL_ERROR: 'Model error',
};

export const TYPES = {
  JSON: 'JSON',
  ARRAY: 'Array',
  STRING: 'String',
  NUMBER: 'Number',
  BOOL: 'Boolean',
  REF: 'Relationship',
};

export const ALL_TABLE_TYPES = {
  [DB_TYPE.MONGODB]: {
    STRING: 'String',
    EMAIL: 'Email',
    NUMBER: 'Number',
    BOOL: 'Boolean',
    ARRAY: 'Array',
    JSON: 'JSON',
    MIXED: 'Mixed',
    DATE: 'Date',
    BUFFER: 'Buffer',
    MAP: 'Map',
    OBJECTID: 'ObjectId',
    VIRTUAL_RELATION: 'virtualRelation',
    SINGLELINE: 'SingleLine',
    MULTILINE: 'MultiLine',
    URL: 'URL',
    DECIMAL: 'Decimal',
    PERCENT: 'Percentage',
    POINT: 'Point',
  },
  [DB_TYPE.POSTRAGSQL]: {
    STRING: 'STRING',
    TEXT: 'TEXT',
    CHAR: 'CHAR',
    BOOL: 'BOOLEAN',
    INTEGER: 'INTEGER',
    BIGINT: 'BIGINT',
    FLOAT: 'FLOAT',
    REAL: 'REAL',
    DOUBLE: 'DOUBLE',
    DECIMAL: 'DECIMAL',
    DATE: 'DATE',
    DATEONLY: 'DATEONLY',
    UUID: 'UUID',
    UUIDV4: 'UUIDV4',
    BLOB: 'BLOB',
    ENUM: 'ENUM',
    JSON: 'JSON',
    JSONB: 'JSONB',
    ARRAY: 'ARRAY',
    GEOMETRY: 'GEOMETRY',
    GEOGRAPHY: 'GEOGRAPHY',
    RANGE: 'RANGE',
    TINYSTRING: 'TINYSTRING', // same as string
    TINYINTEGER: 'TINYINTEGER', // same as integer
  },
  [DB_TYPE.MYSQL]: {
    STRING: 'STRING',
    TEXT: 'TEXT',
    CHAR: 'CHAR',
    BOOL: 'BOOLEAN',
    INTEGER: 'INTEGER',
    BIGINT: 'BIGINT',
    FLOAT: 'FLOAT',
    REAL: 'REAL',
    DOUBLE: 'DOUBLE',
    DECIMAL: 'DECIMAL',
    DATE: 'DATE',
    DATEONLY: 'DATEONLY',
    TIMESTAMP: 'TIMESTAMP',
    ENUM: 'ENUM',
    JSON: 'JSON',
    GEOMETRY: 'GEOMETRY',
    GEOGRAPHY: 'GEOGRAPHY',
    TINYSTRING: 'TINYSTRING',
    TINYINTEGER: 'TINYINTEGER',
    UnsignedBigInt: 'UnsignedBigInt',
  },
  [DB_TYPE.SQL]: {
    STRING: 'STRING',
    TEXT: 'TEXT',
    CHAR: 'CHAR',
    BOOL: 'BOOLEAN',
    INTEGER: 'INTEGER',
    BIGINT: 'BIGINT',
    FLOAT: 'FLOAT',
    REAL: 'REAL',
    DOUBLE: 'DOUBLE',
    DECIMAL: 'DECIMAL',
    DATE: 'DATE',
    DATEONLY: 'DATEONLY',
    ENUM: 'ENUM',
    TINYSTRING: 'TINYSTRING',
    TINYINTEGER: 'TINYINTEGER',
  },
};

export const TABLE_TYPES_NAME = {
  MONGODB: {
    EMAIL: 'Email',
    STRING: 'String',
    NUMBER: 'Number',
    BOOL: 'Boolean',
    ARRAY: 'Array',
    JSON: 'JSON',
    MIXED: 'Mixed',
    DATE: 'Date',
    BUFFER: 'Buffer',
    MAP: 'Map',
    OBJECTID: 'Relationship',
    SINGLELINE: 'SingleLine',
    MULTILINE: 'MultiLine',
    URL: 'URL',
    DECIMAL: 'Decimal',
    PERCENT: 'Percentage',
    VIRTUAL_RELATION: 'Virtual Relationship',
    POINT: 'Point',
  },
  SQL: { // Sequelize db
    STRING: 'STRING',
    TEXT: 'TEXT',
    CHAR: 'CHAR',
    BOOL: 'BOOLEAN',
    INTEGER: 'INTEGER',
    BIGINT: 'BIGINT',
    FLOAT: 'FLOAT',
    REAL: 'REAL',
    DOUBLE: 'DOUBLE',
    DECIMAL: 'DECIMAL',
    DATE: 'DATE',
    DATEONLY: 'DATEONLY',
    TIMESTAMP: 'TIMESTAMP',
    UUID: 'UUID',
    UUIDV4: 'UUIDV4',
    BLOB: 'BLOB',
    ENUM: 'ENUM',
    JSON: 'JSON',
    JSONB: 'JSONB',
    ARRAY: 'ARRAY',
    GEOMETRY: 'GEOMETRY',
    GEOGRAPHY: 'GEOGRAPHY',
    RANGE: 'RANGE',
    TINYSTRING: 'TINYSTRING',
    TINYINTEGER: 'TINYINTEGER',
    UnsignedBigInt: 'UnsignedBigInt',
  },
};

export const DEFAULT_OPTIONS = [
  { name: 'As defined', id: 'AS_DEFINED', sequence: 1 },
  { name: 'Null', id: 'NULL', sequence: 2 },
  // { name: 'Current Timestamp', id: 'CUR_TIMESTAMP', sequence: 3 },
];

export const KEYS = {
  minLength: 'minLength',
  maxLength: 'maxLength',
  min: 'min',
  max: 'max',
  required: 'required',
  lowercase: 'lowercase',
  unique: 'unique',
  filter: 'filter',
  default: 'default',
  trim: 'trim',
  isEnum: 'isEnum',
  enum: 'enum',
  match: 'match',
  isAutoIncrement: 'isAutoIncrement',
  ref: 'ref',
  localField: 'localField',
  foreignField: 'foreignField',
  comment: 'comment',
  // sequelize
  primary: 'primary',
  tiny: 'tiny',
  refAttribute: 'refAttribute',
  relType: 'relType',
  innerDataType: 'innerDataType',
  private: 'private',
};

export const getAllDisableField = (type, fields, dbType, opt = {}) => {
  const TABLE_TYPES = ALL_TABLE_TYPES[dbType];
  const isArrayJson = type === TABLE_TYPES.ARRAY || type === TABLE_TYPES.JSON;
  let obj = {
    [KEYS.comment]: isArrayJson || type === TABLE_TYPES.POINT,
  };
  if (dbType === DB_TYPE.MONGODB) {
    // mongoDB
    if (type === '_id') {
      // add value false for _id
      Object.keys(KEYS).forEach((x) => {
        obj[x] = true;
      });
      obj.type = true;
      obj[KEYS.attr] = false;
      obj[KEYS.default] = false;
    } else {
      const defaultVal = isArrayJson || [TABLE_TYPES.OBJECTID, TABLE_TYPES.VIRTUAL_RELATION, TABLE_TYPES.POINT, TABLE_TYPES.MAP,
        TABLE_TYPES.BUFFER, TABLE_TYPES.MIXED, TABLE_TYPES.SINGLELINE, TABLE_TYPES.MULTILINE].includes(type);
      obj = {
        ...obj,
        [KEYS.minLength]: type !== TABLE_TYPES.STRING && type !== TABLE_TYPES.SINGLELINE && type !== TABLE_TYPES.MULTILINE,
        [KEYS.maxLength]: type !== TABLE_TYPES.STRING && type !== TABLE_TYPES.SINGLELINE && type !== TABLE_TYPES.MULTILINE,
        [KEYS.match]: type !== TABLE_TYPES.STRING,
        [KEYS.min]: type !== TABLE_TYPES.DECIMAL && type !== TABLE_TYPES.NUMBER && type !== TABLE_TYPES.DATE,
        [KEYS.max]: type !== TABLE_TYPES.DECIMAL && type !== TABLE_TYPES.NUMBER && type !== TABLE_TYPES.DATE,
        [KEYS.lowercase]: !(type === TABLE_TYPES.STRING || type === TABLE_TYPES.SINGLELINE || type === TABLE_TYPES.MULTILINE || type === TABLE_TYPES.URL || type === TABLE_TYPES.EMAIL),
        [KEYS.trim]: !(type === TABLE_TYPES.STRING || type === TABLE_TYPES.SINGLELINE || type === TABLE_TYPES.MULTILINE || type === TABLE_TYPES.URL || type === TABLE_TYPES.EMAIL),
        // index: type === TABLE_TYPES.VIRTUAL_RELATION || type === TABLE_TYPES.OBJECTID || type === TABLE_TYPES.ARRAY || type === TABLE_TYPES.JSON,
        [KEYS.filter]: defaultVal,
        [KEYS.default]: defaultVal,
        [KEYS.required]: isArrayJson || type === TABLE_TYPES.POINT,
        [KEYS.unique]: isArrayJson || type === TABLE_TYPES.POINT || type === TABLE_TYPES.BOOL,
        [KEYS.isAutoIncrement]: type !== TABLE_TYPES.NUMBER,
        [KEYS.comment]: isArrayJson || type === TABLE_TYPES.POINT,
        [KEYS.private]: isArrayJson || type === TABLE_TYPES.POINT,
      };
    }
    if (fields?.isAutoIncrement) {
      [KEYS.isEnum, KEYS.filter, KEYS.default, KEYS.minLength, KEYS.maxLength, KEYS.min, KEYS.max, KEYS.match].forEach((x) => {
        obj[x] = true;
      });
    }
    if (opt?.attr === '_id') {
      // Add default attribute "_id" for mongoose
      Object.keys(KEYS).forEach((x) => {
        obj[x] = true;
      });
      obj.type = true;
      obj.attr = true;
    }
  } else {
    // manage sequelize DB

    // eslint-disable-next-line no-lonely-if
    if (opt?.attr === 'id') {
      // Add default attribute "id" for sql
      Object.keys(KEYS).forEach((x) => {
        obj[x] = true;
      });
      obj.type = true;
      obj.attr = true;
    } else {
      obj = {
        ...obj,
        [KEYS.minLength]: ![TABLE_TYPES.TINYSTRING, TABLE_TYPES.STRING, TABLE_TYPES.TEXT, TABLE_TYPES.CHAR].includes(type),
        [KEYS.maxLength]: ![TABLE_TYPES.TINYSTRING, TABLE_TYPES.STRING, TABLE_TYPES.TEXT, TABLE_TYPES.CHAR].includes(type),
        [KEYS.isAutoIncrement]: type !== TABLE_TYPES.TINYINTEGER && type !== TABLE_TYPES.INTEGER && type !== TABLE_TYPES.BIGINT && type !== TABLE_TYPES.UnsignedBigInt,
        [KEYS.unique]: type !== TABLE_TYPES.STRING && type !== TABLE_TYPES.TEXT && type !== TABLE_TYPES.CHAR,
        [KEYS.primary]: [TABLE_TYPES.BLOB, TABLE_TYPES.ENUM, TABLE_TYPES.JSONB, TABLE_TYPES.JSON,
          TABLE_TYPES.ARRAY, TABLE_TYPES.GEOGRAPHY, TABLE_TYPES.GEOMETRY, TABLE_TYPES.RANGE].includes(type),
        [KEYS.required]: [TABLE_TYPES.DATE, TABLE_TYPES.DATEONLY, TABLE_TYPES.TIMESTAMP, TABLE_TYPES.UUID, TABLE_TYPES.UUIDV4,
          TABLE_TYPES.BLOB, TABLE_TYPES.ENUM, TABLE_TYPES.JSONB, TABLE_TYPES.JSON,
          TABLE_TYPES.ARRAY, TABLE_TYPES.GEOGRAPHY, TABLE_TYPES.GEOMETRY, TABLE_TYPES.RANGE].includes(type),
        // [KEYS.tiny]: type !== TABLE_TYPES.BLOB && type !== TABLE_TYPES.TEXT,
        [KEYS.min]: ![TABLE_TYPES.TINYINTEGER, TABLE_TYPES.INTEGER, TABLE_TYPES.BIGINT, TABLE_TYPES.FLOAT, TABLE_TYPES.DOUBLE,
          TABLE_TYPES.REAL, TABLE_TYPES.DECIMAL, TABLE_TYPES.UnsignedBigInt].includes(type),
        [KEYS.max]: ![TABLE_TYPES.TINYINTEGER, TABLE_TYPES.INTEGER, TABLE_TYPES.BIGINT, TABLE_TYPES.FLOAT, TABLE_TYPES.DOUBLE,
          TABLE_TYPES.REAL, TABLE_TYPES.DECIMAL, TABLE_TYPES.UnsignedBigInt].includes(type),
        [KEYS.trim]: true,
        [KEYS.lowercase]: ![TABLE_TYPES.TINYSTRING, TABLE_TYPES.STRING, TABLE_TYPES.TEXT, TABLE_TYPES.CHAR].includes(type),
        [KEYS.match]: ![TABLE_TYPES.STRING, TABLE_TYPES.TEXT, TABLE_TYPES.CHAR].includes(type),
        [KEYS.default]: [TABLE_TYPES.UUID, TABLE_TYPES.UUIDV4, TABLE_TYPES.BLOB, TABLE_TYPES.JSON,
          TABLE_TYPES.JSONB, TABLE_TYPES.ARRAY, TABLE_TYPES.GEOGRAPHY, TABLE_TYPES.GEOMETRY,
          TABLE_TYPES.RANGE].includes(type),
        [KEYS.filter]: [TABLE_TYPES.UUID, TABLE_TYPES.UUIDV4, TABLE_TYPES.BLOB, TABLE_TYPES.JSON,
          TABLE_TYPES.JSONB, TABLE_TYPES.ARRAY, TABLE_TYPES.GEOGRAPHY, TABLE_TYPES.GEOMETRY,
          TABLE_TYPES.RANGE].includes(type),
      };
      if (fields?.isAutoIncrement) {
        [KEYS.isEnum, KEYS.filter, KEYS.default, KEYS.minLength, KEYS.maxLength, KEYS.min, KEYS.max, KEYS.match].forEach((x) => {
          obj[x] = true;
        });
      }
      if (fields?.unique) {
        obj.default = true;
        obj.filter = true;
      }

      if (fields?.default || fields?.filter) {
        obj.unique = true;
      }
    }
    obj[KEYS.isAutoIncrement] = true;
  }

  if (fields?.match && !obj[KEYS.match]) {
    // pattern enable then remove other validation
    [KEYS.minLength, KEYS.maxLength, KEYS.lowercase, KEYS.trim].forEach((x) => {
      obj[x] = true;
    });
  }

  return obj;
};

export const ERROR_MSG = {
  min: 'Default value must be greater than or equal to Min value',
  max: 'Default value must be less than or equal to Max value',
  minLength: 'Default value length must be greater than or equal to MinLength',
  maxLength: 'Default value length must be less than or equal to MaxLength ',
  minMax: 'Min value must be less than Max value',
  minMaxLength: 'MinLength must be less than MaxLength',
  foreignField: 'Select foreignField',
  localField: 'Select localField',
  type: 'Please input valid type',
  point: 'Please input attribute having type Array',
  match: 'Please input valid pattern',
  pointAttr: 'For type point, attribute name must be type',
  ref: 'Select model for relation',
  refAttr: 'Select attribute for relation',
  relType: 'Select type for relation',
  indexType: 'Please input index data type',
  indexName: 'Index name already exists',
  attribute: 'Index contains duplicate attribute.',
  ttl: 'Please input time in seconds to create TTL.',
  requiredAttr: 'Please input attribute.',
  requiredIndexType: 'Please select index type.',
  requiredSubIndex: 'Please input atleast one attribute and type.',
  requiredSqlSubIndex: 'Please input atleast one attribute.',
  attrName: 'Please input valid attribute name',
  email: 'Please input valid email for attribute having type Email',
  duplicateAttr: 'Schema contains duplicate attribute.',
  matchRegex: 'Please input valid default value as per pattern',
  percentage: 'Please input default value beween 0 to 100',
  url: 'Please input valid URL',
};

const MONGOOSE_TYPES = {
  SCHEMA_TYPES_OBJ: 'mongoose.schema.types.objectid',
  TYPES_OBJ: 'mongoose.types.objectid',
};

// eslint-disable-next-line consistent-return
export const getAllParsedType = (type, TABLE_TYPES) => {
  if (type) {
    // eslint-disable-next-line no-param-reassign
    if (toLower(type) === MONGOOSE_TYPES.SCHEMA_TYPES_OBJ || toLower(type) === MONGOOSE_TYPES.TYPES_OBJ) { type = TABLE_TYPES.OBJECTID; }
    return type && Object.values(TABLE_TYPES).find((t) => toLower(t) === toLower((type)));
  } return type;
};

const SQL_TYPE_KEYS = {
  [ALL_TABLE_TYPES.POSTRAGSQL.STRING]: [KEYS.private, KEYS.ref, KEYS.refAttribute, KEYS.relType, KEYS.primary, KEYS.required, KEYS.unique, KEYS.default, KEYS.minLength, KEYS.maxLength, KEYS.lowercase, KEYS.match],
  [ALL_TABLE_TYPES.POSTRAGSQL.TINYSTRING]: [KEYS.private, KEYS.ref, KEYS.refAttribute, KEYS.relType, KEYS.primary, KEYS.required, KEYS.unique, KEYS.default, KEYS.minLength, KEYS.maxLength, KEYS.lowercase],
  [ALL_TABLE_TYPES.POSTRAGSQL.TEXT]: [KEYS.private, KEYS.ref, KEYS.refAttribute, KEYS.relType, KEYS.primary, KEYS.required, KEYS.unique, KEYS.default, KEYS.minLength, KEYS.maxLength, KEYS.lowercase, KEYS.match],
  [ALL_TABLE_TYPES.POSTRAGSQL.CHAR]: [KEYS.private, KEYS.ref, KEYS.refAttribute, KEYS.relType, KEYS.primary, KEYS.required, KEYS.unique, KEYS.default, KEYS.minLength, KEYS.maxLength, KEYS.lowercase, KEYS.match],
  [ALL_TABLE_TYPES.POSTRAGSQL.BOOL]: [KEYS.private, KEYS.ref, KEYS.refAttribute, KEYS.relType, KEYS.primary, KEYS.required, KEYS.default],
  [ALL_TABLE_TYPES.POSTRAGSQL.INTEGER]: [KEYS.private, KEYS.ref, KEYS.refAttribute, KEYS.relType, KEYS.primary, KEYS.required, KEYS.default, KEYS.min, KEYS.max, KEYS.isAutoIncrement],
  [ALL_TABLE_TYPES.POSTRAGSQL.TINYINTEGER]: [KEYS.private, KEYS.ref, KEYS.refAttribute, KEYS.relType, KEYS.primary, KEYS.required, KEYS.default, KEYS.min, KEYS.max, KEYS.isAutoIncrement],
  [ALL_TABLE_TYPES.POSTRAGSQL.BIGINT]: [KEYS.private, KEYS.ref, KEYS.refAttribute, KEYS.relType, KEYS.primary, KEYS.required, KEYS.default, KEYS.min, KEYS.max, KEYS.isAutoIncrement],
  [ALL_TABLE_TYPES.POSTRAGSQL.FLOAT]: [KEYS.private, KEYS.ref, KEYS.refAttribute, KEYS.relType, KEYS.primary, KEYS.required, KEYS.default, KEYS.min, KEYS.max],
  [ALL_TABLE_TYPES.POSTRAGSQL.REAL]: [KEYS.private, KEYS.ref, KEYS.refAttribute, KEYS.relType, KEYS.primary, KEYS.required, KEYS.default, KEYS.min, KEYS.max],
  [ALL_TABLE_TYPES.POSTRAGSQL.DOUBLE]: [KEYS.private, KEYS.ref, KEYS.refAttribute, KEYS.relType, KEYS.primary, KEYS.required, KEYS.default, KEYS.min, KEYS.max],
  [ALL_TABLE_TYPES.POSTRAGSQL.DECIMAL]: [KEYS.private, KEYS.ref, KEYS.refAttribute, KEYS.relType, KEYS.primary, KEYS.required, KEYS.default, KEYS.min, KEYS.max],
  [ALL_TABLE_TYPES.POSTRAGSQL.DATE]: [KEYS.private, KEYS.ref, KEYS.refAttribute, KEYS.relType, KEYS.primary, KEYS.default],
  [ALL_TABLE_TYPES.POSTRAGSQL.DATEONLY]: [KEYS.private, KEYS.ref, KEYS.refAttribute, KEYS.relType, KEYS.primary, KEYS.default],
  [ALL_TABLE_TYPES.POSTRAGSQL.UUID]: [KEYS.private, KEYS.ref, KEYS.refAttribute, KEYS.relType, KEYS.primary],
  [ALL_TABLE_TYPES.POSTRAGSQL.UUIDV4]: [KEYS.private, KEYS.ref, KEYS.refAttribute, KEYS.relType, KEYS.primary],
  [ALL_TABLE_TYPES.POSTRAGSQL.BLOB]: [KEYS.private, KEYS.ref, KEYS.refAttribute, KEYS.relType, KEYS.required],
  [ALL_TABLE_TYPES.POSTRAGSQL.ENUM]: [KEYS.private, KEYS.ref, KEYS.refAttribute, KEYS.relType, KEYS.default, KEYS.isEnum, KEYS.enum],
  [ALL_TABLE_TYPES.POSTRAGSQL.JSONB]: [KEYS.private, KEYS.ref, KEYS.refAttribute, KEYS.relType],
  [ALL_TABLE_TYPES.POSTRAGSQL.JSON]: [KEYS.private, KEYS.ref, KEYS.refAttribute, KEYS.relType],
  [ALL_TABLE_TYPES.POSTRAGSQL.ARRAY]: [KEYS.private, KEYS.ref, KEYS.refAttribute, KEYS.relType, KEYS.innerDataType],
  [ALL_TABLE_TYPES.POSTRAGSQL.GEOMETRY]: [KEYS.private, KEYS.ref, KEYS.refAttribute, KEYS.relType],
  [ALL_TABLE_TYPES.POSTRAGSQL.GEOGRAPHY]: [KEYS.private, KEYS.ref, KEYS.refAttribute, KEYS.relType],
  [ALL_TABLE_TYPES.POSTRAGSQL.RANGE]: [KEYS.private, KEYS.ref, KEYS.refAttribute, KEYS.relType, KEYS.innerDataType],
  [ALL_TABLE_TYPES.MYSQL.TIMESTAMP]: [KEYS.private, KEYS.ref, KEYS.refAttribute, KEYS.relType, KEYS.primary, KEYS.default],
  [ALL_TABLE_TYPES.MYSQL.UnsignedBigInt]: [KEYS.private, KEYS.ref, KEYS.refAttribute, KEYS.relType, KEYS.primary, KEYS.required, KEYS.default, KEYS.min, KEYS.max, KEYS.isAutoIncrement],
};

const ALL_TYPE_KEYS = {
  [DB_TYPE.MONGODB]: {
    [ALL_TABLE_TYPES.MONGODB.EMAIL]: [KEYS.private, KEYS.required, KEYS.unique, KEYS.default, KEYS.lowercase, KEYS.trim],
    [ALL_TABLE_TYPES.MONGODB.STRING]: [KEYS.private, KEYS.required, KEYS.unique, KEYS.default, KEYS.minLength, KEYS.maxLength, KEYS.lowercase, KEYS.trim, KEYS.match, KEYS.enum, KEYS.isEnum],
    [ALL_TABLE_TYPES.MONGODB.NUMBER]: [KEYS.private, KEYS.required, KEYS.unique, KEYS.default, KEYS.min, KEYS.max, KEYS.enum, KEYS.isEnum, KEYS.isAutoIncrement],
    [ALL_TABLE_TYPES.MONGODB.BOOL]: [KEYS.private, KEYS.required, KEYS.unique, KEYS.default],
    [ALL_TABLE_TYPES.MONGODB.MIXED]: [KEYS.private, KEYS.required, KEYS.unique],
    [ALL_TABLE_TYPES.MONGODB.DATE]: [KEYS.private, KEYS.required, KEYS.unique, KEYS.default],
    [ALL_TABLE_TYPES.MONGODB.BUFFER]: [KEYS.private, KEYS.required, KEYS.unique],
    [ALL_TABLE_TYPES.MONGODB.MAP]: [KEYS.private, KEYS.required, KEYS.unique],
    [ALL_TABLE_TYPES.MONGODB.OBJECTID]: [KEYS.private, KEYS.required, KEYS.unique, KEYS.ref],
    [TYPES.REF]: [KEYS.private, KEYS.required, KEYS.unique, KEYS.ref], // ref and objectid are same
    [ALL_TABLE_TYPES.MONGODB.SINGLELINE]: [KEYS.private, KEYS.required, KEYS.unique, KEYS.minLength, KEYS.maxLength, KEYS.lowercase, KEYS.trim],
    [ALL_TABLE_TYPES.MONGODB.MULTILINE]: [KEYS.private, KEYS.required, KEYS.unique, KEYS.minLength, KEYS.maxLength, KEYS.lowercase, KEYS.trim],
    [ALL_TABLE_TYPES.MONGODB.URL]: [KEYS.private, KEYS.required, KEYS.unique, KEYS.default, KEYS.lowercase, KEYS.trim],
    [ALL_TABLE_TYPES.MONGODB.DECIMAL]: [KEYS.private, KEYS.required, KEYS.unique, KEYS.default, KEYS.min, KEYS.max],
    [ALL_TABLE_TYPES.MONGODB.PERCENT]: [KEYS.private, KEYS.required, KEYS.unique, KEYS.default],
    [ALL_TABLE_TYPES.MONGODB.VIRTUAL_RELATION]: [KEYS.private, KEYS.required, KEYS.unique, KEYS.ref, KEYS.localField, KEYS.foreignField],
    [ALL_TABLE_TYPES.MONGODB.POINT]: [],
  },
  [DB_TYPE.POSTRAGSQL]: SQL_TYPE_KEYS,
  [DB_TYPE.MYSQL]: SQL_TYPE_KEYS,
  [DB_TYPE.SQL]: SQL_TYPE_KEYS,
};

export const RELATION_TYPE = {
  HAS_ONE: 1,
  HAS_MANY: 2,
};

export const SEQUELIZE_RELATION_TYPE = [{ id: 1, name: 'hasOne' }, { id: 2, name: 'hasMany' }];

// model-hooks
export const HOOKS = {
  TYPE: {
    PRE: 'pre',
    POST: 'post',
  },
  OPERATIONS: {
    PRE: {
      SAVE: 'save',
      REMOVE: 'remove',
      VALIDATE: 'validate',
      FIND: 'find',
      INIT: 'init',
      UPDATEONE: 'updateOne',
      AGGREGATE: 'aggregate',
    },
    POST: {
      SAVE: 'save',
      REMOVE: 'remove',
      VALIDATE: 'validate',
      FIND: 'find',
      UPDATE: 'update',
      INIT: 'init',
    },
  },
};

export const nodeHooksData = () => {
  function getData(arr, type) {
    return Object.keys(arr).map((x) => ({ id: `${type}-${arr[x]}`, name: `${type}-${arr[x]}` }));
  }
  const preHooks = getData(HOOKS.OPERATIONS.PRE, HOOKS.TYPE.PRE);
  const postHooks = getData(HOOKS.OPERATIONS.PRE, HOOKS.TYPE.POST);
  return preHooks.concat(postHooks);
};

export const getHookData = () => {
  const hooksData = nodeHooksData();
  return hooksData;
};

export const DEFAULT_VALUES = {
  attr: '',
  type: '',
  isEnum: false,
  filter: '',
  default: '',
  min: '',
  minLength: '',
  max: '',
  maxLength: '',
  match: '',
  lowercase: false,
  trim: false,
  required: false,
  unique: false,
  isAutoIncrement: false,
  // tiny: false,
  innerDataType: '',
  primary: false,
  private: false,
  refAttribute: '',
  relType: RELATION_TYPE.HAS_MANY,
  ref: '',
  enum: null,
};

export const MONGO_TOTAL_FIELDS = 14;
export const SQL_TOTAL_FIELDS = 15;
export const SQL_FIELD_SEQ = {
  attr: 1,
  type: 2,
  innerDataType: 3, // same col
  isEnum: 3, // same col
  filter: 4,
  default: 5,
  relation: 6,
  private: 7,
  primary: 8,
  // tiny: 9,
  required: 10,
  unique: 11,
  isAutoIncrement: 12,
  minimum: 13,
  maximum: 14,
  lowercase: 15,
  match: 16,
};

export const ALL_FIELD_SEQ = {
  [DB_TYPE.MONGODB]: {
    attr: 1,
    type: 2,
    localField: 3,
    subAttr: 4, // same seq as conditionally exists in same column
    isEnum: 4, // same seq as conditionally exists in same column
    relation: 4, // same seq as conditionally exists in same column
    filter: 5,
    default: 6,
    private: 7,
    required: 8,
    unique: 9,
    isAutoIncrement: 10,
    minimum: 11,
    maximum: 12,
    lowercase: 13,
    trim: 14,
    match: 15,
  },
  [DB_TYPE.POSTRAGSQL]: SQL_FIELD_SEQ,
  [DB_TYPE.SQL]: SQL_FIELD_SEQ,
  [DB_TYPE.MYSQL]: SQL_FIELD_SEQ,
};

export const getFieldPosition = (index, dbType) => {
  const FIELD_SEQ = ALL_FIELD_SEQ[dbType];
  const TOTAL_FIELDS = dbType === DB_TYPE.MONGODB ? MONGO_TOTAL_FIELDS : SQL_TOTAL_FIELDS;

  const focIndex = index * TOTAL_FIELDS;
  const FiledPosition = {
    attr: focIndex + FIELD_SEQ.attr,
    type: focIndex + FIELD_SEQ.type,
    localField: focIndex + FIELD_SEQ.localField,
    subAttr: focIndex + FIELD_SEQ.subAttr,
    isEnum: focIndex + FIELD_SEQ.isEnum,
    relation: focIndex + FIELD_SEQ.relation,
    innerDataType: focIndex + FIELD_SEQ.innerDataType,
    filter: focIndex + FIELD_SEQ.filter,
    default: focIndex + FIELD_SEQ.default,
    primary: focIndex + FIELD_SEQ.primary,
    private: focIndex + FIELD_SEQ.private,
    // tiny: focIndex + FIELD_SEQ.tiny,
    required: focIndex + FIELD_SEQ.required,
    unique: focIndex + FIELD_SEQ.unique,
    isAutoIncrement: focIndex + FIELD_SEQ.isAutoIncrement,
    minimum: focIndex + FIELD_SEQ.minimum,
    maximum: focIndex + FIELD_SEQ.maximum,
    lowercase: focIndex + FIELD_SEQ.lowercase,
    trim: focIndex + FIELD_SEQ.trim,
    match: focIndex + FIELD_SEQ.match,
  };
  return { FiledPosition, FIELD_SEQ, TOTAL_FIELDS };
};

export const SUB_TOTAL_FIELDS = 14;

export const SUB_FIELD_SEQ = {
  attr: 1,
  type: 2,
  localField: 3,
  isEnum: 4, // same seq as conditionally exists in same column
  relation: 4, // same seq as conditionally exists in same column
  filter: 5,
  default: 6,
  required: 7,
  unique: 8,
  isAutoIncrement: 9,
  minimum: 10,
  maximum: 11,
  lowercase: 12,
  trim: 13,
  match: 14,
};

export const getSubFieldPosition = (index) => {
  const focIndex = index * SUB_TOTAL_FIELDS;
  const FiledPosition = {
    attr: focIndex + SUB_FIELD_SEQ.attr,
    type: focIndex + SUB_FIELD_SEQ.type,
    localField: focIndex + SUB_FIELD_SEQ.localField,
    isEnum: focIndex + SUB_FIELD_SEQ.isEnum,
    relation: focIndex + SUB_FIELD_SEQ.relation,
    filter: focIndex + SUB_FIELD_SEQ.filter,
    default: focIndex + SUB_FIELD_SEQ.default,
    required: focIndex + SUB_FIELD_SEQ.required,
    unique: focIndex + SUB_FIELD_SEQ.unique,
    isAutoIncrement: focIndex + SUB_FIELD_SEQ.isAutoIncrement,
    minimum: focIndex + SUB_FIELD_SEQ.minimum,
    maximum: focIndex + SUB_FIELD_SEQ.maximum,
    lowercase: focIndex + SUB_FIELD_SEQ.lowercase,
    trim: focIndex + SUB_FIELD_SEQ.trim,
    match: focIndex + SUB_FIELD_SEQ.match,
  };
  return { FiledPosition };
};

export const DEFAULT_TYPE_LENGTH = {
  STRING: 255,
  CHAR: 255,
};

// functions by dbType
export const util = {
  getTableTypes: (dbType) => ALL_TABLE_TYPES[dbType],
  getTypeKeys: (dbType) => ALL_TYPE_KEYS[dbType],
  getTypeOptions: (dbType) => (ALL_TABLE_TYPES?.[dbType]
    ? Object.keys(ALL_TABLE_TYPES[dbType])
      .filter((x) => ((x !== ALL_TABLE_TYPES[dbType].TIMESTAMP && x !== ALL_TABLE_TYPES[dbType].UnsignedBigInt)))
      .map((x, i) => ({
        id: ALL_TABLE_TYPES[dbType][x],
        name: dbType === DB_TYPE.MONGODB
          ? TABLE_TYPES_NAME.MONGODB[x] : TABLE_TYPES_NAME.SQL[x],
        sequence: i + 1,
      })) : []),
};
export const getParsedType = (type, dbType) => getAllParsedType(type, ALL_TABLE_TYPES[dbType]);

const EXCLUDE_PARSE_KEYS = ['type'];

export const parsedKeys = (obj, dbType) => {
  if (!obj) return;
  const TYPE_KEYS = util.getTypeKeys(dbType);

  let isSub = false;
  const json = { ...obj };
  Object.keys(json).map((k) => {
    if (EXCLUDE_PARSE_KEYS.includes(k)) return k;
    if (k === 'minlength') {
      // eslint-disable-next-line no-param-reassign
      k = KEYS.minLength;
      json[k] = json.minlength;
      delete json.minlength;
    }
    if (k === 'maxlength') {
      // eslint-disable-next-line no-param-reassign
      k = KEYS.maxLength;
      json[k] = json.maxlength;
      delete json.maxlength;
    }
    if (json.type && TYPE_KEYS[json.type]) {
      if (!TYPE_KEYS[json.type].includes(k)) {
        if (!isSub && !['description', 'attr', 'key'].includes(k)) { isSub = true; }
        delete json[k];
      }
    }
    return k;
  });
  // eslint-disable-next-line consistent-return
  return { json, isSub };
};

export const getParsedKeys = (obj, dbType) => (obj ? parsedKeys(obj, dbType).json : null);
export const getDisableField = (type, fields, dbType, opt) => getAllDisableField(type, fields, dbType, opt);
export const isNumberType = (type, TABLE_TYPES) => [TABLE_TYPES.NUMBER, TABLE_TYPES.TINYINTEGER, TABLE_TYPES.INTEGER, TABLE_TYPES.TINYINTEGER, TABLE_TYPES.BIGINT,
  TABLE_TYPES.FLOAT, TABLE_TYPES.REAL, TABLE_TYPES.DECIMAL, TABLE_TYPES.DOUBLE, TABLE_TYPES.UnsignedBigInt].includes(type);

export const ModelPanel = {
  CUSTOM: { name: 'Custom', tabIndex: 0 },
  LIBRARY: { name: 'Library', tabIndex: 1 },
};

export const getSQLHookTemplate = (operation) => {
  if (!operation) return '';
  let hookName = '';
  switch (operation) {
    case 'save':
      hookName = 'Create';
      break;
    case 'remove':
      hookName = 'Destroy';
      break;
    case 'validate':
      hookName = 'Validate';
      break;
    case 'find':
      hookName = 'Find';
      break;
    case 'init':
      hookName = 'Init';
      break;
    case 'updateOne':
      hookName = 'Update';
      break;
    case 'aggregate':
      hookName = 'Query';
      break;
    default: hookName = '';
  }
  return hookName;
};

export const SQL_MODEL_NAME_LENGTH = 64; // 64 characters for MySQL database
export const MODEL_NAME_LENGTH = 127; // 127 bytes
export const MONGODB_INDEX_NAME_LENGTH = 127;

// Don't change formatting of below function
export const getHookHeader = ({
  dbType, type, operation, modelName, currentApplicationCode,
}) => {
  const startLine = '/*Method start*/';
  const endLine = '/*You can write business logic*/';

  if (currentApplicationCode === APPLICATION_CODE.nodeExpress) {
    if (dbType === DB_TYPE.MONGODB) {
      return `${startLine}
schema.${type}('${operation}', async function(${type === 'post' ? 'docs, ' : ''}next) {

${endLine}`;
    }
    const op = getSQLHookTemplate(operation);
    return `${startLine}
${type === HOOKS.TYPE.PRE ? 'before' : 'after'}${op}: [
async function (${modelName}, options){

${endLine}`;
  }

  return `${endLine}`;
};

// Don't change formatting of below function
export const getHookFooter = ({ dbType, currentApplicationCode }) => {
  const startLine = '/*Method close*/';
  if (currentApplicationCode === APPLICATION_CODE.nodeExpress) {
    if (dbType === DB_TYPE.MONGODB) {
      return `${startLine}
    next();
})`;
    }
    return `${startLine}
    },
]`;
  }

  return `${startLine}
}`;
};
export const mongoDbModalName = /^[a-zA-Z_]+[\w0-9_]*$/;

export const pluralizeTableName = (modelName = '') => (pluralize(modelName));
