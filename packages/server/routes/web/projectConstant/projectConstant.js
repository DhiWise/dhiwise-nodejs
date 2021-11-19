const express = require('express');

const router = express.Router();

const {
  create, paginate, update, destroy,
} = require('../../../controllers/web/projectConstant');

router.post('/create', create);
router.post('/paginate', paginate);
router.put('/:id', update);
router.post('/destroy', destroy);

module.exports = router;
