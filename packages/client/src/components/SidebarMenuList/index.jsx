/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import { MenuItem } from 'react-pro-sidebar';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Icons } from '@dhiwise/icons';
import { SidebarMenuListCss } from './sidebarMenuListCss';

export const SidebarMenuList = React.memo(({
  title = '',
  isSubMenu = false,
  subMenuList = [],
  subTitle = '',
  onClick = () => { },
  mainMenuList = [],
  titleKey = '',
  initialSelectedId = '',
  Icon,
  IconActive,
  onIconClick,
  IconError,
}) => {
  const [isMenu, setIsMenu] = useState(false);
  const menuSelect = () => {
    setIsMenu(!isMenu);
  };
  const Path = window.location.pathname;
  const [mainMenuId, setMainMenuId] = useState(false);

  const handelMainMenu = React.useCallback((menuSelectedId) => {
    setMainMenuId(menuSelectedId);
    onClick(menuSelectedId);
  }, []);

  React.useEffect(() => {
    setMainMenuId(initialSelectedId);
  }, [initialSelectedId]);

  return (
    <>
      {/* //TODO:subMenu dynamic set */}
      {isSubMenu ? (
        <div className={SidebarMenuListCss.sidebarMenu}>
          {subTitle && <div className="px-3 py-2">{subTitle}</div>}
          {subMenuList?.map((d) => (
            <Link
              key={d?._id || d.title}
              className={`${title && 'mx-3'} block`}
              to={d.link}
              onClick={onClick}
            >
              <MenuItem
                // key={key}
                onClick={menuSelect}
                className={`${SidebarMenuListCss.subMenuList} ${Path === d.link && SidebarMenuListCss.menuActive
                }`}
              >
                <div className="flex flex-wrap items-center">
                  <div className="w-4 h-4 mr-2">
                    {Path === d.link ? <Icons.ListMenu color="#ffffff" /> : <Icons.ListMenu />}
                  </div>
                  <span
                    className={`${Path === d.link && 'text-defaultWhite'
                    } text-primary-text`}
                  >
                    {d.Subtitle}
                  </span>
                </div>
              </MenuItem>
            </Link>
          ))}
        </div>
      ) : (

        mainMenuList?.map((menu) => (
          <MenuItem
            key={`menu${menu?._id}`}
            onClick={() => handelMainMenu(menu?._id)}
            className={`${SidebarMenuListCss.menuList}  ${mainMenuId === menu._id && menu.isErr ? 'bg-secondary-red border-secondary-red' : ''}  ${mainMenuId === menu._id && SidebarMenuListCss.menuActive}`}
          >
            <div className="flex items-center justify-between w-full">
              <span className={`${menu.isErr ? 'text-secondary-red' : ''} ${mainMenuId === menu._id && 'text-defaultWhite'} text-sm leading-5 truncate text-primary-text`}>
                {menu[titleKey] ?? '-'}
              </span>
              {menu.total
              && (
                <span className={`text-sm text-primary-text ${mainMenuId === menu._id && 'text-defaultWhite'}`}>
                  {menu?.total}
                </span>
              )}
              {Icon && menu.code
                && <div className="mr-2 w-3 h-3" onClick={() => onIconClick?.(menu)}>{mainMenuId === menu?._id ? IconActive : menu.isErr ? IconError : Icon}</div>}
            </div>
          </MenuItem>
        )))}
    </>
  );
});

SidebarMenuList.propTypes = {
  /** * link redirect to use */
  // key: PropTypes.string,
  /** * Optional click handler */
  onClick: PropTypes.func,
  /** * manuclassname be? */
  title: PropTypes.string,
  /** * Profile tru false */
  isSubMenu: PropTypes.bool,
  /** * icon true false */
  subTitle: PropTypes.string,
  /** * Main Menu list of array when isSubMenu false */
  // eslint-disable-next-line react/forbid-prop-types
  mainMenuList: PropTypes.array,
  /** * title key passed key which used to shown in title */
  titleKey: PropTypes.string,
  /** * used to pass Initial selected Id */
  initialSelectedId: PropTypes.string,
};
SidebarMenuList.displayName = 'SidebarMenuList';
