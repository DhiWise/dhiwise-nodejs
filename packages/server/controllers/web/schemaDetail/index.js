const SchemaRepository = require('../../../repo/schema');
const SchemaDetailRepository = require('../../../repo/schemaDetail');

const SchemaDetailRepo = new SchemaDetailRepository();
const schemaRepo = new SchemaRepository();
const createUseCase = require('../../../usecase/schemaDetail/create')(SchemaDetailRepo, schemaRepo);
const paginateUseCase = require('../../../usecase/schemaDetail/paginate')(SchemaDetailRepo, schemaRepo);
const updateUseCase = require('../../../usecase/schemaDetail/update')(SchemaDetailRepo, schemaRepo);
const upsertUseCase = require('../../../usecase/schemaDetail/upsert')(SchemaDetailRepo, schemaRepo);

const schema = require('./schemaDetail');

const create = schema.create({ createUseCase });
const paginate = schema.paginate({ paginateUseCase });
const update = schema.update({ updateUseCase });
const upsert = schema.upsert({ upsertUseCase });

module.exports = {
  create,
  paginate,
  update,
  upsert,
};
