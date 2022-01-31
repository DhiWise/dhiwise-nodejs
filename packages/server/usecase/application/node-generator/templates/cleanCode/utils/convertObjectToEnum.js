const convertObjectToEnum = (obj) => {
  const enumArr = [];
  Object.values(obj).map((val) => enumArr.push(val));
  return enumArr;
};

module.exports = convertObjectToEnum;
