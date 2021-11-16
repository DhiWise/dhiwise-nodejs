/* global __appRootDir,MESSAGE */
const { spawn } = require('child_process');
const path = require('path');

const openCode = () => async (params) => {
  try {
    const command = `cd "${path.join(__appRootDir, 'output', params.generatedId, params.name)}" && code .`;
    const response = await new Promise((resolve) => {
      const child = spawn(command, { shell: true });
      child.on('close', async () => {
        resolve(MESSAGE.OK);
        child.kill(0);
      });
    });
    return response;
  } catch (error) {
    return MESSAGE.SERVER_ERROR;
  }
};

module.exports = openCode;
