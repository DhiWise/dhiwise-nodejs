import React from 'react';
import { Link } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import { MenulistCss } from './menuListCss';

export const MenuBox = ({
  link,
  menuClass,
  onClick,
  icon,
  textCss,
  title,
  iconClass,
  tooltip = false,
}) => (
  <div
    data-tip
    data-for={`tooltip${tooltip}`}
    className={`${MenulistCss.menuItem} ${!link && MenulistCss.menuSpace} ${menuClass} ${onClick && 'cursor-pointer'}`}
    onClick={onClick && onClick}
  >
    {!!icon && (
      <div className={`w-4 h-4 ${iconClass}`}>
        {icon}
        {!!tooltip && (
        <ReactTooltip id={`tooltip${tooltip}`} type="dark">
          {tooltip}
        </ReactTooltip>
        )}
      </div>
    )}
    {link ? (
      <Link
        to={link}
        className={MenulistCss.menuListLink}

      >
        {!!title && (
        <span className={`text-primary-text text-sm whitespace-nowrap overflow-hidden overflow-ellipsis block ${icon && 'ml-2'} ${textCss}`}>
          {title}
        </span>
        )}

      </Link>
    )
      : (
        <div>
          {!!title && (
          <span className={`text-primary-text text-sm whitespace-nowrap overflow-hidden overflow-ellipsis block ${icon && 'ml-2'} ${textCss}`}>
            {title}
          </span>
          )}

        </div>
      )}

  </div>
);
