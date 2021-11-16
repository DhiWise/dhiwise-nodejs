import { APPLICATION_CODE, ORM_TYPE } from './Project/applicationStep';

export const UPLOAD_ATTACHMENT_OPTIONS = [
  { name: 'local upload', id: 'local' },
  { name: 'S3 public upload', id: 'S3' },
  { name: 'S3 private upload', id: 's3_private' },

];

export const APPLICATION_CONFIG_TABS = {
  [APPLICATION_CODE.nodeExpress]: ['Authentication', 'Social auth', 'Security', 'Upload attachment', 'Data format config'],
};

export const DISABLED_QUERY_PARAMETER_KEYS = ['_id', 'id', 'createdAt', 'updatedAt', 'addedBy', 'updatedBy'];

export const QUERY_PARAMETER_SUPPORTED_TYPES = {
  [ORM_TYPE.MONGOOSE]: ['String', 'Number', 'Email'],
  [ORM_TYPE.SEQUELIZE]: ['STRING', 'CHAR', 'TEXT', 'INTEGER', 'DOUBLE', 'FLOAT', 'DECIMAL'],
  [ORM_TYPE.ELOQUENT]: ['STRING', 'CHAR', 'TEXT', 'INTEGER', 'DOUBLE', 'FLOAT', 'DECIMAL'],
};

export const ATTRIBUTE_FORMAT_DATA_TYPE = {
  DATE: 'date',
  BOOLEAN: 'boolean',
  STRING: 'string',
};

export const MODEL_TYPE = {
  ALL: 1,
  SINGLE: 2,
};

export const DATE_OPTIONS = ['h:mm A', 'h:mm:ss A', 'MM/DD/YYYY', 'MMMM D, YYYY', 'MMMM D, YYYY h:mm A', 'dddd, MMMM D, YYYY h:mm A', 'M/D/YYYY', 'MMM D, YYYY', 'MMM D, YYYY h:mm A', 'ddd, MMM D, YYYY h:mm A'];

export const STR_OPERATORS = ['space', ',', '|'];
