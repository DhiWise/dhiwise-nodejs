const express = require('express');

const router = express.Router();

const {
  create, paginate, update, upsert,
} = require('../../../controllers/web/schemaDetail');

router.post('/create', create);
router.post('/paginate', paginate);
router.put('/:id', update);
router.post('/upsert', upsert);
module.exports = router;
