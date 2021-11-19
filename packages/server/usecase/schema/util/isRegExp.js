const isRegExp = (string) => {
  try {
    // eslint-disable-next-line no-new-func
    return new Function(`
              "use strict";
              try {
                  new RegExp(${string});
                  return true;
              } catch (e) {
                  return false;
              }
          `)();
  } catch (e) {
    return false;
  }
};

module.exports = isRegExp;
