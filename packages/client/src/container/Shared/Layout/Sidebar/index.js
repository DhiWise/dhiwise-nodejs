import React from 'react';
import {
  ProSidebar, Menu,
} from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import '../../../../assets/css/sidebar.css';
import ScrollArea from 'react-scrollbar';
import { sidebar } from '../../../../constant/sidebar';
import { SidebarCss } from './sidebarCss';
import { DefaultSidebar } from './MainSidebar';
import { APPLICATION_CODE } from '../../../../constant/Project/applicationStep';

const Sidebar = () => {
  const menus = sidebar[APPLICATION_CODE.nodeExpress];
  return (
    <>
      <div className="theme-sidenav">
        <ProSidebar className={SidebarCss.wrap}>
          {/* <div className={SidebarCss.projectSiebar}> */}
          {/* <ChangeLanguage /> */}
          {/* </div> */}
          <ScrollArea
            speed={0.8}
            className="area h-full"
            contentClassName="content"
            smoothScrolling
          >
            <Menu iconShape="square">
              {menus.map((d) => (
                <DefaultSidebar
                  linkSet={d.linkSet}
                    // after build different url redirect
                  link={d.link}
                  tooltipID={d.tooltipID}
                  iconActive={d.iconActive}
                  icon={d.icon}
                  tooltip={d.tooltip}
                  key={d.tooltipID}
                  onPopupOpen={d.onPopupOpen}
                />
              ))}
            </Menu>
          </ScrollArea>

        </ProSidebar>
      </div>
    </>
  );
};
export default Sidebar;
