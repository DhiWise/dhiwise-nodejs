/* eslint-disable prefer-destructuring */
/* global  _ */
const { forEach } = require('lodash');
const fakeData = require('../generateFakeData');
const writeOperations = require('../../writeOperations');
const { removeGivenKeyFromObject } = require('../utils/common');

const getReferenceCollectionsOfModel = (modelJSON) => {
  const referenceCollections = [];
  Object.keys(modelJSON).forEach((field) => {
    if (modelJSON[field].type === 'Schema.Types.ObjectId' && modelJSON[field].ref !== undefined) {
      referenceCollections.push(modelJSON[field].ref.replace(/@@/g, '').replace(/@@/g, ''));
    }
  });
  return referenceCollections;
};

const configureMongoAuthTestCases = (testCaseObj) => {
  const {
    jsonData, authObj, platforms, testCaseTemplateFolder, testCasePath,
  } = testCaseObj;
  const { authModel } = jsonData.authentication;
  const allTestCases = {};
  const dbName = jsonData.config.databaseName;

  const loginAccess = jsonData?.authentication?.loginAccess;
  const loginAccessOfPlatform = {};
  _.forEach(platforms, (platform) => {
    loginAccessOfPlatform[platform] = [];
    _.forEach(loginAccess, (p, userType) => {
      if (p.includes(platform)) {
        loginAccessOfPlatform[platform].push(userType);
      }
    });
  });

  const userTypes = jsonData?.authentication?.types;

  const referenceCollections = getReferenceCollectionsOfModel(jsonData.models[authModel]);
  forEach(platforms, (platformName) => {
    const fakeDataOfType = {};
    let fakeDataOfModels; let
      authFakeData;
    for (let i = 0; i < userTypes.length; i += 1) {
      fakeDataOfModels = fakeData.validSchema(_.cloneDeep(jsonData?.models));
      authFakeData = fakeDataOfModels[authModel];
      authFakeData = removeGivenKeyFromObject(authFakeData, ['id', 'resetPasswordLink', 'loginRetryLimit', 'loginReactiveTime', 'role', 'loginOTP']);
      fakeDataOfType[userTypes[i]] = authFakeData;
    }
    const userType = loginAccessOfPlatform[platformName];
    if (userType.length) {
      const fakeDataOfUser = fakeDataOfType[userType[0]];
      fakeDataOfModels = fakeData.validSchema(_.cloneDeep(jsonData?.models));
      const authTestCase = writeOperations.loadTemplate(`${testCaseTemplateFolder}/auth.test.js`);
      authTestCase.locals.MODELS = Object.keys(_.pickBy(jsonData.models, (value, key) => referenceCollections.includes(key)));
      authTestCase.locals.FAKE_DATA = _.pickBy(fakeDataOfModels, (value, key) => referenceCollections.includes(key));
      authTestCase.locals.DB_NAME = `${dbName}_test`;
      authTestCase.locals.AUTH_MODEL_JSON = jsonData.models[authModel];
      authTestCase.locals.ROLE = userType[0];
      authTestCase.locals.FAKE_DATA_OF_AUTH = fakeDataOfUser;
      authTestCase.locals.path = testCasePath;
      authTestCase.locals.PLATFORM = platformName;
      authTestCase.locals.AUTH_MODEL = authModel;
      authTestCase.locals.USER_LOGIN_WITH = authObj.userLoginWith;
      allTestCases[platformName] = {};
      allTestCases[platformName].auth = authTestCase;
      Object.assign(allTestCases[platformName], { auth: authTestCase });
    }
  });
  return allTestCases;
};

module.exports = { configureMongoAuthTestCases };
