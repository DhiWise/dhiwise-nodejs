/* global MESSAGE */

const resourceCount = ({
  projectRepo, applicationRepo,
}) => async () => {
  try {
    const filter = {};
    const response = {
      noOfProject: await projectRepo.getCount(filter),
      noOfApplication: await applicationRepo.getCount(filter),
    };
    return {
      ...MESSAGE.OK,
      data: response,
    };
  } catch (err) {
    // console.log('error', err);
    return MESSAGE.SERVER_ERROR;
  }
};
module.exports = resourceCount;
