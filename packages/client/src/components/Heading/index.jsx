import React from 'react';
import PropTypes from 'prop-types';
import { HeadingCss } from './headingCss';

export const Heading = ({ className, children, variant }) => {
  const variantClass = `${HeadingCss[[`title${variant}`]]}`;
  return <h2 className={`${HeadingCss.pageTitle} ${variantClass} ${className}`}>{children}</h2>;
};
Heading.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.oneOf(['small', 'normal', 'h3', 'h4', 'h1', 'h2', 'h5', 'h6', 'h2Light', 'h3Light', 'h4Light', 'h5ight', 'h6Light']),
};

Heading.defaultProps = {
  className: '',
  variant: 'normal',
};
