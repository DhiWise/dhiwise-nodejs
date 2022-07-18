/* eslint-disable react/jsx-props-no-spreading */
import { Icons } from '@dhiwise/icons';
import React from 'react';
import { useHistory } from 'react-router';
import {
  Button, CardView, Description, Heading,
} from '../../../components';
import { RedirectUrl } from '../../../constant/Nodecrud';
import { APPLICATION_CODE } from '../../../constant/Project/applicationStep';

const NodeDashboard = [{
  title: 'Models',
  description: 'Create or upload your model data.',
  pageUrl: RedirectUrl[APPLICATION_CODE.nodeExpress].model.pageUrl,
  pageButtonName: 'Create model',
  icon: <Icons.Model />,
  isSetHistory: true,
  countMapKey: 'schemas',

}, {
  title: 'Authentication',
  description: 'Configure authentication module.',
  pageUrl: '/node/configuration',
  pageButtonName: 'Authentication',
  icon: <Icons.Authentication />,
  countMapKey: 'authentication',

},
{
  title: 'Routes',
  description: 'Add and customize your model(s) route.',
  pageUrl: RedirectUrl[APPLICATION_CODE.nodeExpress].route.pageUrl,
  pageButtonName: 'Create routes',
  icon: <Icons.Routes />,
  countMapKey: 'routes',

},
{
  title: 'Platform Configuration',
  description: 'Configure platform access.',
  pageUrl: RedirectUrl[APPLICATION_CODE.nodeExpress].platformConfig.pageUrl,
  pageButtonName: ' Set configuration',
  icon: <Icons.Configuration />,
  countMapKey: 'configuration',

},
{
  title: 'Role access permission',
  description: 'Configure role based access for model(s).',
  pageUrl: '/node/role-access',
  pageButtonName: 'Set role',
  icon: <Icons.RoleAccess />,
  countMapKey: 'role_access_permission',

}];

const MenuShortCutItem = ({
  title, description, pageButtonName, icon, pageUrl, isSetHistory = false,
}) => {
  const history = useHistory();
  return (
    <CardView variantHover="default" leftCard className="bg-gray-300 hover:bg-gray-300 cursor-text sm:border-1 relative">
      <div className="flex items-center mb-2">
        <div className="w-5 h-5 mr-3">
          {icon}
        </div>
        <Heading variant="h5">
          {title}
        </Heading>
      </div>
      <Description className="text-left">
        {description}
      </Description>
      <div className="flex items-center mt-3 flex-wrap">
        <Button
          size="smallMedium"
          shape="rounded"
          variant="primary"
          className="mr-2 mt-2"
          onClick={() => {
            history.push(pageUrl, isSetHistory ? { isOpenPopup: true } : undefined);
          }}
        >
          {pageButtonName}
        </Button>
      </div>
    </CardView>
  );
};

export const MenuShortCut = () => (
  <div>
    <Heading variant="h4">Core features</Heading>
    <div className="grid grid-cols-3 xxl:grid-cols-4 gap-5 mt-5">
      {NodeDashboard.map((dashboard) => (
        <MenuShortCutItem key={dashboard.title} {...dashboard} />
      ))}
    </div>

  </div>
);
