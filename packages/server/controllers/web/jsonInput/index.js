const jsonInputUseCase = require('../../../usecase/jsonInput/jsonInput')();

const jsonInputData = require('./jsonInput');

const jsonInput = jsonInputData.jsonInput({ jsonInputUseCase });

module.exports = { jsonInput };
