module.exports = {
  message: {
    ALREADY_EXISTS: {
      code: 'E_DUPLICATE',
      message: 'data already exists.',
      status: 200,
    },
    BAD_REQUEST: {
      code: 'E_BAD_REQUEST',
      message: 'The request cannot be fulfilled due to bad syntax',
      status: 400,
      data: null,
    },
    OK: {
      code: 'OK',
      message: 'Operation is successfully executed',
      status: 200,
    },
    // common-message-for-project
    RECORD_NOT_FOUND: {
      code: 'E_NOT_FOUND',
      message: 'Record not found.',
      status: 200,
      data: null,
    },
    SCHEMA_NOT_FOUND: {
      code: 'OK',
      message: 'Schema not found.',
      status: 200,
      data: null,
    },
    APPLICATION_NOT_FOUND: {
      code: 'E_NOT_FOUND',
      message: 'Application not found',
      status: 200,
      data: null,
    },
    APPLICATION_DELETED: {
      code: 'OK',
      message: 'Application deleted successfully.',
      status: 200,
    },
    APPLICATION_CONFIG_NOT_FOUND: {
      code: 'E_NOT_FOUND',
      message: 'Application config not found',
      status: 200,
      data: null,
    },
    SERVER_ERROR: {
      code: 'E_INTERNAL_SERVER_ERROR',
      message: 'Something bad happened on the server',
      status: 500,
    },
    // common-message-for-create-failed
    FAILED_TO_CREATE: {
      message: 'Failed to create.',
      code: 'E_CREATE_FAILED',
      status: 500,
    },
    FAILED_TO_UPDATE: {
      message: 'failed to update.',
      code: 'E_UPDATE_FAILED',
      status: 500,
    },
    APPLICATION_FAILED_CREATE: {
      message: 'Failed to create application.',
      code: 'E_CREATE_FAILED',
      status: 500,
    },
    GENERATOR_FAILED_CREATE: {
      message: 'Failed to generator application.',
      code: 'E_CREATE_FAILED',
      status: 500,
    },
    PROJECT_FAILED_CREATE: {
      message: 'Failed to create project.',
      code: 'E_CREATE_FAILED',
      status: 500,
    },
    PROJECT_GENERATED_SUCCESSFULLY: {
      code: 'OK',
      message: 'project generated successfully.',
      status: 200,
    },
    INVALID_REQUEST_PARAMS: {
      code: 'E_BAD_REQUEST',
      message: 'Invalid Request Parameters.',
      status: 400,
      data: null,
    },
    SCHEMA_IS_EMPTY: {
      code: 'E_BAD_REQUEST',
      message: 'Schema not present for this application',
      status: 400,
      data: null,
    },
    RECORD_WITH_SAME_NAME_EXISTS: {
      code: 'E_BAD_REQUEST',
      message: 'Record with same name already exists',
      status: 400,
      data: null,
    },
    PROJECT_POLICY_NOT_FOUND: {
      code: 'E_NOT_FOUND',
      message: 'Middleware not found.',
      status: 200,
    },
    ALREADY_USED_POLICY: {
      code: 'E_BAD_REQUEST',
      message: 'Middleware already in use.',
      status: 200,
    },
    FILE_UPLOAD_FAILED: {
      message: 'Upoad failed.',
      code: 'E_CREATE_FAILED',
      status: 500,
    },
    ENV_VARIABLE_NOT_FOUND: {
      code: 'E_NOT_FOUND',
      message: 'ENV variables details not found',
      status: 200,
      data: null,
    },
    PROJECT_ROUTE_NOT_FOUND: {
      code: 'E_NOT_FOUND',
      message: 'Project route not found.',
      status: 200,
    },
    INVALID_JSON: {
      code: 'E_BAD_REQUEST',
      message: 'Invalid JSON file.',
      status: 200,
    },
    EMPTY_JSON_FILE: {
      code: 'E_BAD_REQUEST',
      message: 'Empty JSON file.',
      status: 200,
    },
    MIDDLEWARE_CREATED: {
      code: 'OK',
      message: 'Middleware created successfully.',
      status: 200,
    },
    MIDDLEWARE_UPDATED: {
      code: 'OK',
      message: 'Middleware updated successfully.',
      status: 200,
    },
    PROJECT_UPDATED: {
      code: 'OK',
      message: 'Project updated successfully.',
      status: 200,
    },
    MIDDLEWARE_DELETED: {
      code: 'OK',
      message: 'Middleware deleted successfully.',
      status: 200,
    },
    ROUTE_CREATED: {
      code: 'OK',
      message: 'Route created successfully.',
      status: 200,
    },
    ROUTE_UPDATED: {
      code: 'OK',
      message: 'Route updated successfully.',
      status: 200,
    },
    ROUTE_DELETED: {
      code: 'OK',
      message: 'Route deleted successfully.',
      status: 200,
    },
    POSTMAN_UPLOADED: {
      code: 'OK',
      message: 'Routes uploaded successfully.',
      status: 200,
    },
    ENV_DETAILS_UPDATED: {
      code: 'OK',
      message: 'Environment variable details updated successfully.',
      status: 200,
    },
    APPLICATION_CONFIG_CREATED: {
      code: 'OK',
      message: 'Application config created successfully.',
      status: 200,
    },
    APPLICATION_CONFIG_UPDATED: {
      code: 'OK',
      message: 'Application config updated successfully.',
      status: 200,
    },
    APPLICATION_CREATED: {
      code: 'OK',
      message: 'Application created successfully.',
      status: 200,
    },
    MODEL_CREATED: {
      code: 'OK',
      message: 'Model created successfully.',
      status: 200,
    },
    MODEL_UPDATED: {
      code: 'OK',
      message: 'Model updated successfully.',
      status: 200,
    },
    MODELS_UPDATED: {
      code: 'OK',
      message: 'Model(s) updated successfully.',
      status: 200,
    },
    MODEL_DELETED: {
      code: 'OK',
      message: 'Model deleted successfully.',
      status: 200,
    },
    MODEL_UPLOADED: {
      code: 'OK',
      message: 'Model uploaded successfully.',
      status: 200,
    },
    MODEL_PERMISSION_UPDATED: {
      code: 'OK',
      message: 'Model permission updated successfully.',
      status: 200,
    },
    CONSTANT_CREATED: {
      code: 'OK',
      message: 'Constant created successfully.',
      status: 200,
    },
    CONSTANT_UPDATED: {
      code: 'OK',
      message: 'Constant updated successfully.',
      status: 200,
    },
    CONSTANT_DELETED: {
      code: 'OK',
      message: 'Constant deleted successfully.',
      status: 200,
    },
    PROJECT_GENERATED: {
      code: 'OK',
      message: 'Your applications is build successfully. Review or download source code to proceed further.',
      status: 200,
    },
    ROLE_PERMISSIONS_CREATED: {
      code: 'OK',
      message: 'Role access permission created successfully.',
      status: 200,
    },
    ROLE_PERMISSIONS_UPDATED: {
      code: 'OK',
      message: 'Role access permission updated successfully.',
      status: 200,
    },
    ROLE_PERMISSIONS_DELETED: {
      code: 'OK',
      message: 'Role access permission deleted successfully.',
      status: 200,
    },
    ROLE_PERMISSIONS_RETRIEVED: {
      code: 'OK',
      message: 'Role access permissions retrieved successfully.',
      status: 200,
    },
    APPLICATION_UPDATED: {
      code: 'OK',
      message: 'Application updated successfully.',
      status: 200,
    },
    INVALID_REGEXP: {
      code: 'E_BAD_REQUEST',
      message: 'Invalid regular expression.',
      status: 400,
      data: null,
    },
    INVALID_SCHEMA_ATTR: {
      code: 'E_BAD_REQUEST',
      message: 'Invalid schema attribute.',
      status: 200,
    },
    FILE_UPLOADED: {
      code: 'OK',
      message: 'File uploaded successfully.',
      status: 200,
    },
    INVALID_FILE: {
      code: 'E_BAD_REQUEST',
      status: 400,
      message: 'You have uploaded an invalid file.',
    },
    SQL_PARSER_ERROR: {
      code: 'E_INTERNAL_SERVER_ERROR',
      status: 500,
      message: 'Some error(s) occur, while updating tables.',
    },
    SCHEMA_DETAIL_NOT_FOUND: {
      code: 'E_BAD_REQUEST',
      message: 'Schema details not found.',
      status: 400,
      data: null,
    },
    APP_CONFIG_MODEL: {
      code: 'E_APP_CONFIG_MODEL',
      message: 'Model used in application config, you will not able to delete model.',
      status: 400,
      data: null,
    },
    APP_CONFIG_TABLE: {
      code: 'E_APP_CONFIG_TABLE',
      message: 'Table used in application config, you will not able to delete table.',
      status: 400,
      data: null,
    },
    SCHEMA_DELETE_DEPENDENCY: {
      code: 'OK',
      message: 'Dependency retrieved successfully.',
      status: 200,
      data: null,
    },
    DEFAULT_MODELS_INSERTED: {
      code: 'OK',
      message: 'Default models inserted successfully.',
      status: 200,
    },
    DATA_TYPES_SUGGESTIONS: {
      code: 'OK',
      status: 200,
      message: 'Data types retrieved successfully.',
    },
    NODE_APP_NOT_FOUND: {
      code: 'E_BAD_REQUEST',
      message: 'You not selected Node application.',
      status: 400,
      data: null,
    },
    APPLICATION_DETAILS_NOT_FOUND: {
      code: 'E_NOT_FOUND',
      message: 'Application not found',
      status: 400,
      data: null,
    },
    EMPTY_FILE: {
      code: 'OK',
      message: 'File is empty.',
      status: 200,
    },
    DHIWISE_FILE_NOT_EXISTS: {
      code: 'E_BAD_REQUEST',
      message: 'Dhiwise.json file not exists.',
      status: 400,
    },
    DEFINITION_NOT_FOUND: {
      code: 'E_BAD_REQUEST',
      message: 'Project definition not found.',
      status: 400,
    },
    SCHEMA_SEARCH_FAILED: {
      code: 'E_SCHEMA_SEARCH_FAILED',
      message: 'Failed to search.',
      status: 400,
      data: null,
    },
    SAME_ROUTES_EXISTS: {
      code: 'E_BAD_REQUEST',
      message: 'Record with same route or action already exists.',
      status: 400,
      data: null,
    },
  },

};
