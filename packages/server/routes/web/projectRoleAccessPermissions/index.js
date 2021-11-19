const express = require('express');

const router = express.Router();
const projectRoleAccessPermissions = require('./projectRoleAccessPermissions');

router.use('/project-role-access', projectRoleAccessPermissions);

module.exports = router;
