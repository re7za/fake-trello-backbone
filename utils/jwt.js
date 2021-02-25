const jwt = require("jsonwebtoken");
const { APP_KEY } = require("../config/general");

function generateToken(data, options = null) {
  return jwt.sign(data, APP_KEY, options);
}

function verifyToken(token) {
  return jwt.verify(token, APP_KEY);
}

module.exports = {
  verifyToken,
  generateToken,
};
