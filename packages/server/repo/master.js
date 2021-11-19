/* eslint-disable class-methods-use-this */
const { masterData } = require('../assets/master');
const { MASTER_PARENT_CODES } = require('../models/constants/master');

class masterRepository {
  async getDetailsForInput () {
    const results = [];
    for (let i = 0; i < masterData.length; i += 1) {
      if (masterData[i].parentCode === MASTER_PARENT_CODES.SOCIAL_AUTH) {
        results.push(masterData[i]);
      }
    }
    return results;
  }

  async getMasterByCode (filter) {
    const results = [];
    const field = filter.code ? 'code' : 'parentCode';
    for (let i = 0; i < masterData.length; i += 1) {
      if (masterData[i][field] === filter[field]) {
        results.push(masterData[i]);
      }
    }
    return results;
  }

  async getChildDetails (filter) {
    const results = [];
    for (let i = 0; i < masterData.length; i += 1) {
      if (filter.includes(masterData[i].parentId)) {
        results.push(masterData[i]);
      }
    }
    return results;
  }
}

module.exports = masterRepository;
