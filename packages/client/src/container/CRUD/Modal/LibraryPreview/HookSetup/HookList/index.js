import React from 'react';
import { Menu } from 'react-pro-sidebar';
import { SidebarList } from '../../../../../Shared/Layout/Sidebar/SubSidebar';
import { SidebarMenuList } from '../../../../../../components';
import { HOOK_TAB_TITLE } from '../../../../../../constant/model';

export const HookList = React.memo(({
  hooks, setCurHook, currentApplicationCode,
}) => (
  <>
    <div className="w-56 h-full">
      <SidebarList
        style={{ width: '100%' }}
        title={(HOOK_TAB_TITLE[currentApplicationCode]?.split(' ')?.[0]) ?? 'Hook'}
        sidebarClass="xl:h-full xxl:h-full"
      >
        <Menu iconShape="square" className="px-2">
          <SidebarMenuList
            mainMenuList={hooks?.map((h, i) => ({ _id: i + 1, title: (`${h.type}-${h.operation}`) }))}
            titleKey="title"
            initialSelectedId={1}
            onClick={setCurHook}
          />
        </Menu>
      </SidebarList>
    </div>
  </>
));
HookList.displayName = 'HookList';
