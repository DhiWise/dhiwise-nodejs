import React from 'react';
import { isEmpty } from 'lodash';

export const PermissionSettingContext = React.createContext();

export const SETTING_ACTION_TYPES = {
  MUTATE_EDIT: 'mutateEditSetting',
  EDIT: 'editSetting',
  EDIT_DATA: 'editSettingData',
  RESET_EDIT_DATA: 'resetEditSettingData',
};

function permissionSettingReducer(state, { type, payload }) {
  switch (type) {
    case SETTING_ACTION_TYPES.MUTATE_EDIT: {
      return { ...state, editSettingData: payload || {} };
    }
    case SETTING_ACTION_TYPES.EDIT: {
      const { editSettingData } = state;
      if (isEmpty(Object.keys(editSettingData))) {
        editSettingData[payload.operation] = payload;
      }
      Object.keys(editSettingData)?.forEach((operation) => {
        if (operation === payload?.operation) {
          editSettingData[operation] = payload;
        } else {
          editSettingData[payload.operation] = payload;
        }
      });
      return { ...state, editSettingData };
    }
    case SETTING_ACTION_TYPES.EDIT_DATA: {
      return { ...state, editSettingData: payload };
    }
    case SETTING_ACTION_TYPES.RESET_EDIT_DATA: {
      return { ...state, editSettingData: {} };
    }
    default: {
      throw new Error(`Unhandled action type: ${type}`);
    }
  }
}

const PermissionSettingProvider = ({ children }) => {
  const [stateData, dispatch] = React.useReducer(permissionSettingReducer, { editSettingData: {} });
  const value = {
    editSettingData: stateData.editSettingData,
    dispatch,
  };
  return <PermissionSettingContext.Provider value={value}>{children}</PermissionSettingContext.Provider>;
};

function useSettings() {
  const context = React.useContext(PermissionSettingContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a PermissionSettingProvider');
  }
  return context;
}

export { PermissionSettingProvider, useSettings };
