const express = require('express');

const router = express.Router();

const webRoute = require('./web');

router.use('/web', webRoute);

module.exports = router;
