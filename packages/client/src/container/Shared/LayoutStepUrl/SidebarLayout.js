import React from 'react';
import { Link } from 'react-router-dom';
import {
  MenuItem,
} from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import '../../../assets/css/sidebar.css';
import ReactTooltip from 'react-tooltip';
// import { SidebarCss } from '../Layout/Sidebar/sidebarCss';
import { SidebarMenuListCss } from '../../../components/SidebarMenuList/sidebarMenuListCss';
// linkSet = pass compare more than 2nd index ex.node/crud/model

// when toggle layout is small show icon
export const SmallToggleLayout = ({
  link,
  linkSet, // link path which to compare with url
  tooltipID,
  tooltip,
  icon,
  iconActive,
  iconClass,
}) => {
  const Path = window.location.pathname;
  return (
    <Link data-tip data-for={tooltipID} to={link}>
      <ReactTooltip id={tooltipID} effect="solid">{tooltip}</ReactTooltip>
      <MenuItem
        className={`px-1 py-3.5 list-none ${Path.slice(Path.indexOf(linkSet)) === linkSet && 'bg-primary-dark hover:bg-primary-dark'}`}
      >
        <div className={`w-5 h-5 m-auto ${iconClass}`}>
          {Path.slice(Path.indexOf(linkSet)) === linkSet ? <>{iconActive}</> : <>{icon}</>}
        </div>
      </MenuItem>
    </Link>
  );
};

// sidebar with title and description
export const BigToggleLayout = ({
  link, // redirect link
  linkSet, // link path which to compare with url
  title = '',
  description = '',
}) => {
  const Path = window.location.pathname;
  return (
    <Link data-tip to={link}>
      <MenuItem
        className={`${SidebarMenuListCss.menuList}  ${Path.slice(Path.indexOf(linkSet)) === linkSet && SidebarMenuListCss.menuActive}`}
      >
        <div className="flex items-center justify-between w-full">
          <span className={`${Path.slice(Path.indexOf(linkSet)) === linkSet && 'text-defaultWhite'} text-sm leading-5 truncate text-primary-text`}>
            {title}
          </span>
        </div>
        <div className={`${Path.slice(Path.indexOf(linkSet)) === linkSet && 'text-defaultWhite'} text-xxs mt-1 leading-4 text-primary-text`}>
          {description}
        </div>
      </MenuItem>
    </Link>

  );
};
