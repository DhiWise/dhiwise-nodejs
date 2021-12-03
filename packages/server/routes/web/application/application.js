const express = require('express');

const router = express.Router();

const {
  create, paginate, generate, structure, destroy, update, view,
  get, openCode, getLastApplication,
} = require('../../../controllers/web/application');

router.post('/create', create);
router.post('/paginate', paginate);
router.get('/last-application', getLastApplication);
router.get('/:id', get);
router.post('/generate', generate);
router.post('/structure', structure);
router.put('/invite/:id', update);
router.put('/:id', update);
router.post('/destroy', destroy);
router.post('/view', view);
router.post('/open-generated-code', openCode);

module.exports = router;
