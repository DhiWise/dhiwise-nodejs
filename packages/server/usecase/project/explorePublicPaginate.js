/* global MESSAGE, _ , COMMON_CONSTANTS */
const CommonQueryRepository = require('../../models/Repo');

const applicationUseCase = require('../application/paginate');

const { APPLICATION_FIELDS } = require('../util/fieldsList');

const explorePublicPaginate = (projectRepo, applicationRepo) => async (param) => {
  try {
    let params = param;
    if (!params) {
      params = {};
    }
    const filter = params;
    if (!filter.find) {
      filter.find = {};
    }

    filter.find.isPublic = true;

    if (!filter.fields) {
      filter.fields = ['_id', 'image', 'name', 'updatedAt',
        'description', 'isArchive', 'createdAt'];
    }
    const search = params?.search;
    const isArchive = !!filter.find?.isArchive;
    delete filter.find?.isArchive;

    // const companyAssociation = await
    const companyAssociationFilter = {};
    if (param.isGlobalSearch && filter.search) {
      delete filter.isGlobalSearch;
      const searchApplications = await applicationRepo.getDetails({
        search: {
          ...filter.search,
          ...companyAssociationFilter?.applicationId,
        },
      });

      if (searchApplications && searchApplications.length) {
        filter.or = [{ _id: _.compact(_.uniq(_.map(searchApplications, (i) => i.projectId.toString()))) }];
      }
    }

    // combine app in list
    let appFilter = {
      definitionId: params?.projectDefinitionId,
      isPublic: true,
      isDefaultPublic: { $ne: true },
      ...companyAssociationFilter?.applicationId,
    };
    if (isArchive) {
      appFilter = {
        ...appFilter,
        isArchive: true,
      };
    }

    /*
     * else {
     *   appFilter = { ...appFilter, $or: [{ isArchive: false }, { isArchive: { $exists: false } }] };
     * }
     */
    let applications = await (applicationUseCase(applicationRepo))({
      params: appFilter,
      search,
      fields: [...APPLICATION_FIELDS, 'tags'],
    });
    if (applications.code !== MESSAGE.OK.code) {
      return applications;
    }
    applications = applications.data.list;

    const generatedIds = _.compact(_.uniq(applications.map((i) => i.generatedId)));

    // get generate setting
    const generateFilter = {
      find: { _id: generatedIds },
      fields: ['type', 'status', 'createdAt', 'updatedAt', '_id'],
    };

    const CommonQueryRepo = new CommonQueryRepository(COMMON_CONSTANTS.MODULE.GENERATOR);
    const generatedData = await CommonQueryRepo.getDetails(generateFilter);

    // Application map data
    applications = _.map(applications, (app) => {
      // Project generate setting assign
      if (generatedData && app.generatedId) {
        app.generatedIdData = _.find(generatedData, { _id: app.generatedId });
      }

      return app;
    });

    const response = {
      list: applications,
      count: applications.length,
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
module.exports = explorePublicPaginate;
