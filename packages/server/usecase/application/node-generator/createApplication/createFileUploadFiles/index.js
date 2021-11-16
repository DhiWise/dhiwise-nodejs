const { forEach } = require('lodash');
const writeOperations = require('../../writeOperations');

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
  returnObj.packageDependencies.dependencies.formidable = '~1.2.2';
  returnObj.packageDependencies.dependencies['valid-url'] = '~1.0.9';
  return returnObj;
}

module.exports = { makeFileUploadFiles };
