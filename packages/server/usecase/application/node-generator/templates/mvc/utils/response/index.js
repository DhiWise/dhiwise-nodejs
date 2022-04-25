const responseStatus = require('./responseStatus');

module.exports = {
  success: (data = {}) => ({
    status: responseStatus.success,
    message: data.message || 'Your request is successfully executed',
    data: data.data || {},
  }),

  failure: (data = {}) => ({
    status: responseStatus.failure,
    message: data.message || 'Some error occurred while performing action.',
    data: data.data || {},
  }),

  internalServerError: (data = {}) => ({
    status: responseStatus.serverError,
    message: data.message || 'Internal server error.',
    data: data.data || {},
  }),

  badRequest: (data = {}) => ({
    status: responseStatus.badRequest,
    message: data.message || 'Request parameters are invalid or missing.',
    data: data.data || {},
  }),

  recordNotFound: (data = {}) => ({
    status: responseStatus.recordNotFound,
    message: data.message || 'Record(s) not found with specified criteria.',
    data: data.data || {},
  }),

  validationError: (data = {}) => ({
    status: responseStatus.validationError,
    message: data.message || `Invalid Data, Validation Failed.`,
    data: data.data || {},
  }),

  unAuthorized: (data = {}) => ({
    status: responseStatus.unauthorized,
    message: data.message || 'You are not authorized to access the request',
    data: data.data || {},
  }),
};
