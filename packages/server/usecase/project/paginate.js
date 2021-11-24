/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* global MESSAGE, _ , COMMON_CONSTANTS */
const CommonQueryRepository = require('../../models/Repo');
const applicationUseCase = require('../application/paginate');

const {
  APPLICATION_FIELDS, PROJECT_FIELDS,
} = require('../util/fieldsList');

const paginate = (projectRepo, applicationRepo) => async (param) => {
  try {
    let applicationFilter = {};
    if (param?.applicationFilter) {
      applicationFilter = _.cloneDeep(param?.applicationFilter);
      delete param.applicationFilter;
    }

    let params = param;
    if (!params) {
      params = {};
    }
    const filter = params;
    if (!filter.find) {
      filter.find = {};
      // filter.find.isArchive = false;
    }

    if (!filter.fields) {
      filter.fields = PROJECT_FIELDS;
    }

    let [sortKey, sortValue] = ['updatedAt', -1];
    if (params?.sortBy) {
      [sortKey, sortValue] = Object.entries(params?.sortBy)?.[0];
    }

    /*
     * const isArchive = !!filter.find?.isArchive;
     * delete filter.find?.isArchive;
     */

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

    let list = await projectRepo.getDetails(filter);
    const projectIds = _.map(list, '_id');
    if (list.length) {
      // combine app in list
      const appFilter = {
        projectId: { $in: projectIds },
        ...companyAssociationFilter?.applicationId,
        ...applicationFilter,
      };
      /*
       * if (isArchive) {
       *   appFilter = { ...appFilter, isArchive: true };
       * } else {
       *   appFilter = { ...appFilter, $or: [{ isArchive: false }, { isArchive: { $exists: false } }] };
       * }
       */
      APPLICATION_FIELDS.push('output');
      let applications = await (applicationUseCase(applicationRepo))({
        params: appFilter,
        fields: APPLICATION_FIELDS,
      });
      if (applications.code !== MESSAGE.OK.code) {
        return applications;
      }
      applications = applications.data.list;

      /*
       * const archivedApplications = _.filter(applications, 'isArchive');
       * if (params?.isArchive === true && archivedApplications.length === 0) {
       *   list = [];
       * }
       */

      const generatedIds = _.compact(_.uniq(applications.map((i) => {
        if (i.generatedId) {
          return i.generatedId;
        }
      })));

      // tempGeneratedIds data get in response
      const tempGeneratedIds = _.compact(_.uniq(applications.map((i) => {
        if (i.tempGeneratedId) {
          return i.tempGeneratedId;
        }
      })));

      // get generate setting
      const generateFilter = {
        find: { _id: generatedIds },
        fields: ['type', 'status', 'createdAt', 'updatedAt', '_id', 'semanticVersionNumber', 'versionNumber'],
      };

      // get tempGenerate setting
      const tempGenerateFilter = {
        find: { _id: tempGeneratedIds },
        fields: ['type', 'status', 'createdAt', 'updatedAt', '_id', 'semanticVersionNumber', 'versionNumber'],
      };

      const CommonQueryRepo = new CommonQueryRepository(COMMON_CONSTANTS.MODULE.GENERATOR);
      const generatedData = await CommonQueryRepo.getDetails(generateFilter);
      const tempGeneratedData = await CommonQueryRepo.getDetails(tempGenerateFilter);

      // Group by application
      const acceessPermissionsGroupBy = _.groupBy({}, 'applicationId');

      // Application map data
      applications = _.map(applications, (app) => {
        const applicationPermission = acceessPermissionsGroupBy[app._id.toString()];
        app.assignedUserCount = applicationPermission?.length ?? 0;

        // Project generate setting assign
        if (generatedData && app.generatedId) {
          app.generatedIdData = _.find(generatedData, { _id: app.generatedId });
        }

        // Project tempGenerate setting assign
        if (tempGeneratedData && app.tempGeneratedId) {
          app.tempGeneratedIdData = _.find(tempGeneratedData, { _id: app.tempGeneratedId });
        }

        return app;
      });

      // Project
      const listUnarchive = _.orderBy(list?.filter((i) => !i.isArchive), [sortKey], [sortValue === 1 ? 'asc' : 'desc']);
      const listArchive = _.orderBy(list?.filter((i) => i.isArchive === true), [sortKey], [sortValue === 1 ? 'asc' : 'desc']);
      list = [...listUnarchive, ...listArchive];

      // Application
      const applicationUnarchive = _.orderBy(applications?.filter((i) => !i.isArchive), [sortKey], [sortValue === 1 ? 'asc' : 'desc']);
      const applicationArchive = _.orderBy(applications?.filter((i) => i.isArchive === true), [sortKey], [sortValue === 1 ? 'asc' : 'desc']);

      applications = [...applicationUnarchive, ...applicationArchive];
      applications = _.groupBy(applications, 'projectId');

      list = _.filter(list, (l) => {
        if (applications[l?._id.toString()]) {
          l.applications = applications[l?._id.toString()];
        }

        return l;
      });
    }
    const response = {
      list,
      count: await projectRepo.getCount(filter),
      user: null,
    };

    return {
      ...MESSAGE.OK,
      data: response,
    };
  } catch (err) {
    // console.log('error', err);
    return MESSAGE.SERVER_ERROR;
    // return { ...MESSAGE.SERVER_ERROR, data: err.toString() };
  }
};
module.exports = paginate;
