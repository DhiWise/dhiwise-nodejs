/* global MESSAGE, _ */
const mongoose = require('mongoose');
const faker = require('faker');
const {
  DEFAULT_POLICY_NAME, DEFAULT_POLICY, DEFAULT_CONSTANT_NAME, DEFAULT_CONSTANT, DEFAULT_POLICY_DESCRIPTION,
  DEFAULT_CONSTANT_DESCRIPTION, ORM_TYPE,
} = require('../../models/constants/application');

const { PROJECT_DEFINITION_CODE } = require('../../models/constants/projectDefinition');
const { VALIDATION_RULES } = require('../../constants/validation');

const { DEFAULT_TABLE_NAME } = require('../../constants/schema');

const {
  getDefaultFieldsForMongoDB, getDefaultFieldsForSequelize,
} = require('../schema/util/staticData');

const {
  APPLICATION_FAILED_CREATE, INVALID_REQUEST_PARAMS, OK, SERVER_ERROR, APPLICATION_CREATED,

} = require('../../constants/message').message;

const projectPaginateUseCase = require('../project/paginate');

const projectCreateUseCase = require('../project/create');
const projectApplicationUpdate = require('../common/projectApplicationUpdate');
const schemaAddUseCase = require('../schema/create');
const projectConstantAddUseCase = require('../projectConstant/create');
const projectPolicyAddUseCase = require('../projectPolicy/create');
const applicationConfigCreateUseCase = require('../applicationConfig/create');
const ProjectRoleAccessPermissionRepository = require('../../repo/projectRoleAccessPermissions');

const ProjectPolicyRepo = require('../../repo/projectPolicy');
const ProjectConstantRepo = require('../../repo/projectConstant');
const ApplicationConfigRepository = require('../../repo/applicationConfig');

const projectRoleAccessPermissionRepo = new ProjectRoleAccessPermissionRepository();

const projectPolicyRepo = new ProjectPolicyRepo();
const projectConstantRepo = new ProjectConstantRepo();
const applicationConfigRepo = new ApplicationConfigRepository();

const { APPLICATION_FIELDS } = require('../util/fieldsList');
const {
  applicationCreationValidation, nodeExpressValidation,
} = require('../util/validation/applicationCreate');

const projectRoleAccessPermission = require('../projectRoleAccessPermissions/upsert');

/**
 * Function used to default project assign or create
 * @param {*} param0
 * @returns
 */
const defaultProjectAssignOrCreate = ({ projectRepo }) => async ({ params }) => {
  let defaultProject = await projectRepo.get({
    filter: { find: { isActive: false } },
    sortBy: { createdAt: 'DESC' },
  });

  if (!defaultProject) {
    const data = { name: 'Default' };

    const projectResponse = await projectCreateUseCase(projectRepo)(data);

    if (projectResponse?.code === 'OK') {
      defaultProject = projectResponse?.data;
    }
  }

  params.projectId = defaultProject?._id?.toString();

  return params;
};

const validateTypeRequest = (params) => {
  let newErr;
  if (params?.projectDefinitionCode === PROJECT_DEFINITION_CODE.NODE_EXPRESS) {
    const {
      value, error,
    } = nodeExpressValidation(params);
    newErr = error;
    params = {
      ...params,
      value,
    };
  }
  return {
    typeValue: params,
    typeError: newErr,
  };
};

/**
 * Function used for create new user.
 * @return json
 */
