const ok = require('./ok');
const badRequest = require('./badRequest');
const notFound = require('./notFound');
const forbidden = require('./forbidden');
const serverError = require('./serverError');
const setResponse = require('./setResponse');
const unauthorized = require('./unauthorized');

module.exports = {
  ok,
  badRequest,
  serverError,
  notFound,
  forbidden,
  unauthorized,
  setResponse,
};
