const { forEach } = require('lodash');
const writeOperations = require('../../writeOperations');

const createDataAccessFiles = (templatePath, models) => {
  const allDataAccessFiles = {};
  forEach(models, (value, key) => {
    const dbFileTemplate = writeOperations.loadTemplate(`${templatePath}/dbFile.js`);
    dbFileTemplate.locals.MODEL_NAME_FC = key.charAt(0).toUpperCase() + key.slice(1);
    dbFileTemplate.locals.MODEL_NAME = key;
    allDataAccessFiles[key] = dbFileTemplate;
  });
  return allDataAccessFiles;
};

module.exports = { createDataAccessFiles };
