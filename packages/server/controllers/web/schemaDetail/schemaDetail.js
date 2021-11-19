const create = ({ createUseCase }) => async (req, res) => {
  const response = await createUseCase(req.body);
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

const upsert = ({ upsertUseCase }) => async (req, res) => {
  const response = await upsertUseCase(req.body);
  return res.setResponse(response);
};

module.exports = {
  create,
  paginate,
  update,
  upsert,
};
