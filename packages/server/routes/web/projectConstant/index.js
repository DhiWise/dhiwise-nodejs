const express = require('express');

const router = express.Router();

const projectConstantRoute = require('./projectConstant');

router.use('/project-constant', projectConstantRoute);

module.exports = router;
