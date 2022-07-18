import React from 'react';
import { errorCss } from './errorCss';

const ErrorMsg = ({ error, className = '' }) => (
  <>
    <span className={`${errorCss.errorClass} ${className}`}>{error}</span>
  </>
);
export default ErrorMsg;
