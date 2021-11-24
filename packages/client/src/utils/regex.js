export const removeLeadingSpace = /^ +/gm; // to remove all leading spaces

export const modelAttrRegex = /^[a-zA-Z_][a-zA-Z_0-9]*$/;

export const nodeKeyRegex = /^[a-zA-Z]+[\w0-9_]*$/; // fileName,key(attribute),functionName

export const URLRegex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;

export const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

export const isRegExp = (string) => {
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
    // console.log('false', e);
    return false;
  }
};