const useCase = (applicationRepo, schemaRepo, projectRepo) => async (params) => {
  try {
    if (params.isOver) { params.isPublicConsent = params.isOver; }

    const actualName = params.name;
    if (params.name) {
      let nameTemp = params.name;
      nameTemp = nameTemp.replace(/-/g, '');
      nameTemp = nameTemp.replace(/_/g, '');
      params.name = nameTemp;
      if (!(VALIDATION_RULES.APPLICATION.NAME.REGEX.test(nameTemp))) {
        return {
          data: null,
          code: MESSAGE.BAD_REQUEST.code,
          message: 'Start your application name with an alphanumeric with a minimum of 3 alphabets, and (_) are allowed after alphanumeric',
        };
      }
      const appValidation = applicationCreationValidation(params);
      if (appValidation?.error) {
        return {
          data: null,
          code: MESSAGE.BAD_REQUEST.code,
          message: appValidation?.error,
        };
      }
      params = _.cloneDeep(appValidation.value);
    } else {
      const {
        value, error,
      } = applicationCreationValidation(params);
      if (error) {
        return {
          data: null,
          code: MESSAGE.BAD_REQUEST.code,
          message: error,
        };
      }
      params = _.cloneDeep(value);
    }
    params.name = actualName;
    if (params.applicationId) {
      const isValidId = mongoose.Types.ObjectId.isValid(params.applicationId);
      if (!isValidId) {
        return INVALID_REQUEST_PARAMS;
      }
    }
    const {
      typeValue, typeError,
    } = validateTypeRequest(params);
    if (typeError) {
      return {
        data: null,
        code: MESSAGE.BAD_REQUEST.code,
        message: typeError,
      };
    }
    params = typeValue;

    // Default Project assign
    if (!params?.projectId) {
      params = await defaultProjectAssignOrCreate({ projectRepo })({ params });
    }

    const project = await projectRepo.get({
      filter: { find: { _id: params.projectId } },
      fields: ['isArchive', 'isDeleted'],
    });
    if (project?.isDeleted === true) {
      return MESSAGE.APPLICATION_IS_DELETED;
    }

    if (params?.projectDefinitionCode && _.includes([
      PROJECT_DEFINITION_CODE.NODE_EXPRESS], params.projectDefinitionCode)) {
      if (!params?.configInput) {
        params.configInput = {};
      }
      if (!params?.configInput.platform) {
        params.configInput.platform = ['admin', 'device'];
      }
      if (!params?.configInput.types) {
        params.configInput.types = ['User', 'Admin'];
      }
      if (!params?.configInput.loginAccess) {
        params.configInput.loginAccess = {
          User: [
            'device',
          ],
          Admin: [
            'admin',
          ],
        };
      }
    }

    let created = await applicationRepo.create(params);
    if (!created) {
      return APPLICATION_FAILED_CREATE;
    }

    // UpdatedAt update
    projectApplicationUpdate({ params });

    if (params?.projectDefinitionCode && _.includes([PROJECT_DEFINITION_CODE.NODE_EXPRESS], params.projectDefinitionCode)) {
      // create default user schema
      const defaultSchema = DEFAULT_TABLE_NAME;

      let schemaAddParam = {};
      let staticFields = {};
      if (created?.stepInput?.ormType && _.includes([ORM_TYPE.SEQUELIZE], created.stepInput.ormType)) {
        schemaAddParam = {
          applicationId: created.id,
          name: defaultSchema,
          schemaJson: {
            username: { type: 'STRING' },
            password: { type: 'STRING' },
            email: { type: 'STRING' },
            name: { type: 'STRING' },
          },
        };
        if (created?.stepInput?.ormType === ORM_TYPE.ELOQUENT) {
          schemaAddParam.schemaJson.email.unique = true;
        }

        // Get default fields.
        staticFields = await getDefaultFieldsForSequelize({ ormType: created.stepInput.ormType });
      } else {
        schemaAddParam = {
          applicationId: created.id,
          name: defaultSchema,
          schemaJson: {
            username: { type: 'String' },
            password: { type: 'String' },
            email: { type: 'String' },
            name: { type: 'String' },
          },
        };
        // Get default fields.
        staticFields = await getDefaultFieldsForMongoDB();
      }

      // Add default fields.
      Object.keys(staticFields).forEach((field) => {
        if (!schemaAddParam.schemaJson[field]) {
          schemaAddParam.schemaJson[field] = staticFields[field];
        }
      });

      const defaultSchemaData = await (schemaAddUseCase(schemaRepo, applicationRepo))(schemaAddParam);
      // add default auth model in applicationConfig.
      if (defaultSchemaData?.code && defaultSchemaData.code === OK.code) {
        const defaultSchemaDetails = defaultSchemaData.data;
        const appConfigParams = {
          applicationId: created.id,
          authModuleId: defaultSchemaDetails._id,
          authModule: defaultSchemaDetails.name,
        };

        const credentials = [];
        if (created?.configInput?.types) {
          const userTypes = _.cloneDeep(created.configInput.types);
          _.map(userTypes, (type) => {
            credentials.push({
              type,
              email: faker.internet.email(),
              password: faker.internet.password(),
            });
          });
        }
        appConfigParams.authentication = { credentials };

        await (applicationConfigCreateUseCase(applicationConfigRepo, applicationRepo))(appConfigParams);

        // Create default Project-role-access-permissions
        const rolePermissionName = ['Admin', 'User'];
        for (let i = 0; i < rolePermissionName.length; i += 1) {
          const roleName = rolePermissionName[i];
          const roleInput = {
            name: roleName,
            applicationId: created._id.toString(),
            customJson: [
              {
                modelId: defaultSchemaDetails._id,
                actions: {
                  C: true,
                  R: true,
                  U: true,
                  D: true,
                },
              },
            ],
          };
          // eslint-disable-next-line no-await-in-loop
          await projectRoleAccessPermission(projectRoleAccessPermissionRepo)(roleInput);
        }
      }

      // add default policy
      if (!created.stepInput.ormType || (created?.stepInput?.ormType && created.stepInput.ormType !== ORM_TYPE.ELOQUENT)) {
        const policyAddParam = {
          applicationId: created.id,
          fileName: DEFAULT_POLICY_NAME,
          description: DEFAULT_POLICY_DESCRIPTION,
          customJson: DEFAULT_POLICY,
        };

        await (projectPolicyAddUseCase(projectPolicyRepo, applicationRepo))(policyAddParam);
      }

      // add default constant
      const constantAddParam = {
        applicationId: created.id,
        fileName: DEFAULT_CONSTANT_NAME,
        groupName: DEFAULT_CONSTANT_NAME,
        description: DEFAULT_CONSTANT_DESCRIPTION,
        customJson: DEFAULT_CONSTANT,
      };
      await (projectConstantAddUseCase(projectConstantRepo, applicationRepo))(constantAddParam);
    }

    created = _.pick(created, APPLICATION_FIELDS);

    // Get Project application list
    const projectListResponse = await projectPaginateUseCase(projectRepo, applicationRepo)({ find: { _id: created?.projectId } });
    created.projectList = projectListResponse?.data?.list;

    return {
      ...APPLICATION_CREATED,
      data: created,
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    // console.log('error', err);
    return SERVER_ERROR;
  }
};

module.exports = useCase;
