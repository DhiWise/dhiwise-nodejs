const responseCode = require('./responseCode');

exports.successResponse = (data, res) => res.status(responseCode.success).json({
  status: 'SUCCESS',
  message: 'Your request is successfully executed',
  data,
});

exports.failureResponse = (data, res) => res.status(responseCode.internalServerError).json({
  status: 'FAILURE',
  message: 'Internal Server Error',
  data: {},
});

exports.badRequest = (data, res) => res.status(responseCode.badRequest).json({
  status: 'BAD_REQUEST',
  message: 'The request cannot be fulfilled due to bad syntax',
  data: {},
});

exports.validationError = (data, res) => res.status(responseCode.validationError).json({
  status: 'VALIDATION_ERROR',
  message: `Invalid Data, Validation Failed at ${data}`,
  data: {},
});

exports.isDuplicate = (data, res) => res.status(responseCode.validationError).json({
  status: 'VALIDATION_ERROR',
  message: 'Data Duplication Found',
  data: {},
});

exports.recordNotFound = (data, res) => res.status(responseCode.success).json({
  status: 'RECORD_NOT_FOUND',
  message: 'Record not found with specified criteria.',
  data: {},
});

exports.insufficientParameters = (res) => res.status(responseCode.badRequest).json({
  status: 'BAD_REQUEST',
  message: 'Insufficient parameters',
  data: {},
});

exports.inValidParam = (err, res) => res.status(responseCode.validationError).json({
  status: 'VALIDATION_ERROR',
  message: `Invalid values in parameters,${err}`,
  data: {},
});

exports.unAuthorizedRequest = (data, res) => res.status(responseCode.unAuthorizedRequest).json({
  status: 'UNAUTHORIZED',
  message: 'You are not authorized to access the request',
  data: {},
});

exports.loginSuccess = (data, res) => res.status(responseCode.success).json({
  status: 'SUCCESS',
  message: 'Login Successful',
  data,
});
exports.loginFailed = (data, res) => res.status(responseCode.badRequest).json({
  status: 'BAD_REQUEST',
  message: `Login Failed, ${data}`,
  data: {},
});
exports.requestValidated = (data, res) => res.status(responseCode.success).json({
  status: 'SUCCESS',
  message: data,
  data: {},
});
exports.invalidRequest = (data, res) => res.status(responseCode.success).json({
  status: 'FAILURE',
  message: data,
  data: {},
});
