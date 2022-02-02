const responseCode = require('./responseCode');

module.exports = (res, body = {}) => {
  const headers = body.headers || { 'Content-Type': 'application/json' };
  let statusCode;

  switch (body.status) {
  case 'SUCCESS':
    statusCode = body.statusCode || responseCode.success;
    break;
  case 'FAILURE':
    statusCode = body.statusCode || responseCode.success;
    break;
  case 'SERVER_ERROR':
    statusCode = body.statusCode || responseCode.internalServerError;
    break;
  case 'BAD_REQUEST':
    statusCode = body.statusCode || responseCode.badRequest;
    break;
  case 'RECORD_NOT_FOUND':
    statusCode = body.statusCode || responseCode.success;
    break;
  case 'VALIDATION_ERROR':
    statusCode = body.statusCode || responseCode.validationError;
    break;
  case 'UNAUTHORIZED':
    statusCode = body.statusCode || responseCode.unAuthorized;
    break;
  default:
    statusCode = responseCode.internalServerError;
  }
  return res.set(headers).status(statusCode).send(body);
};
