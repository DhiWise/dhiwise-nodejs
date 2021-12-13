/**
 * responseHandler.js
 * @description :: exports all handlers for response format.
 */

const message = require('./messages');

/**
 *
 * @param {obj} req : request
 * @param {obj} res : response
 * @param {*} next : executes the middleware succeeding the current middleware.
 */
const responseHandler = (req, res, next) => {
  res.ok = (data = {}) => {
    message.successResponse(data, res);
  };
  res.badRequest = (data = {}) => {
    message.badRequest(data, res);
  };
  res.failureResponse = (data = {}) => {
    message.failureResponse(data, res);
  };
  res.inValidParam = (data = {}) => {
    message.inValidParam(data, res);
  };
  res.insufficientParameters = (data = {}) => {
    message.insufficientParameters(data, res);
  };
  res.invalidRequest = (data = {}) => {
    message.invalidRequest(data, res);
  };
  res.requestValidated = (data = {}) => {
    message.requestValidated(data, res);
  };
  res.isDuplicate = (data = {}) => {
    message.isDuplicate(data, res);
  };
  res.loginSuccess = (data = {}) => {
    message.loginSuccess(data, res);
  };
  res.loginFailed = (data = {}) => {
    message.loginFailed(data, res);
  };
  res.unAuthorizedRequest = (data = {}) => {
    message.unAuthorizedRequest(data, res);
  };
  res.validationError = (data = {}) => {
    message.validationError(data, res);
  };
  res.recordNotFound = (data = {}) => {
    message.recordNotFound(data, res);
  };
  next();
};

module.exports = responseHandler;
