import React from 'react';
import { Menu } from 'react-pro-sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { SidebarList } from '../../Shared/Layout/Sidebar/SubSidebar';
import { SidebarMenuList } from '../../../components';
import { setCurrentConstant } from '../../../redux/reducers/constants';

export const LeftConstantList = React.memo(({
  addConstant,
}) => {
  const dispatch = useDispatch();
  const constantList = useSelector((state) => state.constants.constantList);
  const currentConstant = useSelector((state) => state.constants.currentId);

  return (
    <SidebarList isAddButton title="Constant" addClick={addConstant} tooltip="Add constant">
      <Menu iconShape="square" className="p-2">
        <SidebarMenuList
          mainMenuList={constantList}
          titleKey="fileName"
          onClick={(data) => dispatch(setCurrentConstant(data))}
          initialSelectedId={currentConstant || constantList?.[0]?._id}
        />
      </Menu>
    </SidebarList>
  );
});
LeftConstantList.displayName = 'LeftConstantList';
