const writeOperations = require('../writeOperations');

async function generateStaticFilesForCC (templateFolderName, dir, userDirectoryStructure) {
  writeOperations.copyTemplateMulti(`${templateFolderName}/helpers`, `${dir}${userDirectoryStructure.helperFolderPath}`, '*.js');
  writeOperations.copyTemplateMulti(`${templateFolderName}/utils`, `${dir}${userDirectoryStructure.utilsFolderPath}`, '*.js');
  writeOperations.copyTemplate(`${templateFolderName}/validation/genericValidator.js`, `${dir}${userDirectoryStructure.validationFolderPath}/genericValidator.js`);
  writeOperations.copyTemplate(`${templateFolderName}/services/dbService.js`, `${dir}${userDirectoryStructure.serviceFolderPath}/mongoDbService.js`);
}

async function generateStaticFilesForMVC (templateFolderName, dir, userDirectoryStructure) {
  writeOperations.copyTemplateMulti(`${templateFolderName}/utils`, `${dir}${userDirectoryStructure.utilsFolderPath}`, '*.js');
}
async function generateStaticFilesForMVCSequelize (templateFolderName, dir, userDirectoryStructure) {
  writeOperations.copyTemplateMulti(`${templateFolderName}/utils`, `${dir}${userDirectoryStructure.utilsFolderPath}`, '*.js');
}
async function generateStaticFilesForCCSequelize (templateFolderName, dir) {
  writeOperations.copyTemplateMulti(`${templateFolderName}/helpers`, `${dir}/helpers`, '*.js');
  writeOperations.copyTemplateMulti(`${templateFolderName}/utils`, `${dir}/utils`, '*.js');
  writeOperations.copyTemplate(`${templateFolderName}/validation/genericValidator.js`, `${dir}/validation/genericValidator.js`);
  writeOperations.copyTemplate(`${templateFolderName}/services/dbService.js`, `${dir}/services/dbService.js`);
}
async function addRolePermissionService (templateFolderName) {
  const rolePermissionService = writeOperations.loadTemplate(`${templateFolderName}/checkRolePermission.js`);
  return rolePermissionService;
}
module.exports = {
  generateStaticFilesForCC,
  generateStaticFilesForMVC,
  generateStaticFilesForCCSequelize,
  addRolePermissionService,
  generateStaticFilesForMVCSequelize,
};
