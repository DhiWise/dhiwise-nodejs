const express = require('express');

const router = express.Router();

const projectPolicyRoute = require('./projectPolicy');

router.use('/project-policy', projectPolicyRoute);

module.exports = router;
