const express = require('express');

const router = express.Router();
const schema = require('./schemaDetail');

router.use('/schema-detail', schema);

module.exports = router;
