import { APPLICATION_CODE } from './Project/applicationStep';

export const RedirectUrl = {
  [APPLICATION_CODE.nodeExpress]: {
    platformConfig: {
      nextUrl: '/node/crud/model',
      previousUrl: '',
      backScreenUrl: '/node/dashboard',
      noDataUrl: '',
      pageUrl: '/node/crud/platform',
    },
    model: {
      nextUrl: '/node/crud/permission',
      previousUrl: '/node/crud/platform',
      backScreenUrl: '/node/dashboard',
      noDataUrl: '',
      pageUrl: '/node/crud/model',
      afterBuildNextUrl: '/node/crud/permission',
    },
    permission: {
      nextUrl: '/node/crud/routes',
      previousUrl: '/node/crud/model',
      backScreenUrl: '/node/dashboard',
      noDataUrl: '',
      pageUrl: '/node/crud/permission',
      afterBuildPreviousUrl: '/node/crud/model',
    },
    route: {
      nextUrl: '',
      previousUrl: '/node/crud/permission',
      backScreenUrl: '/node/dashboard',
      noDataUrl: '',
      pageUrl: '/node/crud/routes',
    },
  },
};

export const LAYOUT_STEP_MODULE_NAME = {
  [APPLICATION_CODE.nodeExpress]: 'NodeCRUD',
};
