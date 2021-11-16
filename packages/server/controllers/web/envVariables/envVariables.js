const upsert = ({ upsertUseCase }) => async (req, res) => {
  const response = await upsertUseCase(req.body);
  return res.setResponse(response);
};

const get = ({ getUseCase }) => async (req, res) => {
  const response = await getUseCase(req.body);
  return res.setResponse(response);
};

module.exports = {
  upsert,
  get,
};
