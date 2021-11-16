const express = require('express');

const router = express.Router();

const { jsonInput } = require('../../../controllers/web/jsonInput');

router.post('/store', jsonInput);

module.exports = router;
