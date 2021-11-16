/* global MESSAGE, _ */
// eslint-disable-next-line no-multi-assign ,no-undef
module.exports = unauthorized = (res, body) => {
  const used = process.memoryUsage();
  const memUsage = [];
  // eslint-disable-next-line no-restricted-syntax,guard-for-in
  for (const key in used) {
    memUsage.push(`${key} - ${(Math.round(used[key] / 1024 / 1024) * 100) / 100} MB`);
  }
  const data = body;
  body = {
    code: _.get(data, 'code', MESSAGE.UNAUTHORIZED.code),
    message: _.get(data, 'message', MESSAGE.UNAUTHORIZED.message),
    data: _.get(data, 'data', {}),
    memUsage,
  };
  return res.status(MESSAGE.UNAUTHORIZED.status).send(body);
};
