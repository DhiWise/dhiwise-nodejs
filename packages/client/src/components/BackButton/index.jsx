import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Icons } from '@dhiwise/icons';

export const BackButton = ({ title = 'Back', link, onClick }) => (
  <>
    {onClick
      ? (
        <div className="flex items-center cursor-pointer" onClick={onClick}>
          <div className="w-2.5 h-2.5 mr-2">
            <Icons.LeftDouble />
          </div>
          <span className="text-primary-text text-sm">{title}</span>
        </div>
      )
      : (
        <Link to={link} className="flex items-center" onClick={onClick}>
          <div className="w-2.5 h-2.5 mr-2">
            <Icons.LeftDouble />
          </div>
          <span className="text-primary-text text-sm">{title}</span>
        </Link>
      )}
  </>
);

BackButton.propTypes = {

  // Display text for the back button
  title: PropTypes.string,

  // Route to go to, on onClick of button
  link: PropTypes.string,
};
