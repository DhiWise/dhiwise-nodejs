import React from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
import { iconBoxCss } from './iconBoxCss';

export const DeleteIcon = ({
  icon, tooltip, disabled, size, className, onClick,
}) => {
  const sizeCss = `${iconBoxCss[[`Icon${size}`]]}`;
  const disableClass = disabled ? `${iconBoxCss.boxdisabled}` : '';
  return (
    <div
      onClick={disabled ? null : onClick}
      className={`${sizeCss} ${className} cursor-pointer`}
      data-tip
      data-for={tooltip}
    >
      <span className={`${disableClass} block`}>{ icon }</span>
      {!!tooltip && <ReactTooltip place="bottom" id={tooltip} type="dark">{tooltip}</ReactTooltip>}
    </div>
  );
};
DeleteIcon.propTypes = {
  /**
     * Additional Icon
     */
  icon: PropTypes.string,
  /**
     * Additional icon true false
     */
  size: PropTypes.oneOf(['small', 'normal']),
  /**
     * is Button disabled
     */
  disabled: PropTypes.bool,
  /**
     * Additional classname
     */
  className: PropTypes.string,
};

DeleteIcon.defaultProps = {
  icon: null,
  size: 'normal',
  // iconSize: 'normal',
  className: '',
  disabled: false,
};
