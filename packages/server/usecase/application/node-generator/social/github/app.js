/* eslint-disable global-require */
const fs = require('fs');
const ejs = require('ejs');
const path = require('path');
const writeOperations = require('../../writeOperations');

function loadTemplate (name) {
  const util = require('util');
  const contents = fs.readFileSync(path.join(__dirname, 'templates', (`${name}.ejs`)), 'utf-8');
  const locals = Object.create(null);
  function render () {
    return ejs.render(contents, locals, { escape: util.inspect });
  }
  return {
    locals,
    render,
  };
}
function generateSocialLoginForMVC (jsonData) {
  try {
    const { config } = jsonData;
    const projectId = jsonData.id;
    const projectPath = `${config.path}/${projectId}/${config.projectName}`;
    if (!fs.existsSync(`${projectPath}/services`)) {
      fs.mkdirSync(`${projectPath}/services`);
    }
    if (!fs.existsSync(`${projectPath}/routes`)) {
      fs.mkdirSync(`${projectPath}/routes`);
    }
    const model = loadTemplate('js/service.js');
    model.locals.MODEL = jsonData.model;
    model.locals.MODEL_FC = jsonData.model.charAt(0).toUpperCase() + jsonData.model.slice(1);
    model.locals.RESTRICTION = jsonData.deviceRestriction ? jsonData.deviceRestriction : false;
    model.locals.PLATFORMS = jsonData.platforms ? jsonData.platforms : [];
    if (jsonData.keys) {
      model.locals.KEYS = jsonData.keys;
    }
    writeOperations.write(`${projectPath}/services/github-login-service.js`, model.render());
    const route = loadTemplate('js/routes/github-login-routes.js');
    if (!jsonData.credentials.callbackUrl || jsonData.credentials.callbackUrl === '') {
      jsonData.credentials.callbackUrl = '/auth/github/callback';
    }
    if (!jsonData.credentials.errorUrl || jsonData.credentials.errorUrl === '') {
      jsonData.credentials.errorUrl = '/auth/github/error';
    }
    route.locals.CALLBACK_URL = jsonData.credentials.callbackUrl;
    route.locals.ERROR_URL = jsonData.credentials.errorUrl;
    writeOperations.write(`${projectPath}/routes/github-login-routes.js`, route.render());
  } catch (err) {
    throw new Error(err);
  }
}

function generateSocialLoginForCC (jsonData) {
  try {
    const { config } = jsonData;
    const projectId = jsonData.id;
    const projectPath = `${config.path}/${projectId}/${config.projectName}`;
    if (!fs.existsSync(`${projectPath}/services`)) {
      fs.mkdirSync(`${projectPath}/services`);
    }
    if (!fs.existsSync(`${projectPath}/routes`)) {
      fs.mkdirSync(`${projectPath}/routes`);
    }
    const model = loadTemplate('js/service-cc.js');
    model.locals.MODEL = jsonData.model;
    model.locals.MODEL_FC = jsonData.model.charAt(0).toUpperCase() + jsonData.model.slice(1);
    model.locals.RESTRICTION = jsonData.deviceRestriction ? jsonData.deviceRestriction : false;
    model.locals.PLATFORMS = jsonData.platforms ? jsonData.platforms : [];
    if (jsonData.keys) {
      model.locals.KEYS = jsonData.keys;
    }
    writeOperations.write(`${projectPath}/services/github-login-service.js`, model.render());
    const route = loadTemplate('js/routes/github-login-routes-cc.js');
    if (!jsonData.credentials.callbackUrl || jsonData.credentials.callbackUrl === '') {
      jsonData.credentials.callbackUrl = '/auth/github/callback';
    }
    if (!jsonData.credentials.errorUrl || jsonData.credentials.errorUrl === '') {
      jsonData.credentials.errorUrl = '/auth/github/error';
    }
    route.locals.CALLBACK_URL = jsonData.credentials.callbackUrl;
    route.locals.ERROR_URL = jsonData.credentials.errorUrl;
    writeOperations.write(`${projectPath}/routes/github-login-routes.js`, route.render());
  } catch (err) {
    throw new Error(err);
  }
}

