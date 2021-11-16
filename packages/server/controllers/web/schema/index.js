const ApplicationRepository = require('../../../repo/application');
const SchemaRepository = require('../../../repo/schema');

const applicationRepo = new ApplicationRepository();
const schemaRepo = new SchemaRepository();

const createUseCase = require('../../../usecase/schema/create')(schemaRepo, applicationRepo);
const insertManyUseCase = require('../../../usecase/schema/insertMany')(schemaRepo, applicationRepo);
const paginateUseCase = require('../../../usecase/schema/paginate')(schemaRepo, applicationRepo);
const updateUseCase = require('../../../usecase/schema/update')(schemaRepo, applicationRepo);
const deleteUseCase = require('../../../usecase/schema/delete')(schemaRepo, applicationRepo);
const existsSchemaUpdateUseCase = require('../../../usecase/schema/existsSchemaUpdate')(schemaRepo);
const sqlSchemaExistsUseCase = require('../../../usecase/schema/sequelize/existsSchemaUpdate')(schemaRepo, applicationRepo);
const getSchemaUseCase = require('../../../usecase/schema/get')(schemaRepo);
const insertDefaultModelsUseCase = require('../../../usecase/schema/InsertDefaultModels/insertDefaultModels')(schemaRepo, applicationRepo);
const searchSchemaUseCase = require('../../../usecase/schema/searchSchema')(applicationRepo);

const schema = require('./schema');

const create = schema.create({ createUseCase });
const insertMany = schema.insertMany({ insertManyUseCase });
const paginate = schema.paginate({ paginateUseCase });
const update = schema.update({ updateUseCase });
const destroy = schema.destroy({ deleteUseCase });
const schemaExists = schema.schemaExists({ existsSchemaUpdateUseCase });
const sqlSchemaExists = schema.sqlSchemaExists({ sqlSchemaExistsUseCase });
const getSchema = schema.getSchema({ getSchemaUseCase });
const insertDefaultModels = schema.insertDefaultModels({ insertDefaultModelsUseCase });
const searchSchema = schema.searchSchema({ searchSchemaUseCase });

module.exports = {
  create,
  paginate,
  update,
  destroy,
  insertMany,
  schemaExists,
  sqlSchemaExists,
  getSchema,
  insertDefaultModels,
  searchSchema,
};
