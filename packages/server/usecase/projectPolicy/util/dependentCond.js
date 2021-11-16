/* global _ */
const schemaJsonObj = (project, policy) => {
  let schemaJsonData = [];
  if (project?.configInput?.platform) {
    _.map(project.configInput.platform, (val) => {
      const sjKey = `schemaJson.${val}`;
      const sObj = {};
      sObj[sjKey] = { $elemMatch: { policy: policy.fileName } };
      schemaJsonData.push(sObj);
    });
  } else {
    // Default schemaJson
    schemaJsonData = [
      { 'schemaJson.device': { $elemMatch: { policy: policy.fileName } } },
      { 'schemaJson.desktop': { $elemMatch: { policy: policy.fileName } } },
      { 'schemaJson.client': { $elemMatch: { policy: policy.fileName } } },
      { 'schemaJson.admin': { $elemMatch: { policy: policy.fileName } } },
    ];
  }

  return schemaJsonData;
};

const additionalJsonObj = (project, policy) => {
  // Check policy in additionalJson.
  let additionalJsonData = [];
  const operations = ['C', 'R', 'U', 'D', 'BC', 'BU', 'HD'];
  if (project?.configInput?.platform) {
    _.map(project.configInput.platform, (val) => {
      _.map(operations, (op) => {
        const ajKey = `additionalJson.additionalSetting.${val}.${op}.policy`;
        const addObj = {};
        addObj[ajKey] = policy.fileName;
        additionalJsonData.push(addObj);
      });
    });
  } else {
    additionalJsonData = [
      { 'additionalJson.additionalSetting.admin.C.policy': policy.fileName },
      { 'additionalJson.additionalSetting.admin.R.policy': policy.fileName },
      { 'additionalJson.additionalSetting.admin.U.policy': policy.fileName },
      { 'additionalJson.additionalSetting.admin.D.policy': policy.fileName },
      { 'additionalJson.additionalSetting.admin.BC.policy': policy.fileName },
      { 'additionalJson.additionalSetting.admin.BU.policy': policy.fileName },
      { 'additionalJson.additionalSetting.admin.HD.policy': policy.fileName },

      { 'additionalJson.additionalSetting.device.C.policy': policy.fileName },
      { 'additionalJson.additionalSetting.device.R.policy': policy.fileName },
      { 'additionalJson.additionalSetting.device.U.policy': policy.fileName },
      { 'additionalJson.additionalSetting.device.D.policy': policy.fileName },
      { 'additionalJson.additionalSetting.device.BC.policy': policy.fileName },
      { 'additionalJson.additionalSetting.device.BU.policy': policy.fileName },
      { 'additionalJson.additionalSetting.device.HD.policy': policy.fileName },

      { 'additionalJson.additionalSetting.desktop.C.policy': policy.fileName },
      { 'additionalJson.additionalSetting.desktop.R.policy': policy.fileName },
      { 'additionalJson.additionalSetting.desktop.U.policy': policy.fileName },
      { 'additionalJson.additionalSetting.desktop.D.policy': policy.fileName },
      { 'additionalJson.additionalSetting.desktop.BC.policy': policy.fileName },
      { 'additionalJson.additionalSetting.desktop.BU.policy': policy.fileName },
      { 'additionalJson.additionalSetting.desktop.HD.policy': policy.fileName },

      { 'additionalJson.additionalSetting.client.C.policy': policy.fileName },
      { 'additionalJson.additionalSetting.client.R.policy': policy.fileName },
      { 'additionalJson.additionalSetting.client.U.policy': policy.fileName },
      { 'additionalJson.additionalSetting.client.D.policy': policy.fileName },
      { 'additionalJson.additionalSetting.client.BC.policy': policy.fileName },
      { 'additionalJson.additionalSetting.client.BU.policy': policy.fileName },
      { 'additionalJson.additionalSetting.client.HD.policy': policy.fileName },
    ];
  }

  return additionalJsonData;
};

module.exports = {
  schemaJsonObj,
  additionalJsonObj,
};
