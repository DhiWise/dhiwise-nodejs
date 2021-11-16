/* global _, */
module.exports = (data, config) => {
  const response = _.assign({
    code: _.get(config, 'code', 'OK'),
    message: _.get(config, 'message', 'Operation is successfully executed'),
    data: data || {},
  }, _.get(config, 'root', {}));

  this.res.status(200);
  this.res.json(response);
};
