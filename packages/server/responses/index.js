const {
  ok, badRequest, serverError, forbidden, notFound, setResponse, unauthorized,
} = require('../models/responses');

module.exports = {
  ok,
  badRequest,
  serverError,
  notFound,
  forbidden,
  unauthorized,
  setResponse,
};
