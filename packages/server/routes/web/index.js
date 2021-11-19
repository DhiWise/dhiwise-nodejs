const express = require('express');

const router = express.Router();
const project = require('./project');
const application = require('./application');
const schema = require('./schema');
const schemaDetail = require('./schemaDetail');
const projectRoute = require('./projectRoute');
const projectConstant = require('./projectConstant');
const projectPolicy = require('./projectPolicy');
const applicationConfig = require('./applicationConfig');
const envVariables = require('./envVariables');
const jsonInput = require('./jsonInput');
const roleAccess = require('./projectRoleAccessPermissions');
const masterRoute = require('./master');

router.use('/v1', application);
router.use('/v1', project);
router.use('/v1', schema);
router.use('/v1', schemaDetail);
router.use('/v1', projectRoute);
router.use('/v1', projectConstant);
router.use('/v1', projectPolicy);
router.use('/v1', applicationConfig);
router.use('/v1', envVariables);
router.use('/v1', jsonInput);
router.use('/v1', roleAccess);
router.use('/v1', masterRoute);

module.exports = router;
