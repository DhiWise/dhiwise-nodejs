const upsert = ({ upsertUseCase }) => async (req, res) => {
  const response = await upsertUseCase(req.body);
  return res.setResponse(response);
};

const destroy = ({ destroyUseCase }) => async (req, res) => {
  const response = await destroyUseCase(req.body);
  return res.setResponse(response);
};

const paginate = ({ paginateUseCase }) => async (req, res) => {
  const response = await paginateUseCase(req.body);
  return res.setResponse(response);
};

module.exports = {
  upsert,
  destroy,
  paginate,
};
