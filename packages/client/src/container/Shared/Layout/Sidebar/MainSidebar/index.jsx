import React from 'react';
import { Link } from 'react-router-dom';
import {
  MenuItem,
} from 'react-pro-sidebar';
import ReactTooltip from 'react-tooltip';
import { SidebarCss } from '../sidebarCss';

export const DefaultSidebar = ({
  link, tooltipID, tooltip, icon, iconActive, linkSet, iconClass, onPopupOpen, onClick,
}) => {
  const Path = window.location.pathname;
  return (
    <Link data-tip data-for={tooltipID} to={link} onClick={onPopupOpen && onClick}>
      <ReactTooltip id={tooltipID} type="dark">{tooltip}</ReactTooltip>
      <MenuItem
        className={`${SidebarCss.menulist} ${Path.split('/')[2] === linkSet && 'bg-primary-dark hover:bg-primary-dark'}`}
      >
        <div className={`w-5 h-5 m-auto ${iconClass}`}>
          {Path.split('/')[2] === linkSet ? <>{iconActive}</> : <>{icon}</>}
        </div>
        {/* <div className={`text-xs mt-2 text-center text-primary-text ${Path.split('/')[2]
         === linkSet && 'text-defaultWhite'}`}>{tooltip}</div> */}
      </MenuItem>
    </Link>
  );
};
