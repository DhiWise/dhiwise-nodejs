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
  const response = await paginateUseCase({ params: req.body });
  return res.setResponse(response);
};
const generate = ({ generateUseCase }) => async (req, res) => {
  const response = await generateUseCase(req.body);
  return res.setResponse(response);
};

const structure = ({ structureUseCase }) => async (req, res) => {
  const response = await structureUseCase(req.body);
  return res.setResponse(response);
};

const upsert = ({ upsertUseCase }) => async (req, res) => {
  const response = await upsertUseCase({
    id: req.params.id,
    params: req.body,
    req,
  });
  return res.setResponse(response);
};

const view = ({ viewUseCase }) => async (req, res) => {
  const response = await viewUseCase(req.body);
  return res.setResponse(response);
};

const openCode = ({ openCodeUseCase }) => async (req, res) => {
  const response = await openCodeUseCase(req.body);
  return res.setResponse(response);
};

const getLastApplication = ({ getLastApplicationUseCase }) => async (req, res) => {
  const response = await getLastApplicationUseCase(req.body);
  return res.setResponse(response);
};

module.exports = {
  create,
  paginate,
  generate,
  structure,
  update,
  destroy,
  upsert,
  view,
  get,
  openCode,
  getLastApplication,
};
