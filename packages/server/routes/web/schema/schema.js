const express = require('express');

const router = express.Router();

const {
  create, paginate, update, destroy, insertMany, schemaExists, sqlSchemaExists, getSchema,
  insertDefaultModels, searchSchema,
} = require('../../../controllers/web/schema');

router.post('/create', create);
router.post('/upload-models', insertMany);
router.post('/paginate', paginate);
router.post('/destroy', destroy);
router.put('/:id', update);
router.post('/update-exists-schema', schemaExists);
router.post('/sql-schema-exists', sqlSchemaExists);
router.get('/get/:id', getSchema);
router.post('/insert-default-models', insertDefaultModels);
router.post('/search', searchSchema);
router.post('/import-sql');
module.exports = router;
