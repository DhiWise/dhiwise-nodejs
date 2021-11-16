const create = ({ createUseCase }) => async (req, res) => {
  const response = await createUseCase(req.body);
  return res.setResponse(response);
};
const insertMany = ({ insertManyUseCase }) => async (req, res) => {
  const response = await insertManyUseCase(req);
  return res.setResponse(response);
};
const paginate = ({ paginateUseCase }) => async (req, res) => {
  const response = await paginateUseCase(req.body);
  return res.setResponse(response);
};
const update = ({ updateUseCase }) => async (req, res) => {
  const response = await updateUseCase(req.params.id, req.body);
  return res.setResponse(response);
};
const destroy = ({ deleteUseCase }) => async (req, res) => {
  const response = await deleteUseCase(req.body);
  return res.setResponse(response);
};

const schemaExists = ({ existsSchemaUpdateUseCase }) => async (req, res) => {
  const response = await existsSchemaUpdateUseCase(req.body);
  return res.setResponse(response);
};

const sqlSchemaExists = ({ sqlSchemaExistsUseCase }) => async (req, res) => {
  const response = await sqlSchemaExistsUseCase(req.body);
  return res.setResponse(response);
};

const sqlInsertMany = ({ sqlInsertManyUseCase }) => async (req, res) => {
  const response = await sqlInsertManyUseCase(req.body);
  return res.setResponse(response);
};

const getSchema = ({ getSchemaUseCase }) => async (req, res) => {
  const response = await getSchemaUseCase(req.params.id, req.body);
  return res.setResponse(response);
};

const insertDefaultModels = ({ insertDefaultModelsUseCase }) => async (req, res) => {
  const response = await insertDefaultModelsUseCase(req.body);
  return res.setResponse(response);
};

const dataTypeSuggestions = ({ dataTypeSuggestionsUseCase }) => async (req, res) => {
  const response = await dataTypeSuggestionsUseCase(req.body);
  return res.setResponse(response);
};

const searchSchema = ({ searchSchemaUseCase }) => async (req, res) => {
  const response = await searchSchemaUseCase(req.body);
  return res.setResponse(response);
};

module.exports = {
  create,
  paginate,
  update,
  destroy,
  insertMany,
  schemaExists,
  sqlSchemaExists,
  sqlInsertMany,
  getSchema,
  insertDefaultModels,
  dataTypeSuggestions,
  searchSchema,
};
