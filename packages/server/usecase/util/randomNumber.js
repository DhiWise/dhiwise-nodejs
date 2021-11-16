/* eslint-disable no-plusplus */
const randomNumber = (length = 6) => {
  const numbers = '01234567890123456789';
  let result = '';
  for (let i = length; i > 0; --i) {
    result += numbers[Math.round(Math.random() * (numbers.length - 1))];
  }
  return result;
};

module.exports = { randomNumber };
