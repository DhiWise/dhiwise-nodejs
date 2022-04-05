const { forEach, isEmpty, find } = require('lodash');
const writeOperations = require('../../writeOperations');
const {getImportPath} = require('../utils/common')


async function makeFileUploadFiles (fileUploadObj) {
  const { jsonData } = fileUploadObj;
  const { templateFolder } = fileUploadObj;
  const { auth } = fileUploadObj;
  const returnObj = {
    controllers: [],
    routes: [],
    packageDependencies: { dependencies: {} },
  };
  const controller = writeOperations.loadTemplate(`${templateFolder}${fileUploadObj.controllerPath}/fileUploadController.js`);
  forEach(jsonData, (obj) => {
    const FileUpload = [];
    if (obj.storage !== undefined && (obj.storage.toLowerCase() === 's3' || obj.storage.toLowerCase() === 's3_private')) {
      returnObj.packageDependencies.dependencies['aws-sdk'] = '~2.901.0';
    }
    if (obj.storage !== undefined && obj.storage.toLowerCase() === 's3_private') {
      returnObj.packageDependencies.dependencies['amazon-s3-uri'] = '~0.1.1';
    }
    // main Route
    const uploadRoutes = writeOperations.loadTemplate(`${templateFolder}${fileUploadObj.routePath}/uploadRoutes.js`);
    uploadRoutes.locals.IS_AUTH = obj.authentication && auth.isAuth;
    uploadRoutes.locals.FILE_UPLOAD = FileUpload;
    uploadRoutes.locals.PLATFORM = obj.platform;
    if (obj.platform === 'admin') {
      uploadRoutes.locals.PLATFORM_PREFIX = `${obj.platform.toLowerCase()}`;
    } else {
      uploadRoutes.locals.PLATFORM_PREFIX = `${obj.platform.toLowerCase()}/api/v1`;
    }
    uploadRoutes.locals.S3_UPLOAD_PRIVATE = !!(obj.storage !== undefined && obj.storage.toLowerCase() === 's3_private');
    returnObj.routes.push({
      platform: obj.platform,
      mainRoute: uploadRoutes,
    });
    controller.locals.S3_UPLOAD = !!(obj.storage !== undefined && (obj.storage.toLowerCase() === 's3' || obj.storage.toLowerCase() === 's3_private'));
    controller.locals.S3_UPLOAD_PRIVATE = !!(obj.storage !== undefined && obj.storage.toLowerCase() === 's3_private');
    controller.locals.MAX_SIZE = obj.maxSize;
    controller.locals.VALIDATION_TYPES = obj.validationType ? obj.validationType : [];
    controller.locals.PATH = fileUploadObj.fileUploadControllerPath;
    returnObj.controllers.push({
      platform: obj.platform,
      controller,
    });
  });
  returnObj.packageDependencies.dependencies.formidable = '~2.0.1';
  returnObj.packageDependencies.dependencies['valid-url'] = '~1.0.9';
  return returnObj;
}
async function makeFileUploadService(templatePath, fileUploadData) {
  const fileUploadService = writeOperations.loadTemplate(`${templatePath}/fileUpload.js`);
  const s3Upload = find(fileUploadData, (fileUpload) => fileUpload.storage.toLowerCase() === 's3' || fileUpload.storage.toLowerCase() === 's3_private');
  const s3Private = find(fileUploadData, (fileUpload) => fileUpload.storage.toLowerCase() === 's3_private');
  const local = find(fileUploadData, (fileUpload) => fileUpload.storage.toLowerCase() === 'local');

  fileUploadService.locals.LOCAL_UPLOAD = local ? true : false;
  fileUploadService.locals.S3_UPLOAD = s3Upload ? true : false;;
  fileUploadService.locals.S3_UPLOAD_PRIVATE = s3Private ? true : false;
  return fileUploadService;
}

async function makeFileUploadUsecase(templatePath, uploadsFunctions) {

  const fileUploadUsecase = [];
  if (!isEmpty(uploadsFunctions)) {
    forEach(uploadsFunctions, (uploadsFunctionDetails) => {
      //console.log(uploadsFunctionDetails); process.exit(1);
      const uploadsFunction = writeOperations.loadTemplate(`${templatePath}/fileUpload.js`);
      uploadsFunction.locals.LOCAL_UPLOAD = uploadsFunctionDetails.storage === 'local' ? true : false;

      uploadsFunction.locals.S3_UPLOAD = (uploadsFunctionDetails.storage.toLowerCase() === 's3' || uploadsFunctionDetails.storage.toLowerCase() === 's3_private') ? true : false;

      uploadsFunction.locals.S3_UPLOAD_PRIVATE = (uploadsFunctionDetails.storage.toLowerCase() === 's3_private') ? true : false;

      uploadsFunction.locals.ALLOWED_TYPE = uploadsFunctionDetails.validationType || null;
      uploadsFunction.locals.MAX_SIZE = uploadsFunctionDetails.maxSize || null;

      fileUploadUsecase.push(uploadsFunction);
      delete uploadsFunction;
    });
  }

  return fileUploadUsecase;
}

const makeFileUploadControllerIndex = async (templatePath, platforms, userDirectoryStructure) => {
  const fileUploadControllerIndex = [];
  forEach(platforms, (platform) => {
    const fileUploadCtrlInd = writeOperations.loadTemplate(`${templatePath}/fileUploadControllerIndex.js`);
    fileUploadCtrlInd.locals.PLATFORM = platform;
    // if(platform === 'admin'){
    //   fileUploadCtrlInd.locals.USECASE_PATH  = getImportPath(userDirectoryStructure.adminFileUploadControllerPath, userDirectoryStructure.useCaseFolderPath)
    // }else{
      fileUploadCtrlInd.locals.USECASE_PATH  = getImportPath(userDirectoryStructure.fileUploadControllerPath, userDirectoryStructure.useCaseFolderPath)
   // }
    fileUploadControllerIndex.push(fileUploadCtrlInd);
    fileUploadControllerIndex.push(fileUploadCtrlInd);
    delete fileUploadCtrlInd;
  });
  return fileUploadControllerIndex;
}

module.exports = {
  makeFileUploadFiles, makeFileUploadService, makeFileUploadUsecase, makeFileUploadControllerIndex
};

