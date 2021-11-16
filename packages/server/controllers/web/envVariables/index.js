const EnvVariablesRepository = require('../../../repo/envVariables');
const ApplicationRepo = require('../../../repo/application');

const envVariablesRepo = new EnvVariablesRepository();
const applicationRepo = new ApplicationRepo();

const upsertUseCase = require('../../../usecase/envVariables/upsert')(envVariablesRepo, applicationRepo);
const getUseCase = require('../../../usecase/envVariables/get')(envVariablesRepo);

const envVariables = require('./envVariables');

const upsert = envVariables.upsert({ upsertUseCase });
const get = envVariables.get({ getUseCase });

module.exports = {
  upsert,
  get,
};
