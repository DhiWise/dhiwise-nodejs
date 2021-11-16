const express = require('express');

const router = express.Router();

const {
  create, paginate, update, destroy, uploadPostmanFile,
  requestApi,
} = require('../../../controllers/web/projectRoute');

router.post('/create', create);
router.post('/paginate', paginate);
router.put('/:id', update);
router.post('/destroy', destroy);
router.post('/upload-postman-file', uploadPostmanFile);
router.post('/request', requestApi);

module.exports = router;
