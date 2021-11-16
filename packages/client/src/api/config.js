import axios from 'axios';

export const defaultAxios = axios.create({
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
    Expires: '0',
  },
});

export function apiClient(url, data = {}, method = 'POST', header = {}, rest, options) {
  return new Promise((resolve, reject) => {
    const headers = {
      ...header,
    };

    defaultAxios({
      method,
      url,
      headers,
      data,
      ...rest,
    }).then((res) => {
      if (res?.data?.code === 'OK') {
        resolve(res?.data);
      } else if (options?.isHandleCatch) {
        resolve(res?.data);
      } else {
        let msg = res?.data?.message || res?.response?.data?.message;
        if (res?.data?.isAlert) { msg = { msg }; }
        if (res?.data?.data && options?.isHandleError) { msg = { msg, data: res?.data?.data }; }
        reject(msg);
      }
    }).catch((err) => {
      let msg = err?.response?.data?.message; // || 'Can\'t connect to server';
      if (err?.response?.data?.isAlert) { msg = { msg }; }
      if (options?.isErrorResponse) { msg = err?.response?.data; }
      reject(msg);
    });
  });
}