function generateSocialLoginForMVCSequelize (jsonData) {
  try {
    const { config } = jsonData;
    const projectId = jsonData.id;
    const projectPath = `${config.path}/${projectId}/${config.projectName}`;
    if (!fs.existsSync(`${projectPath}/services`)) {
      fs.mkdirSync(`${projectPath}/services`);
    }
    if (!fs.existsSync(`${projectPath}/routes`)) {
      fs.mkdirSync(`${projectPath}/routes`);
    }
    const model = loadTemplate('js/service-sequelize.js');
    model.locals.MODEL = jsonData.model;
    model.locals.MODEL_FC = jsonData.model.charAt(0).toUpperCase() + jsonData.model.slice(1);
    model.locals.RESTRICTION = jsonData.deviceRestriction ? jsonData.deviceRestriction : false;
    model.locals.PLATFORMS = jsonData.platforms ? jsonData.platforms : [];
    if (jsonData.keys) {
      model.locals.KEYS = jsonData.keys;
    }
    writeOperations.write(`${projectPath}/services/github-login-service.js`, model.render());
    const route = loadTemplate('js/routes/github-login-routes.js');
    if (!jsonData.credentials.callbackUrl || jsonData.credentials.callbackUrl === '') {
      jsonData.credentials.callbackUrl = '/auth/github/callback';
    }
    if (!jsonData.credentials.errorUrl || jsonData.credentials.errorUrl === '') {
      jsonData.credentials.errorUrl = '/auth/github/error';
    }
    route.locals.CALLBACK_URL = jsonData.credentials.callbackUrl;
    route.locals.ERROR_URL = jsonData.credentials.errorUrl;
    writeOperations.write(`${projectPath}/routes/github-login-routes.js`, route.render());
  } catch (err) {
    throw new Error(err);
  }
}

function generateSocialLoginForCCSequelize (jsonData) {
  try {
    const { config } = jsonData;
    const projectId = jsonData.id;
    const projectPath = `${config.path}/${projectId}/${config.projectName}`;
    if (!fs.existsSync(`${projectPath}/services`)) {
      fs.mkdirSync(`${projectPath}/services`);
    }
    if (!fs.existsSync(`${projectPath}/routes`)) {
      fs.mkdirSync(`${projectPath}/routes`);
    }
    const model = loadTemplate('js/service-cc-sequelize.js');
    model.locals.MODEL = jsonData.model;
    model.locals.MODEL_FC = jsonData.model.charAt(0).toUpperCase() + jsonData.model.slice(1);
    model.locals.RESTRICTION = jsonData.deviceRestriction ? jsonData.deviceRestriction : false;
    model.locals.PLATFORMS = jsonData.platforms ? jsonData.platforms : [];
    if (jsonData.keys) {
      model.locals.KEYS = jsonData.keys;
    }
    writeOperations.write(`${projectPath}/services/github-login-service.js`, model.render());
    const route = loadTemplate('js/routes/github-login-routes-cc.js');
    if (!jsonData.credentials.callbackUrl || jsonData.credentials.callbackUrl === '') {
      jsonData.credentials.callbackUrl = '/auth/github/callback';
    }
    if (!jsonData.credentials.errorUrl || jsonData.credentials.errorUrl === '') {
      jsonData.credentials.errorUrl = '/auth/github/error';
    }
    route.locals.CALLBACK_URL = jsonData.credentials.callbackUrl;
    route.locals.ERROR_URL = jsonData.credentials.errorUrl;
    writeOperations.write(`${projectPath}/routes/github-login-routes.js`, route.render());
  } catch (err) {
    throw new Error(err);
  }
}

async function main (jsonData) {
  try {
    const { projectType } = jsonData;
    switch (projectType) {
    case 'mvc':
      generateSocialLoginForMVC(jsonData);
      break;
    case 'clean-code':
      generateSocialLoginForCC(jsonData);
      break;
    case 'mvc_sequelize':
      generateSocialLoginForMVCSequelize(jsonData);
      break;
    case 'cc_sequelize':
      generateSocialLoginForCCSequelize(jsonData);
      break;
    default:
      // console.log('Invalid Project Type');
      break;
    }
  } catch (err) {
    throw new Error(err);
  }
}

module.exports = main;
