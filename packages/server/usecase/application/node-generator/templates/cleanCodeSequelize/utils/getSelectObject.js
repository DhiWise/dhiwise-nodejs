/**
 * getSelectObject : to return a object of select from string, array
 * @param {string/array/obj} select : selection attributes
 * @returns {object} : object of select to be passed with filter
 */
const getSelectObject = (select) => {
  let selectArray = [];
  if (typeof select === 'string') {
    selectArray = select.split(' ');
  } else if (Array.isArray(select)) {
    selectArray = select;
  } else if (typeof select === 'object') {
    return select;
  }
  const selectObject = {};
  if (selectArray.length) {
    for (let index = 0; index < selectArray.length; index += 1) {
      const element = selectArray[index];
      if (element.startsWith('-')) {
        Object.assign(selectObject, { [element.substring(1)]: -1 });
      } else {
        Object.assign(selectObject, { [element]: 1 });
      }
    }
  }
  return selectObject;
};

module.exports = getSelectObject;
