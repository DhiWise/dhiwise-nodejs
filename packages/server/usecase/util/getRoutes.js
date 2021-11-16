function getRoutes (platform, model, isAuth, permission = ['C', 'R', 'U', 'D']) {
  const requestArr = [];

  let addMethod = {};
  let insertBulkObj = {};
  let findAllUserObj = {};
  let findOneObj = {};
  let updateObj = {};
  let updateBulkObj = {};
  let deleteObj = {};

  addMethod = {
    method: 'post',
    route: platform.toLowerCase() === 'admin' ? `/${platform.toLowerCase()}/${model.toLowerCase()}/create` : `/${platform.toLowerCase()}/route/v1/${model.toLowerCase()}/create`,
    controller: `${model}Controller`,
    platform,
    action: `add${model.charAt(0).toUpperCase() + model.slice(1)}`,
    isAuth,
    fileName: `${model}Route`,
  };
  insertBulkObj = {
    method: 'post',
    route: platform.toLowerCase() === 'admin' ? `/${platform.toLowerCase()}/${model.toLowerCase()}/addBulk` : `/${platform.toLowerCase()}/route/v1/${model.toLowerCase()}/addBulk`,
    controller: `${model}Controller`,
    platform,
    action: `bulkInsert${model.charAt(0).toUpperCase() + model.slice(1)}`,
    isAuth,
    fileName: `${model}Route`,
  };
  findAllUserObj = {
    method: 'post',
    route: platform.toLowerCase() === 'admin' ? `/${platform.toLowerCase()}/${model.toLowerCase()}/list` : `/${platform.toLowerCase()}/route/v1/${model.toLowerCase()}/list`,
    controller: `${model}Controller`,
    platform,
    action: `findAll${model.charAt(0).toUpperCase() + model.slice(1)}`,
    isAuth,
    fileName: `${model}Route`,
  };
  findOneObj = {
    method: 'get',
    route: platform.toLowerCase() === 'admin' ? `/${platform.toLowerCase()}/${model.toLowerCase()}/{{id}}` : `/${platform.toLowerCase()}/route/v1/${model.toLowerCase()}/{{id}}`,
    controller: `${model}Controller`,
    platform,
    action: `get${model.charAt(0).toUpperCase() + model.slice(1)}`,
    isAuth,
    fileName: `${model}Route`,
  };
  updateObj = {
    method: 'put',
    route: platform.toLowerCase() === 'admin' ? `/${platform.toLowerCase()}/${model.toLowerCase()}/update/{{id}}` : `/${platform.toLowerCase()}/route/v1/${model.toLowerCase()}/update/{{id}}`,
    controller: `${model}Controller`,
    platform,
    action: `update${model.charAt(0).toUpperCase() + model.slice(1)}`,
    isAuth,
    fileName: `${model}Route`,
  };
  updateBulkObj = {
    method: 'put',
    route: platform.toLowerCase() === 'admin' ? `/${platform.toLowerCase()}/${model.toLowerCase()}/updateBulk` : `/${platform.toLowerCase()}/route/v1/${model.toLowerCase()}/updateBulk`,
    controller: `${model}Controller`,
    platform,
    action: `bulkUpdate${model.charAt(0).toUpperCase() + model.slice(1)}`,
    isAuth,
    fileName: `${model}Route`,
  };
  deleteObj = {
    method: 'delete',
    route: platform.toLowerCase() === 'admin' ? `/${platform.toLowerCase()}/${model.toLowerCase()}/delete/{{id}}` : `/${platform.toLowerCase()}/route/v1/${model.toLowerCase()}/delete/{{id}}`,
    controller: `${model}Controller`,
    platform,
    action: `delete${model.charAt(0).toUpperCase() + model.slice(1)}`,
    isAuth,
    fileName: `${model}Route`,
  };

  if (permission.includes('C')) {
    requestArr.push(addMethod);
  }

  if (permission.includes('BC')) {
    requestArr.push(insertBulkObj);
  }

  if (permission.includes('R')) {
    requestArr.push(findAllUserObj);
    requestArr.push(findOneObj);
  }

  if (permission.includes('U')) {
    requestArr.push(updateObj);
  }

  if (permission.includes('BU')) {
    requestArr.push(updateBulkObj);
  }

  if (permission.includes('D')) {
    requestArr.push(deleteObj);
  }

  return requestArr;
}

module.exports = getRoutes;
