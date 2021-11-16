import { isBoolean, isNumber, isArray } from 'lodash';

export const compact = (array) => array.filter(Boolean);
export const isString = (value) => typeof value === 'string';
export const isFunction = (value) => typeof value === 'function';
export const get = (obj, path) => path.split(/[,[\].]+?/).reduce((o, key) => (o && o[key] ? o[key] : null), obj);
export const isNullOrUndefined = (value) => (value == null || value === undefined);
export const stringContainsCaseInsensitive = (search, subject) => subject.toLowerCase().indexOf(search.toLowerCase()) !== -1;

export const isUndefined = (value) => value === undefined;

export const isObjectType = (value) => typeof value === 'object';

export const isObject = (value) => !isNullOrUndefined(value)
    && !Array.isArray(value)
    && isObjectType(value)
    && !(value instanceof Date);

export function capitalizeStr(value) {
  if (value?.length > 0) {
    return value.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  } return value;
}

export const findMaxLengthObjectOfArray = (array) => {
  let maxNum = 0;
  let maxObject = {};
  array.find((val) => {
    if (isObject(val)) {
      if (maxNum < Object.keys(val).length) {
        maxNum = Object.keys(val).length;
        maxObject = val;
      }
    }
    return val;
  });
  return maxObject;
};

export const getAllKeysRecursion = (data, finalData = []) => {
  Object.keys(data).forEach((key) => {
    if (isString(data[key]) || isBoolean(data[key]) || isNumber(data[key])) {
      finalData.push(key);
    } else if (isObject(data[key]) && !isArray(data[key])) {
      getAllKeysRecursion(data[key], finalData);
    } else if (Array.isArray(data[key]) && (isObject(data[key][0]) && !isArray(data[key][0]))) {
      finalData.push(key);
      const maxObj = findMaxLengthObjectOfArray(data[key]);
      getAllKeysRecursion(maxObj, finalData);
    }
  });
  return finalData;
};

export const arrayMove = (arr, oldIndex, newIndex) => {
  if (newIndex >= arr.length) {
    let k = newIndex - arr.length + 1;
    // eslint-disable-next-line no-plusplus
    while (k--) {
      arr.push(undefined);
    }
  }
  arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
  return arr;
};
