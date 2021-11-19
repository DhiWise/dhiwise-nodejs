const express = require('express');

const router = express.Router();

const {
  upsert, get,
} = require('../../../controllers/web/envVariables');

router.post('/upsert', upsert);
router.post('/details', get);

module.exports = router;
