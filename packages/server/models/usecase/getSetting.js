/* global */
const Repo = require('../Repo/Connection');
const { MODULE } = require('../constants/common');

const repo = new Repo(MODULE.SETTING);

const getSetting = async () => repo.getOne({});

const getSettingByKey = async (key) => {
  const setting = await getSetting();
  return setting?.[key] || '';
};

const getFrontSiteVersionTag = async () => { await getSettingByKey('frontSiteVersionTag'); };

module.exports = {
  getSetting,
  getSettingByKey,
  getFrontSiteVersionTag,
};
