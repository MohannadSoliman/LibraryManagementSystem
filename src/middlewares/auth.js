require('dotenv').config();
const basicAuth = require('basic-auth');

const USERNAME = process.env.BASIC_AUTH_USER;
const PASSWORD = process.env.BASIC_AUTH_PASS;

module.exports = function (req, res, next) {
  const credentials = basicAuth(req);

  if (!credentials || credentials.name !== USERNAME || credentials.pass !== PASSWORD) {
    res.set('WWW-Authenticate', 'Basic realm="API"');
    return res.status(401).json({ success: false, message: 'Access denied' });
  }
  next();
};
