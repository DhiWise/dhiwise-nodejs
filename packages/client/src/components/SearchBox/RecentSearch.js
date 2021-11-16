import React from 'react';
import { Icons } from '@dhiwise/icons';
import { DropdownMenu, MenuItem } from '../DropdownMenu';

const SearchBoxCss = {
  recentcss: 'w-4 h-4 cursor-pointer',
  recentimg: 'w-full h-full',
};
export const RecentSearch = () => (
  <DropdownMenu
    position="left"
    dropdownMenu="absolute w-4 h-4 left-6"
    placeholder={() => (
      <div className={SearchBoxCss.recentimg}>
        <Icons.RecentSearch />
      </div>
    )}
    className={SearchBoxCss.recentcss}
    triggerType="component"
    trigger="recenet"
    title="Recent Search"
  >
    <MenuItem text="# Files" location="/" />
    <MenuItem text="React project" location="/" />
    <MenuItem text="Node.js project" location="/" />
  </DropdownMenu>
);
