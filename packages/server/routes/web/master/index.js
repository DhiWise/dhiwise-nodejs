const express = require('express');

const router = express.Router();
const master = require('./master');

router.use('/master', master);

module.exports = router;
