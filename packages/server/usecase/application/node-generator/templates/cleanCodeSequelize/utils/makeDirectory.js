const fs = require('fs');
/**
 *
 * Function used to create directory.
 *
 * @param  {string} dirPath
 * @returns  {boolean}
 */
const makeDirectory = async (directoryPath) => {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
    return true;
  }
  return true;
};

module.exports = makeDirectory;
