/**
 * messages.js
 * @description :: exports all response for APIS.
 */

const responseCode = require('./responseCode');

/**
 * description: exports response format of all APIS
 * @param {obj | Array} data : object which will returned in response.
 * @param {obj} res : response from controller method.
 * @return {obj} : response for API {status, message, data}
 */
module.exports = {
  successResponse: (data, res) => res.status(responseCode.success).json({
    status: 'SUCCESS',
    message: data.message || 'Your request is successfully executed',
    data: data.data && Object.keys(data.data).length ? data.data : null,
  }),

  failureResponse: (data, res) => res.status(responseCode.internalServerError).json({
    status: 'FAILURE',
    message: data.message || 'Internal server error.',
    data: data.data && Object.keys(data.data).length ? data.data : null,
  }),

  badRequest: (data, res) => res.status(responseCode.badRequest).json({
    status: 'BAD_REQUEST',
    message: data.message || 'The request cannot be fulfilled due to bad syntax.',
    data: data.data && Object.keys(data.data).length ? data.data : null,
  }),

  validationError: (data, res) => res.status(responseCode.validationError).json({
    status: 'VALIDATION_ERROR',
    message: data.message || `Invalid data, Validation failed.`,
    data: data.data && Object.keys(data.data).length ? data.data : null,
  }),

  isDuplicate: (data, res) => res.status(responseCode.validationError).json({
    status: 'VALIDATION_ERROR',
    message: data.message || 'Data duplication found.',
    data: data.data && Object.keys(data.data).length ? data.data : null,
  }),

  recordNotFound: (data, res) => res.status(responseCode.success).json({
    status: 'RECORD_NOT_FOUND',
    message: data.message || 'Record not found with specified criteria.',
    data: data.data && Object.keys(data.data).length ? data.data : null,
  }),

  insufficientParameters: (data, res) => res.status(responseCode.badRequest).json({
    status: 'BAD_REQUEST',
    message: data.message || 'Insufficient parameters.',
    data: data.data && Object.keys(data.data).length ? data.data : null,
  }),

  inValidParam: (data, res) => res.status(responseCode.validationError).json({
    status: 'VALIDATION_ERROR',
    message: data.message || `Invalid values in parameters`,
    data: data.data && Object.keys(data.data).length ? data.data : null,
  }),

  unAuthorizedRequest: (data, res) => res.status(responseCode.unAuthorizedRequest).json({
    status: 'UNAUTHORIZED',
    message: data.message || 'You are not authorized to access the request.',
    data: data.data && Object.keys(data.data).length ? data.data : null,
  }),

  loginSuccess: (data, res) => res.status(responseCode.success).json({
    status: 'SUCCESS',
    message: data.message || 'Login successful.',
    data: data.data && Object.keys(data.data).length ? data.data : null,
  }),

  loginFailed: (data, res) => res.status(responseCode.badRequest).json({
    status: 'BAD_REQUEST',
    message: data.message || `Login failed.`,
    data: data.data && Object.keys(data.data).length ? data.data : null,
  }),

  requestValidated: (data, res) => res.status(responseCode.success).json({
    status: 'SUCCESS',
    message: data.message || 'Your request is successfully executed.',
    data: data.data && Object.keys(data.data).length ? data.data : null,
  }),

  invalidRequest: (data, res) => res.status(responseCode.success).json({
    status: 'FAILURE',
    message: data.message || 'Invalid data, Validation failed.',
    data: data.data && Object.keys(data.data).length ? data.data : null,
  }),
};
