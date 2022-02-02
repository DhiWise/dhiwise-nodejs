/* eslint-disable */
const jwt = require('jsonwebtoken');
const { JWT } = require('../constants/authConstant');

async function generateToken (user, secret) {
  return jwt.sign({
    id: user.id,
    username: user.username,
  }, secret, { expiresIn: JWT.EXPIRES_IN });
}

module.exports = generateToken;
