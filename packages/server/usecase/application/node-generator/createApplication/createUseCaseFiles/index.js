const {
  forEach, isEmpty, uniq,
} = require('lodash');
const writeOperations = require('../../writeOperations/index');

async function getDeleteDependentModel (model, deleteDependency) {
  let deleteModels = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const k in deleteDependency) {
    if (k === model) {
      deleteModels = deleteDependency[k];
      break;
    } else {
      deleteModels = [];
    }
  }
  return deleteModels;
}

const createUseCaseFiles = (rootTemplateDirPath, {
  modelConfig, deleteDependency, auth, defaultRole,
}) => {
  // Create  use case model wise
  const useCaseList = {};
  forEach(modelConfig, (modelDetails) => {
    forEach(modelDetails, (modelOperations, modelName) => {
      if (!useCaseList[modelName]) {
        useCaseList[modelName] = {};
      }
      forEach(modelOperations, (operationDetails, operation) => {
        useCaseList[modelName][operation] = operationDetails;
      });
    });
  });
  // create all use case model wise.
  const allUseCases = {};
  forEach(useCaseList, async (operations, model) => {
    allUseCases[model] = {};
    const modelFc = model.charAt(0).toUpperCase() + model.slice(1);
    const deleteDependent = await getDeleteDependentModel(model, deleteDependency);
    forEach(operations, (operationDetails, operationName) => {
      // For Create API
      if (operationName === 'create') {
        const createUseCase = writeOperations.loadTemplate(`${rootTemplateDirPath}/create.js`);
        createUseCase.locals.MODEL_NAME_FC = modelFc;
        createUseCase.locals.MODEL_NAME = model;
        if (auth.isAuth && auth.userModel === model) {
          if (!isEmpty(defaultRole)) {
            createUseCase.locals.DEFAULT_USER_ROLE = true;
          }
        }
        createUseCase.locals.FILE_NAME = operationName;
        allUseCases[model][operationName] = createUseCase;
      }

      if (operationName === 'findAll') {
        const findAllUseCase = writeOperations.loadTemplate(`${rootTemplateDirPath}/findAll.js`);
        findAllUseCase.locals.MODEL_NAME_FC = modelFc;
        findAllUseCase.locals.MODEL_NAME = model;
        findAllUseCase.locals.FILE_NAME = operationName;
        allUseCases[model][operationName] = findAllUseCase;
      }

      if (operationName === 'count') {
        const countUseCase = writeOperations.loadTemplate(`${rootTemplateDirPath}/count.js`);
        countUseCase.locals.MODEL_NAME_FC = modelFc;
        countUseCase.locals.MODEL_NAME = model;
        countUseCase.locals.FILE_NAME = operationName;
        allUseCases[model][operationName] = countUseCase;
      }

      if (operationName === 'update') {
        const updateUseCase = writeOperations.loadTemplate(`${rootTemplateDirPath}/update.js`);
        updateUseCase.locals.MODEL_NAME_FC = modelFc;
        updateUseCase.locals.MODEL_NAME = model;
        updateUseCase.locals.FILE_NAME = operationName;
        allUseCases[model][operationName] = updateUseCase;
      }

      if (operationName === 'delete') {
        const deleteUseCase = writeOperations.loadTemplate(`${rootTemplateDirPath}/delete.js`);
        let dbDependencyInjection = [model];
        if (deleteDependent.length) {
          if (!isEmpty(deleteDependent)) {
            forEach(deleteDependent, (value) => {
              dbDependencyInjection.push(value.model);
            });
          }
          dbDependencyInjection = uniq(dbDependencyInjection);
        }
        deleteUseCase.locals.MODEL_NAME_FC = modelFc;
        deleteUseCase.locals.MODEL_NAME = model;
        deleteUseCase.locals.DELETE_DEPENDENT_MODEL = !!deleteDependent.length;
        deleteUseCase.locals.DB_DEPENDENCY_INJECTION = dbDependencyInjection;
        deleteUseCase.locals.FILE_NAME = `${operationName}One`;
        allUseCases[model][operationName] = deleteUseCase;
      }

      if (operationName === 'deleteMany') {
        const deleteManyUseCase = writeOperations.loadTemplate(`${rootTemplateDirPath}/deleteMany.js`);
        let dbDependencyInjection = [model];
        if (deleteDependent.length) {
          if (!isEmpty(deleteDependent)) {
            forEach(deleteDependent, (value) => {
              dbDependencyInjection.push(value.model);
            });
          }
          dbDependencyInjection = uniq(dbDependencyInjection);
        }
        deleteManyUseCase.locals.MODEL_NAME_FC = modelFc;
        deleteManyUseCase.locals.MODEL_NAME = model;
        deleteManyUseCase.locals.DELETE_DEPENDENT_MODEL = !!deleteDependent.length;
        deleteManyUseCase.locals.DB_DEPENDENCY_INJECTION = dbDependencyInjection;
        deleteManyUseCase.locals.FILE_NAME = operationName;
        allUseCases[model][operationName] = deleteManyUseCase;
      }

      if (operationName === 'softDelete') {
        const softDeleteUseCase = writeOperations.loadTemplate(`${rootTemplateDirPath}/softDelete.js`);
        let dbDependencyInjection = [model];
        if (deleteDependent.length) {
          if (!isEmpty(deleteDependent)) {
            forEach(deleteDependent, (value) => {
              dbDependencyInjection.push(value.model);
            });
          }
          dbDependencyInjection = uniq(dbDependencyInjection);
        }
        softDeleteUseCase.locals.MODEL_NAME_FC = modelFc;
        softDeleteUseCase.locals.MODEL_NAME = model;
        softDeleteUseCase.locals.DELETE_DEPENDENT_MODEL = !!deleteDependent.length;
        softDeleteUseCase.locals.DB_DEPENDENCY_INJECTION = dbDependencyInjection;
        softDeleteUseCase.locals.FILE_NAME = operationName;
        allUseCases[model][operationName] = softDeleteUseCase;
      }

      if (operationName === 'softDeleteMany') {
        const softDeleteManyUseCase = writeOperations.loadTemplate(`${rootTemplateDirPath}/softDeleteMany.js`);
        let dbDependencyInjection = [model];
        if (deleteDependent.length) {
          if (!isEmpty(deleteDependent)) {
            forEach(deleteDependent, (value) => {
              dbDependencyInjection.push(value.model);
            });
          }
          dbDependencyInjection = uniq(dbDependencyInjection);
        }
        softDeleteManyUseCase.locals.MODEL_NAME_FC = modelFc;
        softDeleteManyUseCase.locals.MODEL_NAME = model;
        softDeleteManyUseCase.locals.DELETE_DEPENDENT_MODEL = !!deleteDependent.length;
        softDeleteManyUseCase.locals.DB_DEPENDENCY_INJECTION = dbDependencyInjection;
        softDeleteManyUseCase.locals.FILE_NAME = operationName;
        allUseCases[model][operationName] = softDeleteManyUseCase;
      }

      if (operationName === 'createBulk') {
        const createBulkUseCase = writeOperations.loadTemplate(`${rootTemplateDirPath}/createBulk.js`);
        createBulkUseCase.locals.MODEL_NAME_FC = modelFc;
        createBulkUseCase.locals.MODEL_NAME = model;
        if (auth.isAuth && auth.userModel === model) {
          if (!isEmpty(defaultRole)) {
            createBulkUseCase.locals.DEFAULT_USER_ROLE = true;
          }
        }
        createBulkUseCase.locals.FILE_NAME = operationName;
        allUseCases[model][operationName] = createBulkUseCase;
      }

      if (operationName === 'bulkUpdate') {
        const bulkUpdateUseCase = writeOperations.loadTemplate(`${rootTemplateDirPath}/bulkUpdate.js`);
        bulkUpdateUseCase.locals.MODEL_NAME_FC = modelFc;
        bulkUpdateUseCase.locals.MODEL_NAME = model;
        bulkUpdateUseCase.locals.FILE_NAME = 'updateBulk';
        allUseCases[model][operationName] = bulkUpdateUseCase;
      }

      if (operationName === 'partialUpdate') {
        const partialUpdateUseCase = writeOperations.loadTemplate(`${rootTemplateDirPath}/partialUpdate.js`);
        partialUpdateUseCase.locals.MODEL_NAME_FC = modelFc;
        partialUpdateUseCase.locals.MODEL_NAME = model;
        partialUpdateUseCase.locals.FILE_NAME = operationName;
        allUseCases[model][operationName] = partialUpdateUseCase;
      }

      if (operationName === 'findById') {
        const findByIdUseCase = writeOperations.loadTemplate(`${rootTemplateDirPath}/findById.js`);
        findByIdUseCase.locals.MODEL_NAME_FC = modelFc;
        findByIdUseCase.locals.MODEL_NAME = model;
        findByIdUseCase.locals.FILE_NAME = operationName;
        allUseCases[model][operationName] = findByIdUseCase;
      }

      if (operationName === 'aggregate') {
        const aggregateUseCase = writeOperations.loadTemplate(`${rootTemplateDirPath}/aggregate.js`);
        aggregateUseCase.locals.MODEL_NAME_FC = modelFc;
        aggregateUseCase.locals.MODEL_NAME = model;
        aggregateUseCase.locals.FILE_NAME = operationName;
        allUseCases[model][operationName] = aggregateUseCase;
      }

      if (auth.isAuth && auth.userModel === model) {
        const changePassword = writeOperations.loadTemplate(`${rootTemplateDirPath}/changePassword.js`);
        changePassword.locals.MODEL_NAME_FC = modelFc;
        changePassword.locals.MODEL_NAME = model;
        changePassword.locals.FILE_NAME = 'changePassword';
        changePassword.locals.PASSWORD_FIELD = auth.userLoginWith.password || 'password';
        allUseCases[model].changePassword = changePassword;

        const updateProfile = writeOperations.loadTemplate(`${rootTemplateDirPath}/updateProfile.js`);
        updateProfile.locals.MODEL_NAME_FC = modelFc;
        updateProfile.locals.MODEL_NAME = model;
        updateProfile.locals.FILE_NAME = 'updateProfile';
        allUseCases[model].updateProfile = updateProfile;
      }
    });
  });
  return allUseCases;
};

