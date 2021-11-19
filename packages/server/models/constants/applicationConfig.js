module.exports = {
  ORM_TYPE: {
    MONGOOSE: 1,
    SEQUELIZE: 2,
    ELOQUENT: 3,
  },
  DATABASE_TYPE: {
    MONGODB: 1,
    SQL: 2,
    MYSQL: 3,
    POSTGRE_SQL: 4,
  },
  FILE_TYPES: {
    FILE: 1,
    DIRECTORY: 2,
  },
  APPLICATION_ID_URL: ['/web/v1/application/download-zip'],
  GENERATOR_ORM_TYPE: {
    1: 'mongoose',
    2: 'sequelize',
  },
  GENERATOR_DATABASE_TYPE: {
    1: 'mongodb',
    2: 'mssql',
    3: 'mysql',
    4: 'postgres',
  },
  FIRE_STORE_SCHEMA_TYPE: {
    COLLECTION: 1,
    RULES: 2,
  },
  SCREEN_WISE_DATA_TYPE: {
    SCREEN_NAME_CHANGE: 1,
    SPLASH_SCREEN: 2,
  },
};
