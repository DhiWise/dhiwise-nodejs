// eslint-disable-next-line no-multi-assign
const messages = module.exports = {};
messages.successResponse = (headers, statusCode, data) => ({
  headers,
  statusCode,
  data: {
    status: 'SUCCESS',
    message: 'Your request is successfully executed',
    data,
  },
});
messages.failureResponse = (headers, statusCode) => ({
  headers,
  statusCode,
  data: {
    status: 'FAILURE',
    message: 'Internal Server Error',
    data: {},
  },
});
messages.badRequest = (headers, statusCode) => ({
  headers,
  statusCode,
  data: {
    status: 'BAD_REQUEST',
    message: 'The request cannot be fulfilled due to bad syntax',
    data: {},
  },
});

messages.isDuplicate = (headers, statusCode) => ({
  headers,
  statusCode,
  data: {
    status: 'VALIDATION_ERROR',
    message: 'Data duplication Found',
    data: {},
  },
});
messages.recordNotFound = (headers, statusCode) => ({
  headers,
  statusCode,
  data: {
    status: 'RECORD_NOT_FOUND',
    message: 'Record not found with specified criteria.',
    data: {},
  },
});
messages.insufficientParameters = (headers, statusCode) => ({
  headers,
  statusCode,
  data: {
    status: 'BAD_REQUEST',
    message: 'Insufficient parameters',
    data: {},
  },
});

messages.inValidParam = (headers, statusCode, error) => ({
  headers,
  statusCode,
  data: {
    status: 'VALIDATION_ERROR',
    message: error,
    data: {},
  },
});

messages.unAuthorizedRequest = (headers, statusCode) => ({
  headers,
  statusCode,
  data: {
    status: 'UNAUTHORIZED',
    message: 'You are not authorized to access the request',
    data: {},
  },
});

messages.loginSuccess = (headers, statusCode, data) => ({
  headers,
  statusCode,
  data: {
    status: 'SUCCESS',
    message: 'Login Successful',
    data,
  },
});
messages.loginFailed = (headers, statusCode, error) => ({
  headers,
  statusCode,
  data: {
    status: 'BAD_REQUEST',
    message: `Login Failed, ${error}`,
    data: {},
  },
});
messages.invalidRequest = (headers, statusCode, data) => ({
  headers,
  statusCode,
  data: {
    status: 'FAILURE',
    message: data,
    data: {},
  },
});
messages.requestValidated = (headers, statusCode, data) => ({
  headers,
  statusCode,
  data: {
    status: 'SUCCESS',
    message: data,
    data: {},
  },
});
