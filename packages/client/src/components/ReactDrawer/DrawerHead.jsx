import React from 'react';
import { Heading } from '../Heading';

export const DrawerHead = ({ children, title, className }) => (
  <div className={`px-5 pr-16 py-3 border-b border-gray-100 sidebarTop ${className}`}>
    <Heading variant="h4">{title}</Heading>
    {children}
  </div>
);
