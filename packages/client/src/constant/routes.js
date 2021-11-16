export const ROUTE_TYPES = [
  { name: 'POST', id: 'post' },
  { name: 'GET', id: 'get' },
  { name: 'PUT', id: 'put' },
  { name: 'DELETE', id: 'delete' },
  { name: 'PATCH', id: 'patch' },
  { name: 'HEAD', id: 'head' },
  { name: 'OPTIONS', id: 'options' },
  { name: 'PURGE', id: 'purge' },
  { name: 'LINK', id: 'link' },
  { name: 'UNLINK', id: 'unlink' },
];
export const ROUTE_GENERATE_TYPE = {
  AUTO: 1,
  MANUAL: 2,
};

export const ROUTE_HEADERS = [
  'authorization',
  'cache-control',
  'content-type',
];

export const ROUTE_VALIDATION_MESSAGE = {
  uniqResponseKey: 'Oops! Invalid response name. Duplicate response name is not allowed.',
  tabValidation: 'Oops! Some fields are left blank in the previous step. Kindly fill all required fields.',
};

export const OPERATION_TYPE = {
  post: {
    create: 'C',
    addBulk: 'BC',
    list: 'R',
  },
  get: {
    '{{id}}': 'R',
  },
  delete: {
    softDelete: 'D',
    '{{id}}': 'D',
  },
  put: {
    '{{}}': 'U',
    '{{id}}': 'U',
    updateBulk: 'BU',
  },
};
