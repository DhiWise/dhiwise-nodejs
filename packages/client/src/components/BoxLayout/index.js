import React from 'react';
import PropTypes from 'prop-types';
import { boxLayoutCss } from './boxLayoutCss';

export const BoxLayout = ({
  children, variant, className, style,
}) => {
  const variantClass = `${boxLayoutCss[[`box${variant}`]]}`;
  return (
    <div className={`${className} ${variantClass}`} style={style}>
      {children}
    </div>
  );
};

BoxLayout.propTypes = {
  variant: PropTypes.oneOf([
    'mainRight',
    'subSidebar',
    'subRight',
    'fullscreen',
  ]),
};
BoxLayout.defaultProps = {
  variant: 'mainRight',
};
