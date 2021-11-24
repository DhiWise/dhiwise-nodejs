const { execSync } = require('child_process');
const fs = require('fs');
const writeOperations = require('../writeOperations');

function copyEslintrcFile (templateFolderName, dir) {
  if (!fs.existsSync(`${dir}/.eslintrc.js`)) {
    writeOperations.copyTemplate(`${templateFolderName}/.eslintrc.js`, `${dir}/.eslintrc.js`);
  }
}

function executeEslintFix (dir) {
  try {
    const command = `cd "${dir}" && eslint . --ext .js --fix`;
    execSync(command);
  } catch (error) {
    // console.log(error);
  }
}
module.exports = {
  copyEslintrcFile,
  executeEslintFix,
};
