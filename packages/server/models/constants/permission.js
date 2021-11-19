const {
  MODULE, SERVICE, SUB_MODULE,
} = require('./common');
const ACTION = require('./action');
const METHOD = require('./method');

module.exports = [

  // Project
  {
    url: '/web/v1/project/create',
    method: METHOD.POST,
    module: MODULE.PROJECT.VALUE,
    action: ACTION.CREATE,
  },
  {
    url: '/web/v1/project/paginate',
    method: METHOD.POST,
    module: MODULE.PROJECT.VALUE,
    action: ACTION.VIEW,
  },
  {
    url: '/web/v1/project',
    method: METHOD.PUT,
    module: MODULE.PROJECT.VALUE,
    action: ACTION.UPDATE,
  },
  {
    url: '/web/v1/project',
    method: METHOD.VIEW,
    module: MODULE.PROJECT.VALUE,
    action: ACTION.VIEW,
  },
  {
    url: '/web/v1/project/destroy',
    method: METHOD.POST,
    module: MODULE.PROJECT.VALUE,
    action: ACTION.DELETE,
  },
  {
    url: '/web/v1/project/upload-logo',
    method: METHOD.POST,
    module: MODULE.PROJECT.VALUE,
    action: ACTION.CREATE,
  },

  // Application
  {
    url: '/web/v1/application/create',
    method: METHOD.POST,
    module: MODULE.APPLICATION.VALUE,
    action: ACTION.CREATE,
  },
  {
    url: '/web/v1/application/paginate',
    method: METHOD.POST,
    module: MODULE.APPLICATION.VALUE,
    action: ACTION.VIEW,
  },
  {
    url: '/web/v1/application/generate',
    method: METHOD.POST,
    module: MODULE.APPLICATION.VALUE,
    action: ACTION.BUILD,
  },
  {
    url: '/web/v1/application/structure',
    method: METHOD.POST,
    module: MODULE.APPLICATION.VALUE,
    action: ACTION.VIEW,
  },
  {
    url: '/web/v1/application/view-file',
    method: METHOD.POST,
    module: MODULE.APPLICATION.VALUE,
    action: ACTION.VIEW,
  },
  {
    url: '/web/v1/application',
    method: METHOD.PUT,
    module: MODULE.APPLICATION.VALUE,
    action: ACTION.UPDATE,
  },
  {
    url: '/web/v1/application/destroy',
    method: METHOD.POST,
    module: MODULE.APPLICATION.VALUE,
    action: ACTION.DELETE,
  },
  {
    url: '/web/v1/application/upload-folder',
    method: METHOD.POST,
    module: MODULE.APPLICATION.VALUE,
    action: ACTION.CREATE,
  },
  {
    url: '/web/v1/application/upload-logo',
    method: METHOD.POST,
    module: MODULE.APPLICATION.VALUE,
    action: ACTION.UPDATE,
  },
  {
    url: '/web/v1/application/react-command-executer',
    method: METHOD.POST,
    module: MODULE.APPLICATION.VALUE,
    action: ACTION.UPDATE,
  },

  {
    url: '/web/v1/application/download-zip',
    method: METHOD.GET,
    module: MODULE.APPLICATION.VALUE,
    action: ACTION.DOWNLOAD,
  },
  {
    url: '/web/v1/application/app-process-logs',
    method: METHOD.GET,
    module: MODULE.APPLICATION.VALUE,
    action: ACTION.VIEW,
  },
  {
    url: '/web/v1/application/html-upload-folder',
    method: METHOD.POST,
    module: MODULE.APPLICATION.VALUE,
    action: ACTION.UPDATE,
  },
  {
    url: '/web/v1/application/update-file-code',
    method: METHOD.POST,
    module: MODULE.APPLICATION.VALUE,
    action: ACTION.UPDATE,
  },
  {
    url: '/web/v1/application/view-file-input',
    method: METHOD.POST,
    module: MODULE.APPLICATION.VALUE,
    action: ACTION.VIEW,
  },
  {
    url: '/web/v1/application/update-file-input',
    method: METHOD.POST,
    module: MODULE.APPLICATION.VALUE,
    action: ACTION.UPDATE,
  },

  // Member Manage
  {
    url: '/web/v1/application/member-update',
    method: METHOD.PUT,
    module: SERVICE.MEMBER.VALUE,
    action: ACTION.UPDATE,
  },
  {
    url: '/web/v1/application/member-list',
    method: METHOD.POST,
    module: SERVICE.MEMBER.VALUE,
    action: ACTION.VIEW,
  },
  {
    url: '/web/v1/application/member-delete',
    method: METHOD.DELETE,
    module: SERVICE.MEMBER.VALUE,
    action: ACTION.DELETE,
  },
  // Invite User
  {
    url: '/web/v1/application/invite',
    method: METHOD.PUT,
    module: SUB_MODULE.COMPANY_INVITES.VALUE,
    action: ACTION.CREATE,
  },
  {
    url: '/web/v1/user/remove-invited-member',
    method: METHOD.POST,
    module: SUB_MODULE.COMPANY_INVITES.VALUE,
    action: ACTION.DELETE,
  },
  {
    url: '/web/v1/company-invites/invite-user-list',
    method: METHOD.POST,
    module: SUB_MODULE.COMPANY_INVITES.VALUE,
    action: ACTION.CREATE,
  },
  {
    url: '/web/v1/company-invites/resend-invitation',
    method: METHOD.POST,
    module: SUB_MODULE.COMPANY_INVITES.VALUE,
    action: ACTION.UPDATE,
  },
  {
    url: '/web/v1/company-invites/delete-invitation',
    method: METHOD.POST,
    module: SUB_MODULE.COMPANY_INVITES.VALUE,
    action: ACTION.DELETE,
  },
  {
    url: '/web/v1/company-invites/remove-invited-user',
    method: METHOD.PUT,
    module: SUB_MODULE.COMPANY_INVITES.VALUE,
    action: ACTION.DELETE,
  },

  // Schema
  {
    url: '/web/v1/schema/create',
    method: METHOD.POST,
    module: MODULE.APPLICATION.VALUE,
    action: ACTION.UPDATE,
  },
  {
    url: '/web/v1/schema/paginate',
    method: METHOD.POST,
    module: MODULE.APPLICATION.VALUE,
    action: ACTION.UPDATE,
  },
  {
    url: '/web/v1/schema/destroy',
    method: METHOD.POST,
    module: MODULE.APPLICATION.VALUE,
    action: ACTION.UPDATE,
  },
  {
    url: '/web/v1/schema',
    method: METHOD.PUT,
    module: MODULE.APPLICATION.VALUE,
    action: ACTION.UPDATE,
  },
  // Schema-Detail
  {
    url: '/web/v1/schema-detail/create',
    method: METHOD.POST,
    module: MODULE.APPLICATION.VALUE,
    action: ACTION.UPDATE,
  },
  {
    url: '/web/v1/schema-detail/paginate',
    method: METHOD.POST,
    module: MODULE.APPLICATION.VALUE,
    action: ACTION.UPDATE,
  },
  {
    url: '/web/v1/schema-detail/destroy',
    method: METHOD.POST,
    module: MODULE.APPLICATION.VALUE,
    action: ACTION.UPDATE,
  },
  {
    url: '/web/v1/schema-detail',
    method: METHOD.PUT,
    module: MODULE.APPLICATION.VALUE,
    action: ACTION.UPDATE,
  },
  // stared-project
  {
    url: '/web/v1/stared-project/upsert',
    method: METHOD.POST,
    module: MODULE.PROJECT.VALUE,
    action: ACTION.UPDATE,
  },
  {
    url: '/web/v1/stared-project/paginate',
    method: METHOD.POST,
    module: MODULE.PROJECT.VALUE,
    action: ACTION.VIEW,
  },
  {
    url: '/web/v1/stared-project/destroy',
    method: METHOD.POST,
    module: MODULE.PROJECT.VALUE,
    action: ACTION.DELETE,
  },
  // project-route
  {
    url: '/web/v1/project-route/create',
    method: METHOD.POST,
    module: MODULE.APPLICATION.VALUE,
    action: ACTION.UPDATE,
  },
  {
    url: '/web/v1/project-route/paginate',
    method: METHOD.POST,
    module: MODULE.APPLICATION.VALUE,
    action: ACTION.UPDATE,
  },
  {
    url: '/web/v1/project-route/destroy',
    method: METHOD.POST,
    module: MODULE.APPLICATION.VALUE,
    action: ACTION.UPDATE,
  },
  {
    url: '/web/v1/project-route',
    method: METHOD.PUT,
    module: MODULE.APPLICATION.VALUE,
    action: ACTION.UPDATE,
  },

  // project-constant
  {
    url: '/web/v1/project-constant/create',
    method: METHOD.POST,
    module: MODULE.APPLICATION.VALUE,
    action: ACTION.UPDATE,
  },
  {
    url: '/web/v1/project-constant/paginate',
    method: METHOD.POST,
    module: MODULE.APPLICATION.VALUE,
    action: ACTION.UPDATE,
  },
  {
    url: '/web/v1/project-constant/destroy',
    method: METHOD.POST,
    module: MODULE.APPLICATION.VALUE,
    action: ACTION.UPDATE,
  },
  {
    url: '/web/v1/project-constant',
    method: METHOD.PUT,
    module: MODULE.APPLICATION.VALUE,
    action: ACTION.UPDATE,
  },
  // project-cron
  {
    url: '/web/v1/project-cron/create',
    method: METHOD.POST,
    module: MODULE.APPLICATION.VALUE,
    action: ACTION.UPDATE,
  },
  {
    url: '/web/v1/project-cron/paginate',
    method: METHOD.POST,
    module: MODULE.APPLICATION.VALUE,
    action: ACTION.UPDATE,
  },
  {
    url: '/web/v1/project-cron/destroy',
    method: METHOD.POST,
    module: MODULE.APPLICATION.VALUE,
    action: ACTION.UPDATE,
  },
  {
    url: '/web/v1/project-cron',
    method: METHOD.PUT,
    module: MODULE.APPLICATION.VALUE,
    action: ACTION.UPDATE,
  },

  // project-policy
  {
    url: '/web/v1/project-policy/create',
    method: METHOD.POST,
    module: MODULE.APPLICATION.VALUE,
    action: ACTION.UPDATE,
  },
  {
    url: '/web/v1/project-policy/paginate',
    method: METHOD.POST,
    module: MODULE.APPLICATION.VALUE,
    action: ACTION.UPDATE,
  },
  {
    url: '/web/v1/project-policy/destroy',
    method: METHOD.POST,
    module: MODULE.APPLICATION.VALUE,
    action: ACTION.UPDATE,
  },
  {
    url: '/web/v1/project-policy',
    method: METHOD.PUT,
    module: MODULE.APPLICATION.VALUE,
    action: ACTION.UPDATE,
  },

  // document
  {
    url: '/web/v1/document/get-postman-collection',
    method: METHOD.POST,
    module: MODULE.APPLICATION.VALUE,
    action: ACTION.UPDATE,
  },

  // application-config
  {
    url: '/web/v1/application-config/create',
    method: METHOD.POST,
    module: MODULE.APPLICATION.VALUE,
    action: ACTION.UPDATE,
  },
  {
    url: '/web/v1/application-config/paginate',
    method: METHOD.POST,
    module: MODULE.APPLICATION.VALUE,
    action: ACTION.UPDATE,
  },
  {
    url: '/web/v1/application-config/destroy',
    method: METHOD.POST,
    module: MODULE.APPLICATION.VALUE,
    action: ACTION.UPDATE,
  },
  {
    url: '/web/v1/application-config',
    method: METHOD.PUT,
    module: MODULE.APPLICATION.VALUE,
    action: ACTION.UPDATE,
  },

  {
    url: '/web/v1/application-config',
    method: METHOD.GET,
    module: MODULE.APPLICATION.VALUE,
    action: ACTION.UPDATE,
  },

  // notification-template-tags
  {
    url: '/web/v1/notification-template-tags/create',
    method: METHOD.POST,
    module: MODULE.APPLICATION.VALUE,
    action: ACTION.UPDATE,
  },
  {
    url: '/web/v1/notification-template-tags/paginate',
    method: METHOD.POST,
    module: MODULE.APPLICATION.VALUE,
    action: ACTION.UPDATE,
  },
  {
    url: '/web/v1/notification-template-tags/destroy',
    method: METHOD.POST,
    module: MODULE.APPLICATION.VALUE,
    action: ACTION.UPDATE,
  },
  {
    url: '/web/v1/notification-template-tags',
    method: METHOD.PUT,
    module: MODULE.APPLICATION.VALUE,
    action: ACTION.UPDATE,
  },
  // notification-template
  {
    url: '/web/v1/notification-template/create',
    method: METHOD.POST,
    module: MODULE.APPLICATION.VALUE,
    action: ACTION.UPDATE,
  },
  {
    url: '/web/v1/notification-template/paginate',
    method: METHOD.POST,
    module: MODULE.APPLICATION.VALUE,
    action: ACTION.UPDATE,
  },
  {
    url: '/web/v1/notification-template/destroy',
    method: METHOD.POST,
    module: MODULE.APPLICATION.VALUE,
    action: ACTION.UPDATE,
  },
  {
    url: '/web/v1/notification-template',
    method: METHOD.PUT,
    module: MODULE.APPLICATION.VALUE,
    action: ACTION.UPDATE,
  },
  // device-action
  {
    url: '/web/v1/device-action/create',
    method: METHOD.POST,
    module: MODULE.APPLICATION.VALUE,
    action: ACTION.UPDATE,
  },
  {
    url: '/web/v1/device-action/paginate',
    method: METHOD.POST,
    module: MODULE.APPLICATION.VALUE,
    action: ACTION.UPDATE,
  },
  {
    url: '/web/v1/device-action/destroy',
    method: METHOD.POST,
    module: MODULE.APPLICATION.VALUE,
    action: ACTION.UPDATE,
  },
  {
    url: '/web/v1/device-action',
    method: METHOD.PUT,
    module: MODULE.APPLICATION.VALUE,
    action: ACTION.UPDATE,
  },
  // env-variables
  {
    url: '/web/v1/env-variables/upsert',
    method: METHOD.POST,
    module: MODULE.APPLICATION.VALUE,
    action: ACTION.UPDATE,
  },
  {
    url: '/web/v1/env-variables/details',
    method: METHOD.POST,
    module: MODULE.APPLICATION.VALUE,
    action: ACTION.UPDATE,
  },
  // app-global-headers
  {
    url: '/web/v1/app-global-headers/upsert',
    method: METHOD.POST,
    module: MODULE.APPLICATION.VALUE,
    action: ACTION.UPDATE,
  },
  {
    url: '/web/v1/app-global-headers/details',
    method: METHOD.POST,
    module: MODULE.APPLICATION.VALUE,
    action: ACTION.UPDATE,
  },

];
