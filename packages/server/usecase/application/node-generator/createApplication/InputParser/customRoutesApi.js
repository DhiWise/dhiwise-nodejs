/* global  _ */
const parseRoutesApiWithExistingFiles = (routes, modelObjs) => {
  let models = [];
  if (modelObjs) {
    models = Object.keys(modelObjs);
  }
  const apis = routes.map((api) => {
    if (api?.routeFileName && api?.controllerFileName && !_.isEmpty(models)) {
      const routeModelName = api?.routeFileName.replace(/Routes$/, '');
      const controllerModelName = api?.controllerFileName.replace(/Controller$/, '');
      if (routeModelName === controllerModelName) {
        if (models.includes(routeModelName)) {
          api.model = routeModelName;
          api.isUploadedCodeBlock = true;
          api.controller = routeModelName;
          api.service = routeModelName;
          delete api.routeFileName;
          delete api.controllerFileName;
          delete api.controllerFilePath;
          delete api.routeFilePath;
        }
      } else {
        api.isUploadedCodeBlock = true;
      }
    }
    return api;
  });
  return apis;
};

module.exports = { parseRoutesApiWithExistingFiles };
