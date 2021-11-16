import React from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
import { iconBoxCss } from './iconBoxCss';

export const IconBox = ({
  icon, tooltip, variant, disabled, size, shape, className, onClick, iconClass, tooltipPlace,
}) => {
  const variantClass = `${iconBoxCss[[`box${variant}`]]}`;
  const sizeCss = `${iconBoxCss[[`box${size}`]]}`;
  const shapeClass = `${iconBoxCss[[`box${shape}`]]}`;
  const disableClass = disabled ? `${iconBoxCss.boxdisabled}` : '';
  return (
    <button
      onClick={!disabled ? onClick : undefined}
      className={`${iconBoxCss.boxicon} ${variantClass} ${sizeCss} ${shapeClass} ${disableClass} ${className}
      ${variant === 'outline' && 'iconGroup'}`}
      data-tip
      data-for={tooltip}
    >
      {!!icon && (
        <div className={`${iconClass} ${size === 'small' ? iconBoxCss.boxImgiconSmall : iconBoxCss.boxImgicon}
      ${size === 'medium' && iconBoxCss.boxImgiconMedium} ${size === 'extraSmall' && iconBoxCss.boxImgiconExtraSmall}`}
        >
          {icon}
        </div>
      )}
      {!!tooltip && <ReactTooltip place={tooltipPlace || 'bottom'} id={tooltip} type="dark"><div className="max-w-48 text-center whitespace-normal">{tooltip}</div></ReactTooltip>}
    </button>
  );
};
IconBox.propTypes = {
  variant: PropTypes.oneOf([
    'primary',
    'outline',
    'ghost',
    'dashed',
    'secondary',
    'sucess',
    'sucess_outine',
    'danger',
    'danger_outinemedium',
  ]),
  /**
     * Shape of button
     */
  shape: PropTypes.oneOf(['square', 'rounded', 'roundedFull']),
  /**
     * Additional Icon
     */
  icon: PropTypes.objectOf(PropTypes.any),
  /**
     * Additional icon true false
     */
  size: PropTypes.oneOf(['extraSmall', 'small', 'smallmedium', 'medium', 'normal']),
  /**
     * is Button disabled
     */
  disabled: PropTypes.bool,
  /**
     * Additional classname
     */
  className: PropTypes.string,
};

IconBox.defaultProps = {
  variant: 'primary',
  icon: null,
  size: 'normal',
  // iconSize: 'normal',
  className: '',
  disabled: false,
  shape: 'rounded',
};
