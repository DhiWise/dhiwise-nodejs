import React from 'react';
import { Menu } from 'react-pro-sidebar';
import { Icons } from '@dhiwise/icons';
import { SidebarList } from '../../../Shared/Layout/Sidebar/SubSidebar';
import { SidebarMenuList } from '../../../../components';
import { HOOK_TAB_TITLE } from '../../../../constant/model';

export const HookList = React.memo(({
  hooks, onAddHook, setCurrentHook, currentHook, currentApplicationCode,
  // isHideAdd,
}) => {
  // const [hook, setHook] = React.useState();
  const [hookId, setHookId] = React.useState();

  React.useMemo(() => {
    if (hooks?.length <= 0 || !hookId) return;
    const h = hooks.find((x) => x._id === hookId);
    setCurrentHook(h);
  }, [hookId, hooks]);

  return (
    <>
      <div className="w-56 h-full">
        <SidebarList
          style={{ width: '100%' }}
          sidebarClass="xl:h-full xxl:h-full"
          // isAddButton={!isHideAdd}
          title={(HOOK_TAB_TITLE[currentApplicationCode]?.split(' ')?.[0]) ?? 'Hook'}
          addClick={onAddHook}
          tooltip="Add hook"
        >
          <Menu iconShape="square" className="px-2">
            <SidebarMenuList
              mainMenuList={hooks || []}
              titleKey="hookType"
              initialSelectedId={currentHook?._id}
              // initialSelectedId={hooks?.[0]?._id}
              onClick={setHookId}
              Icon={<Icons.Check />}
              IconError={<Icons.Check color="#FF340D" />}
              IconActive={<Icons.Check color="#fff" />}
              // onIconClick={setHook}
            />
          </Menu>
        </SidebarList>
      </div>
      {/* {!!hook
        && (
          <ConfirmationAlert
            isOpen={!!hook}
            description="do you want to delete this hook?"
            handleSubmit={() => {
              onDelete(hook);
              setHook();
            }}
            handleClose={() => setHook()}
          />
        )} */}
    </>
  );
});
HookList.displayName = 'HookList';
