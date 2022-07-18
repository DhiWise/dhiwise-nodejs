import React from 'react';
import PropTypes from 'prop-types';

export const ContainerBox = ({
  className,
  children,
}) => (
  <div className={`contatinerBox sm:w-full mx-auto p-5 ${className}`}>
    {children}
  </div>
);

ContainerBox.propTypes = {
  /**
     * Additional classname
     */
  className: PropTypes.string,
};

ContainerBox.defaultProps = {
  className: '',
};
