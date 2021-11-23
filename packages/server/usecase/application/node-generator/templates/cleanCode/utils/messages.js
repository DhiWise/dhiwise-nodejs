const responseCode = require('./responseCode');

module.exports = {
  successResponse: (data = {}) => ({
    headers: data.headers || { 'Content-Type': 'application/json' },
    statusCode: data.statusCode || responseCode.success,
    data: {
      status: 'SUCCESS',
      message: data.message || 'Your request is successfully executed',
      data: data.data && Object.keys(data.data).length ? data.data : null,
    },
  }),

  failureResponse: (data = {}) => ({
    headers: data.headers || { 'Content-Type': 'application/json' },
    statusCode: data.statusCode || responseCode.internalServerError,
    data: {
      status: 'FAILURE',
      message: data.message || 'Internal server error.',
      data: data.data && Object.keys(data.data).length ? data.data : null,
    },
  }),

  badRequest: (data = {}) => ({
    headers: data.headers || { 'Content-Type': 'application/json' },
    statusCode: data.statusCode || responseCode.badRequest,
    data: {
      status: 'BAD_REQUEST',
      message: data.message || 'The request cannot be fulfilled due to bad syntax.',
      data: data.data && Object.keys(data.data).length ? data.data : null,
    },
  }),

  isDuplicate: (data = {}) => ({
    headers: data.headers || { 'Content-Type': 'application/json' },
    statusCode: data.statusCode || responseCode.validationError,
    data: {
      status: 'VALIDATION_ERROR',
      message: data.message || 'Data duplication found.',
      data: data.data && Object.keys(data.data).length ? data.data : null,
    },
  }),

  recordNotFound: (data = {}) => ({
    headers: data.headers || { 'Content-Type': 'application/json' },
    statusCode: data.statusCode || responseCode.success,
    data: {
      status: 'RECORD_NOT_FOUND',
      message: data.message || 'Record not found with specified criteria.',
      data: data.data && Object.keys(data.data).length ? data.data : null,
    },
  }),

  insufficientParameters: (data = {}) => ({
    headers: data.headers || { 'Content-Type': 'application/json' },
    statusCode: data.statusCode || responseCode.badRequest,
    data: {
      status: 'BAD_REQUEST',
      message: data.message || 'Insufficient parameters.',
      data: data.data && Object.keys(data.data).length ? data.data : null,
    },
  }),

  inValidParam: (data = {}) => ({
    headers: data.headers || { 'Content-Type': 'application/json' },
    statusCode: data.statusCode || responseCode.validationError,
    data: {
      status: 'VALIDATION_ERROR',
      message: data.message || `Invalid Data, Validation Failed.`,
      data: data.data && Object.keys(data.data).length ? data.data : null,
    },
  }),

  unAuthorizedRequest: (data = {}) => ({
    headers: data.headers || { 'Content-Type': 'application/json' },
    statusCode: data.statusCode || responseCode.unAuthorizedRequest,
    data: {
      status: 'UNAUTHORIZED',
      message: data.message || 'You are not authorized to access the request',
      data: data.data && Object.keys(data.data).length ? data.data : null,
    },
  }),

  loginSuccess: (data = {}) => ({
    headers: data.headers || { 'Content-Type': 'application/json' },
    statusCode: data.statusCode || responseCode.success,
    data: {
      status: 'SUCCESS',
      message: data.message || 'Login Successful',
      data: data.data && Object.keys(data.data).length ? data.data : null,
    },
  }),

  loginFailed: (data = {}) => ({
    headers: data.headers || { 'Content-Type': 'application/json' },
    statusCode: data.statusCode || responseCode.badRequest,
    data: {
      status: 'BAD_REQUEST',
      message: data.message || `Login Failed.`,
      data: data.data && Object.keys(data.data).length ? data.data : null,
    },
  }),

  invalidRequest: (data = {}) => ({
    headers: data.headers || { 'Content-Type': 'application/json' },
    statusCode: data.statusCode || responseCode.success,
    data: {
      status: 'FAILURE',
      message: data.message || 'Invalid Data, Validation Failed.',
      data: data.data && Object.keys(data.data).length ? data.data : null,
    },
  }),

  requestValidated: (data = {}) => ({
    headers: data.headers || { 'Content-Type': 'application/json' },
    statusCode: data.statusCode || responseCode.success,
    data: {
      status: 'SUCCESS',
      message: data.message || 'Your request is successfully executed',
      data: data.data && Object.keys(data.data).length ? data.data : null,
    },
  }),
};
