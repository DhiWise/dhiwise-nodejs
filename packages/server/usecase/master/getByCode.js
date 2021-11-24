/* global _,MESSAGE */
const { message } = require('../../constants/message');
const { masterCodeValidation } = require('../util/validation/masterValidation');

/**
 * Function used to prepare data tree wise.
 * @param  {} listData
 */
function prepareMasterSubMaster (listData) {
  const masterSubMaster = [];
  const mappedArr = {};
  let arrElem;
  let mappedElem;

  for (let i = 0, len = listData.length; i < len; i += 1) {
    arrElem = listData[i];
    mappedArr[arrElem._id] = arrElem;
    mappedArr[arrElem._id].subMaster = [];
  }

  _.each(mappedArr, (value, id) => {
    // eslint-disable-next-line no-prototype-builtins
    if (mappedArr.hasOwnProperty(id)) {
      mappedElem = mappedArr[id];
      if (mappedElem.parentId) {
        if (mappedArr[mappedElem.parentId]) {
          mappedArr[mappedElem.parentId].subMaster.push(mappedElem);
        } else {
          masterSubMaster.push(mappedElem);
        }
      } else {
        masterSubMaster.push(mappedElem);
      }
    }
  });
  return masterSubMaster;
}

/**
 * Function used to get Child records
 * @param  {} data
 * @param  {} arr=[]
 * @param  {} level=1
 */
async function getChildRecord (data, arr = [], level = 1) {
  let newArr = [];
  const {
    masterRepo, params, masterListData,
  } = data;
  if (params && params.isSub && params.isSub === true) {
    const ids = _.map(masterListData, '_id');

    const filter = ids;
    const masterData = await masterRepo.getChildDetails(filter);
    if (masterData && _.size(masterData) > 0) {
      newArr = _.compact([...arr, ...masterData]);

      if (params && params.level >= 0) {
        if (params.level >= level) {
          level += 1;
          const childData = await getChildRecord({
            masterRepo,
            params,
            masterListData: masterData,
          }, newArr, level);
          return childData;
        }
      } else {
        const childData = await getChildRecord({
          masterRepo,
          params,
          masterListData: masterData,
        }, newArr);
        return childData;
      }
    }
  }
  return arr;
}

const getByCode = (masterRepo) => async (params) => {
  try {
    const {
      value, error,
    } = masterCodeValidation(params);
    if (error) {
      return {
        data: null,
        code: MESSAGE.BAD_REQUEST.code,
        message: error,
      };
    }
    params = value;
    const filterParams = _.cloneDeep(params);
    delete filterParams.isSub;
    delete filterParams.level;

    let listData = await masterRepo.getMasterByCode(params);

    if (params.isSub || params.level) {
      listData = await getChildRecord({
        masterRepo,
        params,
        masterListData: listData,
      }, listData);
    }

    listData = await prepareMasterSubMaster(_.cloneDeep(listData));

    const response = {
      list: listData,
      count: listData.length,
    };

    return {
      ...message.OK,
      data: response,
    };
  } catch (err) {
    // console.log('error', err);
    return {
      data: err,
      code: message.SERVER_ERROR.code,
    };
  }
};
module.exports = getByCode;
