const getBaseUrl = () => {
  if (process.env.BASE_URL) {
    return process.env.BASE_URL;
  }
  const port = 3053;
  const host = 'localhost';
  return `${host}:${port}`;
};
module.exports = { getBaseUrl };
