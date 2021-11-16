/* global MODE_0666 */
const path = require('path');
const writeOperations = require('../../writeOperations');

async function createCommonRoutes (dir, templateFolder, platforms, toPath) {
  const commonIndex = writeOperations.loadTemplate(`${templateFolder}/commonIndexRoutes.js`);
  commonIndex.locals.PLATFORM = platforms;
  writeOperations.write(path.join(dir, `${toPath}/common/index.js`), commonIndex.render(), MODE_0666);
}

module.exports = { createCommonRoutes };
