const writeOperations = require('../writeOperations');

const generateDeleteDependencyService = async (templateFolderName, deleteDependency) => {
  const deleteService = writeOperations.loadTemplate(`${templateFolderName}/deleteDependentService1.js`);
  deleteService.locals.DELETE_DEPENDENCY = deleteDependency;
  return deleteService;
};

module.exports = { generateDeleteDependencyService };