const createCommonUseCaseFiles = async (rootTemplateDirPath, authService) => {
  // Create common usecase
  const allCommonUseCases = {};

  // Auth service usecase
  const loginUser = writeOperations.loadTemplate(`${rootTemplateDirPath}/common/loginUser.js`);
  forEach(authService.locals, (value, key) => {
    loginUser.locals[key] = value;
  });
  loginUser.locals.USER_MODEL = authService.locals.MODEL;
  loginUser.locals.FILE_NAME = 'loginUser';
  loginUser.locals.PLATFORMS = authService.locals.PLATFORMS;
  allCommonUseCases.loginUser = loginUser;

  // Get RoleAccess Usecase
  const getRoleAccess = writeOperations.loadTemplate(`${rootTemplateDirPath}/common/getRoleAccess.js`);
  getRoleAccess.locals.FILE_NAME = 'getRoleAccess';
  allCommonUseCases.getRoleAccess = getRoleAccess;

  // sendResetPasswordNotification
  const sendResetPasswordNotification = writeOperations.loadTemplate(`${rootTemplateDirPath}/common/sendResetPasswordNotification.js`);
  sendResetPasswordNotification.locals.FILE_NAME = 'sendResetPasswordNotification';
  sendResetPasswordNotification.locals.USER_MODEL = authService.locals.MODEL;
  sendResetPasswordNotification.locals.EMAIL_FIELD = authService.locals.EMAIL_FIELD;
  sendResetPasswordNotification.locals.MOBILE_FIELD = authService.locals.MOBILE_FIELD;
  sendResetPasswordNotification.locals.FORGOT_WITH_LINK = authService.locals.FORGOT_WITH_LINK;
  sendResetPasswordNotification.locals.FORGOT_WITH_OTP = authService.locals.FORGOT_WITH_OTP;
  sendResetPasswordNotification.locals.RESET_PASSWORD_TEMPLATE_NAME = authService.locals.RESET_PASSWORD_TEMPLATE_NAME;
  sendResetPasswordNotification.locals.RESET_PASSWORD_NOTIFICATION_TYPE = authService.locals.RESET_PASSWORD_NOTIFICATION_TYPE;
  sendResetPasswordNotification.locals.RESET_PASSWORD_TEMPLATE_ATTRIBUTE = authService.locals.RESET_PASSWORD_TEMPLATE_ATTRIBUTE;
  allCommonUseCases.sendResetPasswordNotification = sendResetPasswordNotification;

  return allCommonUseCases;
};

module.exports = {
  createUseCaseFiles,
  createCommonUseCaseFiles,
};
