const create = ({ createUseCase }) => async (req, res) => {
  const response = await createUseCase(req.body);
  return res.setResponse(response);
};

const update = ({ updateUseCase }) => async (req, res) => {
  const response = await updateUseCase(req.params.id, req.body);
  return res.setResponse(response);
};

const get = ({ getUseCase }) => async (req, res) => {
  const response = await getUseCase(req.params.id, req.body);
  return res.setResponse(response);
};

const destroy = ({ deleteUseCase }) => async (req, res) => {
  const response = await deleteUseCase(req.body);
  return res.setResponse(response);
};

const paginate = ({ paginateUseCase }) => async (req, res) => {
  const response = await paginateUseCase(req.body);
  return res.setResponse(response);
};

const upsert = ({ upsertUseCase }) => async (req, res) => {
  const response = await upsertUseCase(req.params.id, req.body, req.headers);
  return res.setResponse(response);
};

const applicationRestriction = ({ applicationRestrictionUseCase }) => async (req, res) => {
  req.body.companyId = req.headers.companyid;
  const response = await applicationRestrictionUseCase(req.body, res);
  return res.setResponse(response);
};

module.exports = {
  create,
  paginate,
  update,
  destroy,
  get,
  upsert,
  applicationRestriction,
};
