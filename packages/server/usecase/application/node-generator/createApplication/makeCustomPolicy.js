const { forEach } = require('lodash');
const writeOperations = require('../writeOperations');

module.exports = {
  makeIndividualPolicy (policies, middlewarePath) {
    const returnPolicy = {};
    forEach(policies, (value, i) => {
      const policy = writeOperations.loadTemplate(`${middlewarePath}/sampleMiddleware.js`);
      policy.locals.POLICY = value;
      returnPolicy[i] = policy;
    });
    return returnPolicy;
  },
};
