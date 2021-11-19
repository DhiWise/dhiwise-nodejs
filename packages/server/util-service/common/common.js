const fs = require('fs');

/**
 * Function used get `directories, sub-directories, files` count.
 * @param  {} dirPath
 * @param  {} arrayOfFiles
 */
async function getAllDirFilesCount (dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(async (file) => {
    if (fs.statSync(`${dirPath}/${file}`).isDirectory()) {
      arrayOfFiles = await getAllDirFilesCount(`${dirPath}/${file}`, arrayOfFiles);
    } else {
      arrayOfFiles.push(file);
    }
  });

  return arrayOfFiles.length;
}

module.exports = { getAllDirFilesCount };
