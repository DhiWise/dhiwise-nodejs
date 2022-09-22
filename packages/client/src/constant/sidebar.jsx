import React from 'react';
import { Icons } from '@dhiwise/icons';

export const sidebar = {
  NODE_EXPRESS: [
    {
      key: '1',
      linkSet: 'crud/platform',
      link: '/node/crud/platform',
      tooltipID: 'crud',
      iconActive: <Icons.Model color="#ffffff" />,
      icon: <Icons.CRUD />,
      tooltip: 'CRUD',
      afterBuildLink: '/node/crud/model',
    },
    {
      key: '2',
      linkSet: 'constant',
      link: '/node/constant',
      tooltipID: 'constant',
      iconActive: <Icons.Constant color="#ffffff" />,
      icon: <Icons.Constant />,
      tooltip: 'Constant',
    },
    {
      key: '3',
      linkSet: 'role-access',
      link: '/node/role-access',
      tooltipID: 'role-access',
      iconActive: <Icons.RoleAccess color="#ffffff" />,
      icon: <Icons.RoleAccess />,
      tooltip: 'Role access',
    },
    {
      key: '4',
      linkSet: 'middleware',
      link: '/node/middleware',
      tooltipID: 'middleware',
      iconActive: <Icons.Policy color="#ffffff" />,
      icon: <Icons.Policy />,
      tooltip: 'Middleware',
    },
    {
      key: '5',
      linkSet: 'environment-variable',
      link: '/node/environment-variable',
      tooltipID: 'environment-variable',
      iconActive: <Icons.Environment color="#ffffff" />,
      icon: <Icons.Environment />,
      tooltip: 'Environment variable',
    },
    {
      key: '6',
      linkSet: 'configuration',
      link: '/node/configuration',
      tooltipID: 'configuration',
      iconActive: <Icons.Configuration color="#ffffff" />,
      icon: <Icons.Configuration />,
      tooltip: 'Configuration',
    },
  ],
};
