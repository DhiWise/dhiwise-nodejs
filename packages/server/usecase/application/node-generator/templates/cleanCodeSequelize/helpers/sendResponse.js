const sendResponse = function (response, result) {
  return response.set(result.headers).status(result.statusCode).send(result.data);
};
module.exports = sendResponse;
