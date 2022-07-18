import React from 'react';
import { Icons } from '@dhiwise/icons';

export const ToggleBox = ({
  onClick, isPin, isSidebar, ClassName,
}) => (
  <div
    onClick={onClick}
    className={`w-5 h-5 absolute -top-1 border-1 border-gray-30 rounded-full flex z-10000 bg-gray-200 cursor-pointer ${
      isPin ? 'leftSet' : '-left-3'
    } ${ClassName}`}
  >
    {isSidebar && (
      <div className="w-2 h-2 m-auto ">
        <Icons.RightArrow />
      </div>
    )}
    {!isSidebar && (
      <div className="w-2 h-2 m-auto rotate-180 transform">
        <Icons.RightArrow />
      </div>
    )}
  </div>
);
