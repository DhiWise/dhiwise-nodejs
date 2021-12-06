const sendResponse = (response, result) => response.set(result.headers).status(result.statusCode).send(result.data);
module.exports = sendResponse;
