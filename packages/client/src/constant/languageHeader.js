import React from 'react';
import { Icons } from '@dhiwise/icons';
import { APPLICATION_CODE } from './Project/applicationStep';

export const languageHeader = {
  [APPLICATION_CODE.nodeExpress]: [
    {
      key: '1',
      linkSet: 'configuration',
      link: '/node/configuration',
      tooltipID: 'configuration',
      iconActive: <Icons.Configuration color="#ffffff" />,
      icon: <Icons.Configuration />,
      tooltip: 'Configuration',
    },
    // {
    //   key: '2',
    //   linkSet: 'environment-variable',
    //   link: '/node/environment-variable',
    //   tooltipID: 'environment-variable',
    //   iconActive: <Icons.Environment color="#ffffff" />,
    //   icon: <Icons.Environment />,
    //   tooltip: 'Environment variable',
    // },
    {
      key: '3',
      linkSet: 'setting',
      link: '/node/setting',
      tooltipID: 'setting',
      iconActive: <Icons.Setting color="#ffffff" />,
      icon: <Icons.Setting />,
      tooltip: 'Setting',
    },

    {
      key: '4',
      linkSet: 'application',
      link: '/application',
      tooltipID: 'code',
      iconActive: <Icons.SourceCode color="#ffffff" />,
      icon: <Icons.SourceCode />,
      title: 'Code view',
      menuClass: 'bg-gray-codeButton',
    },
  ],
};
