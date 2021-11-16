const express = require('express');

const router = express.Router();

const {
  upsert, paginate, destroy,
} = require('../../../controllers/web/projectRoleAccessPermissions');

router.post('/upsert', upsert);
router.post('/paginate', paginate);
router.post('/destroy', destroy);

module.exports = router;
