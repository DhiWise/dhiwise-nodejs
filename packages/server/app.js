global._ = require('lodash');
const express = require('express');
const logger = require('morgan');
global.message = require('./models/constants/message');

global.MESSAGE = require('./models/constants/message').MESSAGE;
global.COMMON_CONSTANTS = require('./models/constants/common');

global.__appRootDir = __dirname;
const cors = require('cors');
const compression = require('compression');
require('./config/db');

require('./models');
require('events').EventEmitter.defaultMaxListeners = 0;

global.appRootPath = __dirname;

const {
  ok, badRequest, serverError, forbidden, unauthorized, notFound, setResponse,
} = require('./responses');

const PORT = 3053;
const HOST = 'localhost';

const app = express();

// Response compression using `gzip`.
app.use(compression({
  level: 6,
  threshold: 0,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
}));

app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.use(express.static(`${__dirname}/uploads`));
app.use('/uploads', express.static(`${__dirname}/uploads`));

app.use((req, res, next) => {
  res.ok = (body) => {
    ok(res, body);
  };
  res.badRequest = (body) => {
    badRequest(res, body);
  };
  res.serverError = (body) => {
    serverError(res, body);
  };
  res.forbidden = (body) => {
    forbidden(res, body);
  };
  res.unauthorized = (body) => {
    unauthorized(res, body);
  };
  res.notFound = (body) => {
    notFound(res, body);
  };
  res.setResponse = (body) => {
    setResponse(res, body);
  };
  next();
});

app.use(logger('dev'));
// routes
const routes = require('./routes');

app.use(routes);

if (process.env.NODE_ENV === 'test') {
  module.exports = app;
} else {
  // listen for requests
  app.listen(PORT, HOST, () => {
    console.log(`Server is listening on port ${HOST}:${PORT}`);
  });
}
