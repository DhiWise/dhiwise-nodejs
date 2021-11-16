const express = require('express');

const router = express.Router();
const applicationConfig = require('./applicationConfig');

router.use('/application-config', applicationConfig);

module.exports = router;
