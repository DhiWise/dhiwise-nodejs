const rewireAliases = require('react-app-rewire-aliases');
const { paths } = require('react-app-rewired');
const path = require('path');

/* config-overrides.js */
module.exports = function override(config, env) {
  return rewireAliases.aliasesOptions({
    '@assets': path.resolve(__dirname, `./${paths.appSrc}/assets`),
    '@constant': path.resolve(__dirname, `./${paths.appSrc}/constant/`),
  })(config, env);
};
