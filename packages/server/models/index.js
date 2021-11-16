/* eslint-disable global-require */
module.exports = {

  // Special model
  Queue: require('./Models/Queue'),

  // separate tenant models
  Project: require('./Models/tenant/Project'),
  Application: require('./Models/tenant/Application'),
  RawModel: require('./Models/tenant/RawModel'),
  Schema: require('./Models/tenant/Schema'),
  SchemaDetail: require('./Models/tenant/SchemaDetail'),
  Generator: require('./Models/tenant/Generator'),
  ProjectRoute: require('./Models/tenant/ProjectRoute'),
  ProjectConstant: require('./Models/tenant/ProjectConstant'),
  ProjectPolicy: require('./Models/tenant/ProjectPolicy'),
  ApplicationConfig: require('./Models/tenant/ApplicationConfig'),
  QueryBuilder: require('./Models/tenant/QueryBuilder'),
  ProjectRoleAccessPermissions: require('./Models/tenant/ProjectRoleAccessPermissions'),
  NestedQueryBuilder: require('./Models/tenant/NestedQueryBuilder'),
  SchemaUploadVersion: require('./Models/tenant/SchemaUploadVersion'),

  // general model
  EnvVariables: require('./Models/tenant/EnvVariables'),
  MasterSubMaster: require('./Models/tenant/Master'),

};
