const express = require('express');

const router = express.Router();

const {
  create, update, get, destroy, paginate,
} = require('../../../controllers/web/applicationConfig');

router.post('/create', create);
router.post('/paginate', paginate);
router.put('/:id', update);
router.get('/:id', get);
router.post('/destroy', destroy);

module.exports = router;
