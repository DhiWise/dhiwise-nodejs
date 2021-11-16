export const ENV = {
  DEVELOPMENT: 'DEVELOPMENT',
  QA: 'QA',
  PRODUCTION: 'PRODUCTION',
};

export const TYPE_OPTIONS = (type) => (type ? Object.keys(type).map((x) => ({ id: type[x], name: x })) : []);
