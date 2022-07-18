import React from 'react';
import { Icons } from '@dhiwise/icons';

export const stepSidebarData = {
  NodeCRUD: [
    {
      linkSet: 'crud/platform',
      link: '/node/crud/platform',
      tooltipID: 'Platform Configuration',
      iconActive: <Icons.Configuration color="#ffffff" />,
      icon: <Icons.Configuration />,
      tooltip: 'Platform Configuration',
      title: 'Platform Configuration',
      description: 'Enter information regarding platforms, type of users, and details of login access.',
    },
    {
      linkSet: 'crud/model',
      link: '/node/crud/model',
      tooltipID: 'Models',
      iconActive: <Icons.Model color="#ffffff" />,
      icon: <Icons.Model />,
      tooltip: 'Models',
      title: 'Models',
      description: 'Define models, the datatype of its attributes, and validations.',
    },
    // {
    //   linkSet: 'crud/authentication',
    //   link: '/node/crud/authentication',
    //   tooltipID: 'Authentication Setup',
    //   iconActive: <Icons.Auth color="#ffffff" />,
    //   icon: <Icons.Auth />,
    //   tooltip: 'Authentication Setup',
    //   title: 'Authentication Setup',
    //   description: 'Setup of authentication for your application.',
    //   isHideAfterBuild: true,
    // },
    {
      linkSet: 'crud/permission',
      link: '/node/crud/permission',
      tooltipID: 'Model Permission',
      iconActive: <Icons.Permission color="#ffffff" />,
      icon: <Icons.Permission />,
      tooltip: 'Model Permission',
      title: 'Model Permission',
      description: 'Setup permission for CRUD operations for each model.',
    },
    {
      linkSet: 'crud/routes',
      link: '/node/crud/routes',
      tooltipID: 'routes',
      iconActive: <Icons.Routes color="#ffffff" />,
      icon: <Icons.Routes />,
      tooltip: 'Routes',
      title: 'Routes',
      description: 'Setup of model-wise routes.',
    },
  ],
};
