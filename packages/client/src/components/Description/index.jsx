import React from 'react';
import PropTypes from 'prop-types';
import { DescriptionCss } from './descriptionCss';

export const Description = ({
  children, className, variant, style,
}) => {
  const variantClass = `${DescriptionCss[[`desc${variant}`]]}`;
  return (
    <p className={`word-break ${DescriptionCss.decWrap} ${variantClass} ${className}`} style={style}>{children}</p>
  );
};
Description.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.oneOf(['normal', 'subTitle', 'light']),
};

Description.defaultProps = {
  className: '',
  variant: 'normal',
};
