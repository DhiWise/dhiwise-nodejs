import React from 'react';
import ScrollArea from 'react-scrollbar';
import {
  ProSidebar,
} from 'react-pro-sidebar';
// import ReactTooltip from 'react-tooltip';
import { Icons } from '@dhiwise/icons';
import { SidebarListCss } from './SidebarlistCss';
import { BoxLayout, IconBox } from '../../../../../components';

export const SidebarList = React.memo(({
  Scroll = false, children, style, isAddButton, tooltip, addClick, sidebarWrap, title, Pin, toggle, IconFill, sidebarClass, PinActive, icon, IconClick, Icontooltip, IconVariant = 'primary',
  isAddButtonDisabled = false,
}) => (
  <BoxLayout variant="subSidebar" style={style} className={sidebarClass}>
    <ProSidebar className={`${SidebarListCss.sidebar} ${sidebarWrap} sidebar-list`}>
      {!!title && (
      <div className="sideTop flex justify-between p-3 items-center border-b-1 border-gray-100 relative">
        <div className="text-primary-text text-base font-semibold">{title}</div>
        <div className="flex">
          {Pin && (
          <IconBox
            variant="outline"
            size="small"
            tooltip={PinActive ? 'Pin the navigator' : 'Pin the navigator'}
            className="mr-3"
            onClick={toggle}
            icon={PinActive ? <><Icons.PinFill /></>
              : <><Icons.PinOutline /></>}
          />
          )}
          {icon
          && <IconBox size="small" variant={IconVariant} className={isAddButton && 'mr-1'} tooltip={Icontooltip} icon={icon} onClick={IconClick} />}
          {isAddButton
          && (
            <IconBox disabled={isAddButtonDisabled} size="small" variant="primary" tooltip={tooltip} icon={IconFill || <Icons.Plus color="#fff" />} onClick={addClick} />
          )}
        </div>
      </div>
      )}
      {Scroll ? <>{ children }</> : (
        <ScrollArea
          speed={0.8}
          className="area h-full justify-between"
          contentClassName="w-full"
          smoothScrolling
        >
          {children}
        </ScrollArea>
      )}
    </ProSidebar>
  </BoxLayout>
));
SidebarList.displayName = 'SidebarList';
