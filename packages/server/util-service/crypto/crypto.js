const CryptoJS = require('crypto-js');

const saltKey = 'nodejs-code-generator';

/**
 * Function used to encrypt the string.
 * @param  {} str
 */
async function encrypt (str) {
  return CryptoJS.AES.encrypt(str, saltKey).toString();
}

/**
 * Function used to deCrypt the encrypted string.
 * @param  {} str
 */
async function decrypt (str) {
  const bytes = CryptoJS.AES.decrypt(str, saltKey);
  return bytes.toString(CryptoJS.enc.Utf8);
}

module.exports = {
  encrypt,
  decrypt,
};
