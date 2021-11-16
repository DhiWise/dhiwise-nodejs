export const CONSTANT_GENERATE_TYPE = {
  AUTO: 1,
  MANUAL: 2,
};
export const NODE_DATA_TYPE = {
  NUMBER: 'number',
  STRING: 'string',
  JSON: 'json',
  ARRAY: 'array',
};
export const NODE_DATA_TYPE_OPTION = [
  {
    name: 'String',
    value: NODE_DATA_TYPE.STRING,
  },
  {
    name: 'Number',
    value: NODE_DATA_TYPE.NUMBER,
  },
  {
    name: 'Json',
    value: NODE_DATA_TYPE.JSON,
  },
  {
    name: 'Array of value',
    value: NODE_DATA_TYPE.ARRAY,
  },
];
export const nodeConstantName = /^[a-zA-Z_]+[\w0-9_]*$/;
