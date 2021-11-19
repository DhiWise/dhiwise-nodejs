const {
  keys, forEach,
} = require('lodash');
const writeOperations = require('../writeOperations');

async function createEntities (entityFolderPath, entities) {
  const allEJSEntities = {};
  forEach(entities, (value, key) => {
    const entityTemplate = writeOperations.loadTemplate(`${entityFolderPath}/entity.js`);
    entityTemplate.locals.ENTITY_NAME_FC = key.charAt(0).toUpperCase() + key.slice(1);
    entityTemplate.locals.ENTITY_NAME = key;
    entityTemplate.locals.ENTITY_KEYS = keys(entities[key]);
    allEJSEntities[key] = entityTemplate;
  });
  return allEJSEntities;
}

module.exports = { createEntities };
