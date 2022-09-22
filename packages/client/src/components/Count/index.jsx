import React from 'react';

export const Count = ({ total, className }) => (
  <div className={`bg-gray-100 flex items-center justify-center px-1.5 py-1 ml-2 text-xxs rounded-full ${className}`}>
    {total}
  </div>
);
