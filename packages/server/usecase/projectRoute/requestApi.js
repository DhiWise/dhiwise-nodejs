/* global MESSAGE */
const axios = require('axios');
const { projectRouteRequestApiValidation } = require('../util/validation/projectRoute');

/**
 * Function used for create new user.
 * @return json
 */
const requestApi = () => async ({ params }) => {
  try {
    // Validate Request
    const {
      value, error,
    } = projectRouteRequestApiValidation(params);
    if (error) {
      return {
        data: null,
        code: MESSAGE.BAD_REQUEST.code,
        message: error,
      };
    }
    params = value;

    const {
      method, url,
    } = params;
    const headers = params?.headers;
    const data = params?.body;

    const options = {
      method,
      url,
      data,
      headers,
    };
    const response = await axios(options);

    return {
      ...MESSAGE.OK,
      data: response?.data,
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    // console.log('error', err);

    let message = 'Could not get any response. Ensure that the backend is working properly.';
    if (err?.code === 'ENOTFOUND') {
      message = 'Can not send requests to given address. Make sure address is publicly accessible.';
    } else if (err?.code === 'ECONNABORTED') {
      message = 'Could not get any response. Ensure that the backend is working properly.';
    } else if (err?.code === 'ECONNREFUSED') {
      if (err?.config?.url?.includes('http://localhost', 0) || err?.config?.url?.includes('https://localhost', 0)) {
        message = 'Unable to access your localhost.';
      } else if (/(\b25[0-5]|\b2[0-4][0-9]|\b[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}/.test(err?.address)) {
        message = 'Unable to access IP address.';
      }
    } else if (err?.config?.url?.includes('http://localhost', 0) || err?.config?.url?.includes('https://localhost', 0)) {
      message = 'Unable to access your localhost.';
    } else {
      return {
        ...MESSAGE.OK,
        data: err?.response?.data,
      };
    }

    return {
      ...MESSAGE.BAD_REQUEST,
      message,
    };
  }
};

module.exports = requestApi;
