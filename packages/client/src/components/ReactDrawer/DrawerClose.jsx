import { Icons } from '@dhiwise/icons';
import React from 'react';
import { IconBox } from '../IconBox';

export const DrawerClose = ({ onClick }) => (
  <IconBox variant="ghost" className="absolute right-0 top-4" onClick={onClick} icon={<Icons.Close />} />
);
