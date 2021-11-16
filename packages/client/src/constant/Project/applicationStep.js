const USER_TYPE = {
  USER: 1,
  ADMIN: 2,
};
const PLATFORM_TYPE = {
  Admin: 'Admin',
  Device: 'Mobile app',
  Desktop: 'Desktop',
  Client: 'Front(Website)',
};
const PLATFORM_VALUE = {
  Admin: 'admin',
  Device: 'device',
  Desktop: 'desktop',
  Client: 'client',
};
export const PLATFORM_FILTER = [
  { id: PLATFORM_VALUE.Admin, name: PLATFORM_TYPE.Admin },
  { id: PLATFORM_VALUE.Device, name: PLATFORM_TYPE.Device },
  { id: PLATFORM_VALUE.Desktop, name: PLATFORM_TYPE.Desktop },
  { id: PLATFORM_VALUE.Client, name: PLATFORM_TYPE.Client },
];

export const USER_TYPE_FILTER = [
  { id: USER_TYPE.USER, name: 'User' },
  { id: USER_TYPE.ADMIN, name: 'Admin' },
];

const AUTH_MODEL = {
  USER: 1,
};
const AUTH_MODEL_FILTER = [
  { id: AUTH_MODEL.USER, name: 'User' },
];

export const ORM_TYPE = {
  MONGOOSE: 1,
  SEQUELIZE: 2,
};

export const DATABASE_TYPE = {
  MONGODB: 1,
  SQL: 2,
  MYSQL: 3,
  POSTGRE_SQL: 4,
};

export const DATABASE_SELECTION = [
  { id: ORM_TYPE.MONGOOSE, name: 'Mongoose' },
  { id: ORM_TYPE.SEQUELIZE, name: 'Sequelize' },
];

const DATABASE_SEQUALIZE_SELECTION = [
  // [ORM_TYPE.MONGOOSE]: [
  { id: DATABASE_TYPE.MONGODB, name: 'MongoDB' },
  // ],
  // [ORM_TYPE.SEQUELIZE]: [
  { id: DATABASE_TYPE.MYSQL, name: 'MySQL' },
  { id: DATABASE_TYPE.SQL, name: 'SQL Server' },
  { id: DATABASE_TYPE.POSTGRE_SQL, name: 'PostgreSQL' },
  // ],
];

export const APP_NAME_PATTERN = {
  NODE_EXPRESS: /^([0-9 _-]*[a-zA-Z]){3,}[0-9 _-]*$/,

};

export const APP_NAME_VALIDATION_MESSAGE = {
  NODE_EXPRESS: {
    name: {
      required: 'Please enter application name.',
      minLength: 'Application name must be of minimum 1 characters.',
      maxLength: 'Application name must be of maximum 40 characters.',
      pattern: 'Application name can be alphanumeric and only allows - and _ special character',
      validate: 'Start your application name with an alphanumeric with a minimum of 3 alphabets, and (-, _) are allowed.',
      duplicate: 'Please enter different application name.',
    },
  },
};

export const APPLICATION_CODE = {
  nodeExpress: 'NODE_EXPRESS',
};

export const APPLICATION_STEP = [

  {
    name: 'configInput[port]',
    dbKey: 'configInput.port',
    description: 'Enter application port to connect with your application.',
    rules: { required: true, min: 1000, max: 65535 },
    component: 'numberInput',
    label: 'Application port*',
    placeholder: 'Enter application port',
    validationMsg: {
      required: 'Please enter application port.',
      min: 'Application port must be of minimum 1000.',
      max: 'Application port must be of maximum 65535.',
    },
    defaultValue: '5000',
    extraProps: {
    },
  },
  {
    name: 'stepInput[ormType]',
    dbKey: 'stepInput.ormType',
    ishidden: true,
    description: 'Code will get generated according to the selected ORM.',
    rules: { required: true },
    component: 'dropdown',
    label: 'ORM type*',
    placeholder: 'Select ORM type',
    validationMsg: {
      required: 'Please select ORM type.',
    },
    options: DATABASE_SELECTION,
    extraProps: {
    },
  },
  {
    name: 'stepInput[databaseType]',
    dbKey: 'stepInput.databaseType',
    description: 'Code will get generated according to the selected database type.',
    rules: { required: true },
    component: 'dropdown',
    label: 'Database type*',
    placeholder: 'Select database type',
    validationMsg: {
      required: 'Please select database type.',
    },
    options: DATABASE_SEQUALIZE_SELECTION,
    extraProps: {
    },
  },
  {
    name: 'configInput[databaseName]',
    dbKey: 'configInput.databaseName',
    description: 'Enter name of the database for your application.',
    rules: {
      required: true, minLength: 1, maxLength: 50, pattern: /^[a-zA-Z0-9_-]+$/,
    },
    component: 'input',
    label: 'Database name*',
    placeholder: 'Enter database name',
    validationMsg: {
      required: 'Please enter database name.',
      minLength: 'Database name must be of minimum 1 characters.',
      maxLength: 'Database name must be of maximum 50 characters.',
      pattern: 'Database name only includes alphanumeric, -, _.',
    },
    defaultValue: '',
  },
  {
    name: 'configInput[isAuthentication]',
    dbKey: 'configInput.isAuthentication',
    description: '',
    ishidden: true,
    rules: { required: false },
    component: 'checkbox',
    label: 'Authentication',
    placeholder: 'Authentication',
    validationMsg: {
      required: '',
    },
    defaultValue: true,
  },
  {
    name: 'authModel',
    dbKey: 'authModel',
    ishidden: true,
    description: 'Select authentication model.',
    rules: { required: true },
    component: 'dropdown',
    label: 'Auth model',
    placeholder: 'Select auth model',
    validationMsg: {
      required: 'Please select auth model.',
    },
    defaultValue: AUTH_MODEL.USER,
    options: AUTH_MODEL_FILTER,
    extraProps: {
      disabled: true,
    },
  },

];

export const APPLICATION_DASHBOARD = {
  NODE_EXPRESS: '/node/dashboard',
};

export const APPLICATION_PAGE_HEADING = {
  NODE_EXPRESS: 'node',
};
