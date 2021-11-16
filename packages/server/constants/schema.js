module.exports = {

  DATA_TYPES: {
    EMAIL: {
      attributes: ['default', 'lowercase', 'trim'],
      value: 'Email',
    },
    STRING: {
      attributes: ['default', 'lowercase', 'trim', 'minLength', 'maxLength', 'match'],
      value: 'String',
    },
    NUMBER: {
      attributes: ['default', 'min', 'max'],
      value: 'Number',
    },
    BOOLEAN: {
      attributes: ['default'],
      value: 'Boolean',
    },
    MIXED: {
      attributes: [],
      value: 'Mixed',
    },
    DATE: {
      attributes: ['default'],
      value: 'Date',
    },
    BUFFER: {
      attributes: ['Buffer'],
      value: 'Buffer',
    },
    MAP: {
      attributes: ['Map'],
      value: 'Map',
    },
    OBJECTID: {
      attributes: ['ref'],
      value: 'ObjectId',
    },
    // REF: ['ref'],
    SINGLELINE: {
      attributes: ['minLength', 'maxLength', 'lowercase', 'trim'],
      value: 'SingleLine',
    },
    MULTILINE: {
      attributes: ['minLength', 'maxLength', 'lowercase', 'trim'],
      value: 'MultiLine',
    },
    URL: {
      attributes: ['default', 'lowercase', 'trim'],
      value: 'URL',
    },
    DECIMAL: {
      attributes: ['default'],
      value: 'Decimal',
    },
    PERCENT: {
      attributes: ['default'],
      value: 'Percentage',
    },
    VIRTUAL_RELATION: {
      attributes: ['ref', 'localField', 'foreignField'],
      value: 'virtualRelation',
    },
    JSON: {
      attributes: [],
      value: 'JSON',
    },
    ARRAY: {
      attributes: [],
      value: 'Array',
    },
  },
  DATA_TYPES_DEFAULT_PROPS: ['required', 'unique', 'type', 'isAutoIncrement'],
  MONGOOSE_TYPES: {
    SCHEMA_TYPES_OBJ: 'mongoose.schema.types.objectid',
    TYPES_OBJ: 'mongoose.types.objectid',
  },
  VALIDATION_MESSAGES: {

    INVALID_TYPE_PROP: 'Invalid type property.',
    MISSING_TYPE_PROP: 'Missing type property.',
    MISSING_REF_PROPS: 'Missing ref property.',
    MISSING_LOCAL_FIELD_PROPS: 'Missing localField property.',
    MISSING_FOREIGN_FIELD_PROPS: 'Missing foreignField property.',
    MAX_MUST_GREATER_TO_MIN: 'Max value must be greater than Min value.',
    DEFAULT_MUST_GREATER_OR_EQUAL_TO_MIN: 'Default value must be greater than or equal to Min value.',
    DEFAULT_MUST_LOWER_OR_EQUAL_TO_MAX: 'Default value must be less than or equal to Max value.',
    MAX_LENGTH_MUST_GREATER_TO_MIN_LENGTH: 'MaxLength value must be greater than MinLength value.',
    DEFAULT_LENGTH_MUST_GREATER_OR_EQUAL_TO_MIN_LENGTH: 'Default value length must be greater than or equal to MinLength.',
    DEFAULT_LENGTH_MUST_LOWER_OR_EQUAL_TO_MAX_LENGTH: 'Default value length must be less than or equal to MaxLength.',
    ONLY_ZERO_INDEX_ALLOW: 'Only 0 index allow in array.',
    PROP_NOT_ALLOWED: 'Property not allowed',
    INVALID_REGEXP: 'Invalid regular expression',
    MISSING_RELATION_ATTR_PROP: 'Missing ref attribute property.',
    INVALID_DEFAULT_PROP_VALUE: 'Invalid value in default property.',
    UPDATE_MODEL_ERROR: 'Something went wrong, while updating model.',
    MODEL_NOT_FOUND: 'Oops! model not found.',
    SCHEMA_ALREADY_EXISTS: 'Schema of same name already exists.',
    INVALID_RELATION_TYPE_VAL: 'Invalid relation type value.',
  },
  SQL_EXTENSION: {
    APP_SQL: 'application/sql',
    APP_X_SQL: 'application/x-sql',
    TEXT_PLAIN: 'text/plain',
    APP_OCTET_STREAM: 'application/octet-stream',
  },
  RELATIONS_TYPES: {
    HAS_ONE: 1,
    HAS_MANY: 2,
  },
  SCHEMA_ORG_URL: 'https://schema.org',
  DEFAULT_TABLE_NAME: 'user',
  DEFAULT_FIELDS: {
    ID: 'id',
    IS_ACTIVE: 'isactive',
    ADDED_BY: 'addedby',
    UPDATED_BY: 'updatedby',
    CREATED_AT: 'createdat',
    UPDATED_AT: 'updatedat',
  },
};
