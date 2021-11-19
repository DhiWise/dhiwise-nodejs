/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/* eslint-disable no-console */
const { forEach } = require('lodash');

async function addSocialLogin (
  {
    jsonData, userModel, socialAuth, noOfDeviceAllowed,
  },
) {
  const { platforms } = socialAuth;
  const app = { locals: { uses: [] } };
  const pkg = { dependencies: {} };
  if (userModel && jsonData.models[userModel]) {
    const keys = {};
    const usernameArray = ['username', 'UserName', 'userName', 'Username'];
    const imageArray = ['pic', 'photo', 'image', 'img', 'profilePic', 'Pic', 'ProfilePic', 'Img', 'Image', 'Photo'];
    const firstNameArray = ['firstname', 'firstName', 'fname', 'FirstName', 'Fname', 'Firstname', 'FName'];
    const lastNameArray = ['lastname', 'lastName', 'lname', 'LastName', 'Lname', 'Lastname', 'LName'];
    Object.keys(jsonData.models[userModel]).forEach((k) => {
      if (usernameArray.includes(k)) {
        Object.assign(keys, { username: k });
      }
      if (imageArray.includes(k)) {
        Object.assign(keys, { image: k });
      }
      if (firstNameArray.includes(k)) {
        Object.assign(keys, { firstName: k });
      }
      if (lastNameArray.includes(k)) {
        Object.assign(keys, { lastName: k });
      }
      if (k === 'name' || k === 'Name') {
        Object.assign(keys, { name: k });
      }
    });
    let projectType = jsonData.projectType.toLowerCase();
    if (projectType === 'cc') {
      projectType = 'clean-code';
    }
    let jsonObject = {
      id: jsonData.id,
      config: {
        projectName: jsonData.config.projectName,
        path: jsonData.config.path,
      },
      model: userModel,
      keys,
      projectType,
      deviceRestriction: noOfDeviceAllowed.required,
    };
    if (jsonData.adapter && jsonData.ORM) {
      jsonObject = {
        ...jsonObject,
        adapter: jsonData.adapter,
        ORM: jsonData.ORM,
      };
    }
    pkg.dependencies.passport = '~0.4.1';
    forEach(platforms, async (p) => {
      const main = require(`../../social/${p.type.toLowerCase()}/app.js`);
      if (p.type.toLowerCase() === 'google') {
        pkg.dependencies['passport-google-oauth20'] = '~2.0.0';
      }
      if (p.type.toLowerCase() === 'linkedin') {
        pkg.dependencies['passport-linkedin-oauth2'] = '~2.0.0';
      }
      if (p.type.toLowerCase() === 'github') {
        pkg.dependencies['passport-github2'] = '~0.1.12';
      }
      if (p.type.toLowerCase() === 'facebook') {
        pkg.dependencies['passport-facebook'] = '~3.0.0';
      }
      jsonObject = {
        ...jsonObject,
        platforms: p.platforms,
        credentials: p.credential || {},
      };
      Object.assign(jsonObject, { platforms: p.platforms });
      await main(jsonObject);
      app.locals.uses.push(`require('./routes/${p.type.toLowerCase()}-login-routes')`);
    });
  }
  return {
    app,
    pkg,
  };
}

module.exports = { addSocialLogin };
