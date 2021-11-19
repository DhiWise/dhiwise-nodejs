const postman = require('./postman');
const generatePostmanCollection = require('./postman/generate-postman-collection');

async function createPostmanCollection (pName, postmanCollections, auth) {
  const {
    isAuth, userModel, userLoginWith, loginAccessPlatform, userRoles, socialAuth,
  } = auth;
  const infoForPostman = {
    project: {},
    item: null,
  };
  infoForPostman.project.name = pName;
  infoForPostman.project.descriptions = `${pName} API Collections`;
  const dynamicPlatforms = await postman.getCollectionForPostmanDynamic(postmanCollections, isAuth, userModel, userLoginWith, loginAccessPlatform, userRoles, socialAuth);
  infoForPostman.item = dynamicPlatforms;
  const jsonCollectionsV20 = await generatePostmanCollection.createCollectionV2_0(infoForPostman);
  const jsonCollectionsV21 = await generatePostmanCollection.createCollectionV2_1(infoForPostman);
  const envPostman = await postman.generateEnvForPostman(postmanCollections.config);
  return [jsonCollectionsV20, jsonCollectionsV21, envPostman];
}

module.exports = { createPostmanCollection };
