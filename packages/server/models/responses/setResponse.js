/* eslint-disable guard-for-in */
/* global  _ */
const { OK } = require('../constants/message').MESSAGE;

module.exports = async (res, body) => {
  // Memory Usage
  body = {
    code: _.get(body, 'code', OK.code),
    message: _.get(body, 'message', OK.message),
    data: _.get(body, 'data', null),
    otherData: _.get(body, 'otherData', {}),
    status: _.get(body, 'status', OK.status),
  };

  let { status } = OK;
  if (body.status) {
    status = body.status;
  }
  return res.status(status).send(body);
};
