const express = require('express');

const router = express.Router();
const projectRoute = require('./projectRoute');

router.use('/project-route', projectRoute);

module.exports = router;
