const express = require('express');

const router = express.Router();
const environmentVariables = require('./envVariables');

router.use('/env-variables', environmentVariables);

module.exports = router;
