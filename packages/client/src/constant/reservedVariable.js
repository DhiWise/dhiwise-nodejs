import { APPLICATION_CODE } from './Project/applicationStep';

export const RESERVED_VALIDATION_MESSAGE = 'Oops! You cannot add reserved keyword as a key name.';
export const RESERVED_VARIABLES = {
  COMMON: [
    'break', 'catch', 'class', 'const', 'do',
    'else', 'enum', 'true', 'false', 'finally',
    'for', 'if', 'import', 'in', 'interface',
    'null', 'package', 'private', 'protected', 'public',
    'return', 'super', 'this', 'throw', 'try',
    'typeof', 'var', 'while',
  ],
  [APPLICATION_CODE.nodeExpress]: {
    NODE_EXPRESS: [
      'abstract', 'arguments', 'await', 'boolean', 'byte',
      'case', 'char', 'continue', 'debugger', 'default',
      'delete', 'double', 'eval', 'export', 'extends',
      'final', 'float', 'function', 'goto', 'implements',
      'instanceof', 'int', 'let', 'long', 'native',
      'new', 'short', 'static', 'switch', 'synchronized',
      'throws', 'transient', 'void', 'volatile', 'with', 'yield',
    ],
  },
};
