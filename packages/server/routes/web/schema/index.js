const express = require('express');

const router = express.Router();
const schema = require('./schema');

router.use('/schema', schema);

module.exports = router;
