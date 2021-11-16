/* eslint-disable no-param-reassign */
export function filterObjectTruthyValues(obj) {
  return Object.keys(obj)
    .reduce((o, key) => {
      !!obj[key] && (o[key] = obj[key]);
      return o;
    }, {});
}

export function filterObjectUndefinedValues(obj) {
  return Object.keys(obj)
    .reduce((o, key) => {
      obj[key] !== undefined && (o[key] = obj[key]);
      return o;
    }, {});
}
