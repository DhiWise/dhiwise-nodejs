import React from 'react';
import { useSelector } from 'react-redux';
import { getProjectRoleAccess } from '../../api/projectRoleAccess';
import { useBoolean } from '../../components/hooks';
import { useToastNotifications } from '../hooks';

export const RoleAccessContext = React.createContext();

export const ROLE_ACCESS_ACTION_TYPES = {
  FETCH_LIST: 'fetchRoleAccessList',
  ADD_ROLE: 'addRoleAccess',
  DELETE_ROLE: 'deleteRoleAccess',
  SELECT_ROLE: 'selectRole',
  SELECTED_ROLE_DATA: 'selectedRoleData',
  EDIT_SELECTED_ROLE_DATA: 'editSelectedRoleData',
};

function roleAccessReducer(state, { type, payload = {} }) {
  switch (type) {
    case ROLE_ACCESS_ACTION_TYPES.FETCH_LIST: {
      return {
        ...state, roleAccessList: payload || [], selectedRole: payload?.[0]?._id || null, selectedRoleData: payload?.find((role) => role?._id === payload?.[0]?._id) || {},
      };
    }
    case ROLE_ACCESS_ACTION_TYPES.ADD_ROLE: {
      const { roleAccessList } = state;
      roleAccessList.unshift({ ...payload });
      return {
        ...state, roleAccessList, selectedRole: payload?._id, selectedRoleData: payload,
      };
    }
    case ROLE_ACCESS_ACTION_TYPES.DELETE_ROLE: {
      const roleAccessList = state.roleAccessList?.filter((role) => role?._id !== state.selectedRole) || [];
      const selectedRole = roleAccessList?.[0]?._id || null;
      const selectedRoleData = roleAccessList?.find((role) => role?._id === selectedRole) || {};
      return {
        ...state, roleAccessList, selectedRole, selectedRoleData,
      };
    }
    case ROLE_ACCESS_ACTION_TYPES.SELECT_ROLE: {
      return { ...state, selectedRole: payload };
    }
    case ROLE_ACCESS_ACTION_TYPES.SELECTED_ROLE_DATA: {
      return { ...state, selectedRoleData: state.roleAccessList?.find((role) => role?._id === payload) || {}, selectedRole: payload || null };
    }
    case ROLE_ACCESS_ACTION_TYPES.EDIT_SELECTED_ROLE_DATA: {
      const updatedRoleAccessList = state.roleAccessList?.map((role) => {
        if (role?._id === state.selectedRole) {
          return payload;
        }
        return role;
      });
      return { ...state, roleAccessList: updatedRoleAccessList, selectedRoleData: payload };
    }
    default: {
      throw new Error(`Unhandled action type: ${type}`);
    }
  }
}

const RoleAccessProvider = ({ children }) => {
  const [stateData, dispatch] = React.useReducer(roleAccessReducer, { roleAccessList: [], selectedRoleData: {}, selectedRole: null });

  const applicationId = useSelector((state) => state.projects.currentApplicationId);

  const { addErrorToast } = useToastNotifications();
  const [isLoading, setLoading, removeLoading] = useBoolean(false);

  React.useEffect(() => {
    setLoading();
    getProjectRoleAccess({ applicationId }).then((roleRes) => {
      if (roleRes?.data?.list) {
        dispatch({ type: ROLE_ACCESS_ACTION_TYPES.FETCH_LIST, payload: roleRes?.data?.list || [] });
      }
    }).catch(addErrorToast).finally(removeLoading);
  }, [applicationId]);

  const value = {
    isLoading,
    setLoading,
    removeLoading,
    roleAccessList: stateData.roleAccessList,
    selectedRoleData: stateData.selectedRoleData,
    selectedRole: stateData.selectedRole,
    dispatch,
  };
  return <RoleAccessContext.Provider value={value}>{children}</RoleAccessContext.Provider>;
};

function useRoleAccess() {
  const context = React.useContext(RoleAccessContext);
  if (context === undefined) {
    throw new Error('useRoleAccess must be used within a RoleAccessProvider');
  }
  return context;
}

export { RoleAccessProvider, useRoleAccess };
