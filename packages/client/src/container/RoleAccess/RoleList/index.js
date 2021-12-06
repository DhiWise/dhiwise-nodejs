import React from 'react';
import { Menu } from 'react-pro-sidebar';
import { SidebarList } from '../../Shared/Layout/Sidebar/SubSidebar';
import { SidebarMenuList } from '../../../components';
import { ROLE_ACCESS_ACTION_TYPES, useRoleAccess } from '../RoleAccessProvider';

export const RoleList = React.memo(({ handleShow }) => {
  const { roleAccessList, selectedRole, dispatch } = useRoleAccess();

  return (
    <SidebarList isAddButton title="Role access" addClick={handleShow} tooltip="Add Role">
      <Menu iconShape="square" className="p-2">
        <SidebarMenuList
          mainMenuList={roleAccessList}
          titleKey="name"
          onClick={(data) => dispatch({ type: ROLE_ACCESS_ACTION_TYPES.SELECTED_ROLE_DATA, payload: data })}
          initialSelectedId={selectedRole || roleAccessList?.[0]?._id}
        />
      </Menu>
    </SidebarList>
  );
});
RoleList.displayName = 'RoleList';
