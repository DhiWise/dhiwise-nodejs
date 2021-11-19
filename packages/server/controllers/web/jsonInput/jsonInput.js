const jsonInput = ({ jsonInputUseCase }) => async (req, res) => {
  const response = await jsonInputUseCase(req.body);
  return res.setResponse(response);
};

module.exports = { jsonInput };
