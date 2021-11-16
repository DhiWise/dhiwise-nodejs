/* global  _ */

const rolePermissionAccessUpsert = require('../../../projectRoleAccessPermissions/upsert');

const { OK } = require('../../../../constants/message').message;

const SchemaRepository = require('../../../../repo/schema');
const ProjectRoleAccessPermissionsRepository = require('../../../../repo/projectRoleAccessPermissions');

const schemaRepo = new SchemaRepository();
const ProjectRoleAccessPermissionsRepo = new ProjectRoleAccessPermissionsRepository();

const projectRoleAccessPermission = async ({ params }) => {
  if (!params?.data?.rolePermission) {
    return OK;
  }

  const applicationId = _.cloneDeep(params.data.applicationId);
  const rolePermissions = _.cloneDeep(params.data.rolePermission);

  const modelNames = _.keys(rolePermissions);
  const schemaData = await schemaRepo.getDetails({
    find: {
      applicationId,
      name: modelNames,
    },
  });

  let types = [];
  _.each(rolePermissions, (data) => {
    _.each(data, (val) => {
      types.push(val);
    });
  });

  const rolePermissionsData = [];
  types = _.compact(_.uniq(_.flattenDeep(types)));
  if (types && types.length > 0) {
    _.map(types, (type) => {
      const permission = {
        name: type,
        applicationId,
      };

      const customJson = [];
      _.each(rolePermissions, (permissionData, modelName) => {
        const modelData = _.find(schemaData, { name: modelName });
        const actions = {};
        if (modelData) {
          _.each(permissionData, (val, key) => {
            if (_.includes(val, type)) {
              actions[key] = true;
            } else {
              actions[key] = false;
            }
          });
          customJson.push({
            modelId: modelData._id.toString(),
            actions,
          });
        }
      });
      permission.customJson = customJson;

      rolePermissionsData.push(permission);
    });
  }

  const errorsData = [];
  for (let i = 0; i < rolePermissionsData.length; i += 1) {
    const roleData = rolePermissionsData[i];
    // eslint-disable-next-line no-await-in-loop
    const rolePermissionRes = await rolePermissionAccessUpsert(ProjectRoleAccessPermissionsRepo)(roleData);
    if (rolePermissionRes.code !== OK.code) {
      errorsData.push({
        message: rolePermissionRes.message,
        data: roleData,
      });
    }
  }

  return {
    ...OK,
    data: { errors: errorsData },
  };
};

module.exports = projectRoleAccessPermission;
