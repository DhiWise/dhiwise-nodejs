/* global MESSAGE, */

const paginate = (applicationRepo) => async ({
  params, search, fields,
}) => {
  try {
    /*
     * if (!params.projectId) {
     *   return INVALID_REQUEST_PARAMS;
     * }
     * params = {
     *     fields: "",
     *     find: {},
     *     page: 1,
     *     limit: 1
     * }
     */
    const filter = { find: params };
    if (fields) {
      filter.fields = fields;
    }

    if (search) {
      filter.search = search;
    }

    const response = {
      list: await applicationRepo.getDetails(filter),
      count: await applicationRepo.getCount(filter),
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
module.exports = paginate;
