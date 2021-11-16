module.exports = {
  MODULE: {
    MASTER: {
      VALUE: 3,
      MODEL_NAME: 'masters',
      LOG_ATTRIBUTES: ['name', 'code'],
      GLOBAL_SEARCH_KEYS: ['code', 'slug', 'name'],
    },
    PROJECT: {
      VALUE: 7,
      MODEL_NAME: 'project',
    },
    SCHEMA: {
      VALUE: 8,
      MODEL_NAME: 'schema',
    },
    GENERATOR: {
      VALUE: 9,
      MODEL_NAME: 'generator',
    },
    SCHEMA_DETAIL: {
      VALUE: 10,
      MODEL_NAME: 'schema-detail',
    },
    APPLICATION: {
      VALUE: 11,
      MODEL_NAME: 'application',
    },
    PROJECT_DEFINITION: {
      VALUE: 13,
      MODEL_NAME: 'project-definition',
    },
    RAW_MODEL: {
      VALUE: 15,
      MODEL_NAME: 'raw-model',
    },
    PROJECT_ROUTE: {
      VALUE: 17,
      MODEL_NAME: 'projectRoute',
    },
    PROJECT_CONSTANT: {
      VALUE: 18,
      MODEL_NAME: 'projectConstant',
    },
    PROJECT_POLICY: {
      VALUE: 20,
      MODEL_NAME: 'projectPolicy',
    },
    APPLICATION_CONFIG: {
      VALUE: 24,
      MODEL_NAME: 'applicationConfig',
    },
    ENV_VARIABLES: {
      VALUE: 31,
      MODEL_NAME: 'env-variables',
    },
    QUERY_BUILDER: {
      VALUE: 39,
      MODEL_NAME: 'query-builders',
    },
    PROJECT_ROLE_ACCESS_PERMISSIONS: {
      VALUE: 46,
      MODEL_NAME: 'project-role-access-permissions',
    },
    NESTED_QUERY_BUILDER: {
      VALUE: 51,
      MODEL_NAME: 'nested-query-builder',
    },
    SETTING: {
      VALUE: 60,
      MODEL_NAME: 'settings',
    },
  },
  SUB_MODULE: {
    SCHEMA_UPLOAD_VERSION: {
      VALUE: 112,
      MODEL_NAME: 'schema-upload-versions',
    },
  },
  SOURCE_MEDIUM: {
    WEB: 1,
    ANDROID: 2,
    IOS: 3,
    DESKTOP: 4,
  },
  ACTION: {
    ADD: 1,
    UPDATE: 2,
    DELETE: 3,
  },
  ERROR_LOGS_TYPE: {
    FRONT: 1,
    BACK: 2,
  },

  TWO_FA_AUTHENTICATION_TYPE: { OTP: 1 },

  RESPONSE_CODE: {
    OK: 'OK',
    NOT_FOUND: 'E_NOT_FOUND',
    BAD_REQUEST: 'E_BAD_REQUEST',
    ERROR: 'E_ERROR',
    FORBIDDEN: 'E_FORBIDDEN',
    SERVER_ERROR: 'E_INTERNAL_SERVER_ERROR',
    UNAUTHORIZED: 'E_UNAUTHORIZED',
  },
};
