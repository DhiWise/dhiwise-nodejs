import React from 'react';
import { Menu } from 'react-pro-sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { SidebarList } from '../Shared/Layout/Sidebar/SubSidebar';
import { SidebarMenuList } from '../../components';
import { setCurrentPolicy } from '../../redux/reducers/policy';

export const LeftPolicyList = React.memo(({
  addPolicy,
}) => {
  const dispatch = useDispatch();
  const policyList = useSelector((state) => state.policy.policyList);
  const currentPolicy = useSelector((state) => state.policy.currentId);

  return (
    <SidebarList isAddButton title="Middleware" addClick={addPolicy} tooltip="Add middleware">
      <Menu iconShape="square" className="p-2">
        <SidebarMenuList
          mainMenuList={policyList}
          titleKey="fileName"
          onClick={(data) => dispatch(setCurrentPolicy(data))}
          initialSelectedId={currentPolicy || policyList?.[0]?._id}
        />
      </Menu>
    </SidebarList>
  );
});
LeftPolicyList.displayName = 'LeftPolicyList';
