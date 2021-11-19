const express = require('express');

const router = express.Router();
const jsonInput = require('./jsonInput');

router.use('/json-input', jsonInput);

module.exports = router;
