export const encryptStorage = {
  set: (key, value) => {
    const setKey = JSON.stringify(key);
    const setValue = JSON.stringify(value);
    localStorage.setItem(setKey, setValue);
  },
  get: (key) => {
    const setKey = JSON.stringify(key);
    const data = localStorage.getItem(setKey);
    return data ? JSON.parse(data) : null;
  },
  remove: (key) => {
    const setKey = JSON.stringify(key);
    localStorage.removeItem(setKey);
  },
};
