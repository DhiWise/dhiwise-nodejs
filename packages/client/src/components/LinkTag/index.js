import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

export const LinkTag = ({
  onClick, link, className, children, whiteText,
}) => (
  link
    ? <Link to={link} onClick={onClick} className={`hover:underline ${whiteText ? ' text-primary-text' : 'text-primary-dark'} ${className}`}>{children}</Link>
    : <span onClick={onClick} className={`cursor-pointer hover:underline ${whiteText ? 'text-primary-text' : 'text-primary-dark'} hover:underline ${className}`}>{children}</span>
);
LinkTag.propTypes = {
  /**
     * Additional class name
     */
  className: PropTypes.string,
  link: PropTypes.string,
  onClick: PropTypes.func,
};

LinkTag.defaultProps = {
  className: '',
};
