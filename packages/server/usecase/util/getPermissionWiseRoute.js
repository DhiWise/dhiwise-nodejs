/* global _ */
const getRoutes = require('./getRoutes');

function getPermissionWiseRoute (schemaJson, schemaDetail, definitionCode = null) {
  let allRouts = [];

  _.each(schemaJson, (val, key) => {
    if (key && !_.isEmpty(schemaJson[key])) {
      allRouts = allRouts.concat(getRoutes(key, schemaDetail.name, true, schemaJson[key], definitionCode));
    }
  });
  /*
   * if (schemaJson.admin) {
   * allRouts = allRouts.concat(getRoutes('admin', schemaDetail.name, true, schemaJson.admin));
   * }
   * if (schemaJson.device) {
   * allRouts = allRouts.concat(getRoutes('device', schemaDetail.name, true, schemaJson.device));
   * }
   *
   * if (schemaJson.desktop) {
   * allRouts = allRouts.concat(getRoutes('desktop', schemaDetail.name, true, schemaJson.desktop));
   * }
   *
   * if (schemaJson.client) {
   * allRouts = allRouts.concat(getRoutes('client', schemaDetail.name, true, schemaJson.client));
   * }
   */

  _.each(allRouts, (r) => {
    r.modelId = schemaDetail._id;
    r.applicationId = schemaDetail.applicationId;
    r.groupName = schemaDetail.name;
  });

  return allRouts;
}

module.exports = getPermissionWiseRoute;
