const projectServiceUrl = process?.env?.REACT_APP_PROJECT_SERVICE_URL;

const version = 'web/v1';

export const API_URLS = {
  route: {
    url: `${projectServiceUrl}/${version}/project-route`,
    create: `${projectServiceUrl}/${version}/project-route/create`,
    paginate: `${projectServiceUrl}/${version}/project-route/paginate`,
    delete: `${projectServiceUrl}/${version}/project-route/destroy`,
  },
  application: {
    create: `${projectServiceUrl}/${version}/application/create`,
    generate: `${projectServiceUrl}/${version}/application/generate`,
    edit: `${projectServiceUrl}/${version}/application`,
    openVsCode: `${projectServiceUrl}/${version}/application/open-generated-code`,
    lastAppRedirect: `${projectServiceUrl}/${version}/application/last-application`,
    destroy: `${projectServiceUrl}/${version}/application/destroy`,
  },
  schema: {
    create: `${projectServiceUrl}/${version}/schema/create`,
    paginate: `${projectServiceUrl}/${version}/schema/paginate`,
    update: `${projectServiceUrl}/${version}/schema`,
    delete: `${projectServiceUrl}/${version}/schema/destroy`,
    get: `${projectServiceUrl}/${version}/schema/get`,
    multipleCreate: `${projectServiceUrl}/${version}/schema/insert-default-models`,
  },
  schemaDetail: {
    paginate: `${projectServiceUrl}/${version}/schema-detail/paginate`,
    upsert: `${projectServiceUrl}/${version}/schema-detail/upsert`,
  },
  constant: {
    url: `${projectServiceUrl}/${version}/project-constant`,
    create: `${projectServiceUrl}/${version}/project-constant/create`,
    paginate: `${projectServiceUrl}/${version}/project-constant/paginate`,
    delete: `${projectServiceUrl}/${version}/project-constant/destroy`,
  },
  policy: {
    url: `${projectServiceUrl}/${version}/project-policy`,
    create: `${projectServiceUrl}/${version}/project-policy/create`,
    paginate: `${projectServiceUrl}/${version}/project-policy/paginate`,
    delete: `${projectServiceUrl}/${version}/project-policy/destroy`,
  },
  applicationConfig: {
    url: `${projectServiceUrl}/${version}/application-config`,
    create: `${projectServiceUrl}/${version}/application-config/create`,
    paginate: `${projectServiceUrl}/${version}/application-config/paginate`,
  },
  master: {
    getByCode: `${projectServiceUrl}/${version}/master/get-by-code`,
  },
  envVariables: {
    get: `${projectServiceUrl}/${version}/env-variables/details`,
    upsert: `${projectServiceUrl}/${version}/env-variables/upsert`,
  },
  projectRoleAccess: {
    url: `${projectServiceUrl}/${version}/project-role-access`,
    upsert: `${projectServiceUrl}/${version}/project-role-access/upsert`,
    paginate: `${projectServiceUrl}/${version}/project-role-access/paginate`,
    delete: `${projectServiceUrl}/${version}/project-role-access/destroy`,
  },
};
