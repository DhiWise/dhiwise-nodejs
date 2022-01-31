const {
  forEach, isEmpty, uniq,
} = require('lodash');
const writeOperations = require('../writeOperations');
const { PROJECT_TYPE } = require('../constants/constant');

const generateDeleteDependencyService = async (projectType, templateFolderName, deleteDependency) => {
  const deleteService = [];
  if (projectType === PROJECT_TYPE.MVC_SEQUELIZE || projectType === PROJECT_TYPE.MVC) {
    const commonDeleteService = writeOperations.loadTemplate(`${templateFolderName}/deleteDependentService1.js`);
    commonDeleteService.locals.DELETE_DEPENDENCY = deleteDependency;
    commonDeleteService.locals.PROJECT_TYPE = projectType;
    deleteService.push(commonDeleteService);
    if (!isEmpty(deleteDependency)) { deleteService.push(commonDeleteService); }
  } else {
    forEach(deleteDependency, (dependency, modelName) => {
      const modelDeleteDependency = writeOperations.loadTemplate(`${templateFolderName}/deleteDependentService1.js`);
      modelDeleteDependency.locals.MODEL_NAME = modelName;
      modelDeleteDependency.locals.MODEL_FC = (modelName).charAt(0).toUpperCase() + (modelName).slice(1);
      modelDeleteDependency.locals.DELETE_DEPENDENCY = dependency;

      let dbDependencyInjection = [modelName];
      if (!isEmpty(dependency)) {
        forEach(dependency, (value) => {
          dbDependencyInjection.push(value.model);
        });
      }
      dbDependencyInjection = uniq(dbDependencyInjection);
      modelDeleteDependency.locals.DB_DEPENDENCY_INJECTION = dbDependencyInjection;
      if (!isEmpty(dependency)) { deleteService.push(modelDeleteDependency); }
    });
  }
  return deleteService;
};

module.exports = { generateDeleteDependencyService };
