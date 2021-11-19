const express = require('express');

const router = express.Router();

const {
  create, paginate, destroy, update, get, upsert, applicationRestriction,
} = require('../../../controllers/web/project');

router.post('/create', create);
router.post('/applicationRestriction', applicationRestriction);
router.post('/create', create);
router.post('/paginate', paginate);
router.put('/:id', update);
router.put('/archive/:id', upsert);
router.get('/:id', get);
router.post('/destroy', destroy);

module.exports = router;
