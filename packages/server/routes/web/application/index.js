const express = require('express');

const router = express.Router();
const application = require('./application');

router.use('/application', application);

module.exports = router;
