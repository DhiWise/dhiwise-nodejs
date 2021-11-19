const MasterRepository = require('../../../repo/master');

const masterRepo = new MasterRepository();
const getByCodeUseCase = require('../../../usecase/master/getByCode')(masterRepo);

const master = require('./master');

module.exports = { getByCode: master.getByCode({ getByCodeUseCase }) };
