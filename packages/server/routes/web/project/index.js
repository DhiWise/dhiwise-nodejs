const express = require('express');

const router = express.Router();
const project = require('./project');

router.use('/project', project);

module.exports = router;
