/* eslint-disable no-param-reassign */
import { cloneDeep, uniq } from 'lodash';
import { CRUD, CRUD_OPERATIONS } from '../../../constant/permission';

export function prepareSettingData(settings, platform, operation, permission) {
  settings[platform][operation] = {};
  settings[platform][operation].isAuth = permission?.schemaJson?.[platform]?.[CRUD.isAuth];
  settings[platform][operation].selected = permission?.schemaJson?.[platform]?.[operation];
  settings[platform][operation].policy = permission?.schemaJson?.[platform]?.[CRUD.POLICY];
  settings[platform][operation].attributes = [];
}

export const isCrud = (action) => [CRUD.C, CRUD.R, CRUD.U, CRUD.D, CRUD.BC, CRUD.BU, CRUD.HD, CRUD.ALL].includes(action);

export const getDeviceOperation = (deviceOperations) => ({
  [CRUD.C]: deviceOperations.includes(CRUD.C),
  [CRUD.R]: deviceOperations.includes(CRUD.R),
  [CRUD.U]: deviceOperations.includes(CRUD.U),
  [CRUD.D]: deviceOperations.includes(CRUD.D),
  [CRUD.BC]: deviceOperations.includes(CRUD.BC),
  [CRUD.BU]: deviceOperations.includes(CRUD.BU),
  [CRUD.HD]: deviceOperations.includes(CRUD.HD),
});

export const isAnyAction = (deviceObj) => {
  // marked checked all for actions
  const deviceType = cloneDeep(deviceObj);
  delete deviceType.ALL;
  const allCrud = {
    [CRUD.C]: deviceType[CRUD.C],
    [CRUD.R]: deviceType[CRUD.R],
    [CRUD.U]: deviceType[CRUD.U],
    [CRUD.D]: deviceType[CRUD.D],
    [CRUD.BC]: deviceType[CRUD.BC],
    [CRUD.BU]: deviceType[CRUD.BU],
    [CRUD.HD]: deviceType[CRUD.HD],
  };
  const isAll = Object.keys(allCrud)?.some((val) => deviceType[val]);
  return isAll;
};

export const isCheckedAll = (deviceObj) => {
  // marked checked all for actions
  const deviceType = cloneDeep(deviceObj);
  delete deviceType.ALL;
  const allCrud = {
    [CRUD.C]: deviceType[CRUD.C],
    [CRUD.R]: deviceType[CRUD.R],
    [CRUD.U]: deviceType[CRUD.U],
    [CRUD.D]: deviceType[CRUD.D],
    [CRUD.BC]: deviceType[CRUD.BC],
    [CRUD.BU]: deviceType[CRUD.BU],
    [CRUD.HD]: deviceType[CRUD.HD],
  };
  const isAll = Object.keys(allCrud)?.every((val) => deviceType[val]);
  return isAll;
};

export const isCheckedAllModel = (schema) => Object.keys(schema)?.every((val) => schema[val].ALL);

export const isCheckedAllDevice = (newPerm, loginAccess) => {
  // to check all device (Admin ALL)
  const deviceObject = {};
  loginAccess?.forEach((platform) => {
    deviceObject[platform] = newPerm?.every((p) => p.schemaJson[platform]?.ALL);
  });
  return deviceObject;
};

export const prepareData = (currentPermissions, applicationLoginAccess, setDeviceData) => {
  const newPermissions = currentPermissions?.map((permission) => {
    Object.keys(permission.schemaJson)?.map((platform) => {
      if (applicationLoginAccess?.includes(platform)) {
        const deviceOperations = permission.schemaJson[platform];
        let deviceObj = {};
        if (Array.isArray(deviceOperations)) {
          deviceObj = getDeviceOperation(deviceOperations);
          deviceObj[CRUD.ALL] = !!isCheckedAll(deviceObj); // ALL actions
          deviceOperations.forEach((action) => {
            if (typeof action === 'object') {
              deviceObj[CRUD.isAuth] = action[CRUD.isAuth];
              deviceObj[CRUD.POLICY] = action[CRUD.isAuth] ? uniq(action[CRUD.POLICY]?.concat('auth') || ['auth']) : uniq(action[CRUD.POLICY]?.filter((policy) => policy !== 'auth') || []);
            }
          });
          permission.schemaJson[platform] = deviceObj; // converted array to obj type
        }
        return platform;
      }
      delete permission.schemaJson[platform];
      return platform;
    });
    permission.isAllModal = isCheckedAllModel(permission.schemaJson); // ALL model
    return permission;
  });
  const checkedAllDevice = isCheckedAllDevice(newPermissions, applicationLoginAccess);// ALL device
  setDeviceData(checkedAllDevice);
  return newPermissions;
};

export const getSettingOperationsType = (operationType) => ((operationType === 'D') ? 'Soft Delete' : CRUD_OPERATIONS[operationType]);
