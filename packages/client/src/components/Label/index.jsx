import React from 'react';

export const LabelBox = ({ children, className }) => (
  <label className={`mb-2 text-primary-text text-sm block w-full font-normal leading-5 ${className}`}>{children}</label>
);
