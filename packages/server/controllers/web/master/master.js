const getByCode = ({ getByCodeUseCase }) => async (req, res) => {
  const response = await getByCodeUseCase(req.body, null, null);
  return res.setResponse(response);
};

module.exports = { getByCode };
