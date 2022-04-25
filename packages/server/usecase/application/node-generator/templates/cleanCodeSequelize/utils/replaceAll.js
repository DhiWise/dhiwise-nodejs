/**
 * replaceAll: find and replace all occurrence of a string in a searched string
 * @param {string} string  : string to be replace
 * @param {string} search  : string which you want to replace
 * @param {string} replace : string with which you want to replace a string
 * @return {string} : replaced new string
 */

function replaceAll (string, search, replace) {
  return string.split(search).join(replace);
}

module.exports = replaceAll;
