const create = ({ createUseCase }) => async (req, res) => {
  const response = await createUseCase(req.body);
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

const paginate = ({ paginateUseCase }) => async (req, res) => {
  const response = await paginateUseCase(req.body);
  return res.setResponse(response);
};

const uploadPostmanFile = ({ uploadPostmanFileUseCase }) => async (req, res) => {
  const response = await uploadPostmanFileUseCase(req);
  return res.setResponse(response);
};

const requestApi = ({ requestApiUseCase }) => async (req, res) => {
  const response = await requestApiUseCase({ params: req.body });
  return res.setResponse(response);
};

module.exports = {
  create,
  update,
  destroy,
  paginate,
  uploadPostmanFile,
  requestApi,
};
