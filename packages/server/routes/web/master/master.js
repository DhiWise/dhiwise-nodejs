const express = require('express');

const router = express.Router();

const { getByCode } = require('../../../controllers/web/master');

router.post('/get-by-code', getByCode);

module.exports = router;
