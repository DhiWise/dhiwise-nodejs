/* global MESSAGE,_ */
// const validate = require('validate.js');
const formidable = require('formidable');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const { ROUTE_GENERATE_TYPE } = require('../../models/constants/project');
const { getApplicationDetail } = require('../util/getApplicationData');
const {
  INVALID_REQUEST_PARAMS, OK, SERVER_ERROR, INVALID_JSON, EMPTY_JSON_FILE, POSTMAN_UPLOADED,
} = require('../../constants/message').message;
const { applicationIdValidation } = require('../util/validation/applicationId');
/**
 *
 * Function used for validate request.
 * @description ::  Find Documentation @ http://validatejs.org/
 * @return mixed :: If error occurred then return array of errors else return undefined | null
 */
/*
 * async function validateData(data) {
 *   const constraints = {
 *     applicationId: {
 *       type: 'string',
 *       presence: true,
 *     },
 *   };
 */

//   const errors = validate(data, constraints);

/*
 *   if (errors) {
 *     return errors;
 *   }
 *   return null;
 * }
 */

/**
 *
 * Function used to check `string` is valid `JSON` or not.
 * @param  {} str
 */
async function isJson (str) {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Function used to get request body and fileData.
 * @param  {} req
 */
async function getBodyAndFileData (req) {
  const form = new formidable.IncomingForm();
  form.multiples = true;
  const getFilesData = await new Promise((resolve) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        const errObj = {
          code: SERVER_ERROR.code,
          message: SERVER_ERROR.message,
          data: err,
        };
        resolve(errObj);
      } else if (_.isEmpty(files)) {
        const errObj = {
          code: INVALID_REQUEST_PARAMS.code,
          message: INVALID_REQUEST_PARAMS.message,
        };
        resolve(errObj);
      } else if (path.extname(files.file.name).split('.')[1] !== 'json' || files.file.type !== 'application/json') {
        const errObj = {
          code: INVALID_JSON.code,
          message: INVALID_JSON.message,
        };
        resolve(errObj);
      } else {
        // Read file and validate JSON format in file.
        const rawData = fs.readFileSync(files.file.path);
        const checkJson = await isJson(rawData.toString());
        if (!checkJson) {
          const errObj = {
            code: INVALID_JSON.code,
            message: INVALID_JSON.message,
          };
          resolve(errObj);
        } else {
          const fileDetails = JSON.parse(rawData.toString());

          const succObj = {
            code: OK.code,
            message: OK.message,
            data: {
              fileData: fileDetails,
              params: fields,
            },
          };
          resolve(succObj);
        }
      }
    });
  });

  return getFilesData;
}

/**
 * Function used to prepared route array.
 *
 * @param  {} postmanData
 * @param  {} rJsonData=[]
 */
async function prepareRouteJsonFromPostmanFile (postmanData, rJsonData = []) {
  if (postmanData.item) {
    const jData = await Promise.all(postmanData.item.map(async (data) => {
      if (data.item) {
        await prepareRouteJsonFromPostmanFile(data, rJsonData);
      }
      return data;
    }));
    if (jData && _.size(jData)) {
      _.each(jData, (val) => {
        if (val && !val.item) {
          rJsonData.push(val);
        }
      });
    }
  }
  return rJsonData;
}

/**
 * Function used for create new user.
 * @return json
 */
const useCase = (projectRouteRepo, applicationRepo) => async (req) => {
  try {
    const postmanFileData = await getBodyAndFileData(req);
    if (postmanFileData.code !== OK.code) {
      return postmanFileData;
    }

    let { params } = postmanFileData.data;

    const { fileData } = postmanFileData.data;

    // Validate Request
    const {
      value, error,
    } = applicationIdValidation(params);
    if (error) {
      return {
        data: null,
        code: MESSAGE.BAD_REQUEST.code,
        message: error,
      };
    }
    if (params.applicationId) {
      const isValidId = mongoose.Types.ObjectId.isValid(params.applicationId);
      if (!isValidId) {
        return INVALID_REQUEST_PARAMS;
      }
    }
    params = value;
    const applicationData = await getApplicationDetail(applicationRepo)({ applicationId: params.applicationId });

    if (applicationData?.code !== MESSAGE.OK.code) {
      return applicationData;
    }

    // Prepared single array of routes, from Tree strucutred.
    const preparedJson = await prepareRouteJsonFromPostmanFile(fileData, []);
    if (!preparedJson || _.size(preparedJson) <= 0) {
      return EMPTY_JSON_FILE;
    }
    let routeErrors = [];

    let routeSuccess = await Promise.all(preparedJson.map(async (route) => {
      let routeUrl = '';
      if (typeof route.request.url === 'string') {
        routeUrl = _.cloneDeep(route.request.url);
      } else if (route?.request?.url?.raw) {
        routeUrl = _.cloneDeep(route.request.url.raw);
      }

      // Validate Unique Criteria
      const filter = {
        find: {
          route: routeUrl,
          isActive: { $in: [true, false] },
          applicationId: params.applicationId,
        },
      };
      const checkRoute = await projectRouteRepo.get({ filter });

      let created = {};
      if (!checkRoute) {
        // Prepare `Headers`.
        const headers = [];
        if (route?.request?.header) {
          _.map(route.request.header, (header) => {
            headers.push({
              key: header.key,
              value: header.value,
            });
          });
        }

        // Prepare `Params`.
        const queryParams = [];
        if (route?.request?.url?.query) {
          _.map(route.request.url.query, (q) => {
            queryParams.push({
              key: q.key,
              value: q.value,
            });
          });
        }

        const requestBodyErr = [];
        if (route?.request?.body?.raw) {
          if (!await isJson(route.request.body.raw)) {
            requestBodyErr.push({
              route: routeUrl,
              sequence: 1,
              msg: 'Invalid JSON format of request body.',
            });
          }
        }
        if (!route?.request?.method) {
          requestBodyErr.push({
            route: routeUrl,
            sequence: 1,
            msg: 'Method property not found.',
          });
        }

        if (requestBodyErr && _.size(requestBodyErr) > 0) {
          routeErrors = [...routeErrors, ...requestBodyErr];
        } else {
          const routeObj = {
            applicationId: params.applicationId,
            method: route.request.method.toLowerCase(),
            route: routeUrl,
            headers,
            type: ROUTE_GENERATE_TYPE.MANUAL,
            params: queryParams,
          };

          if (route?.request?.body?.raw) {
            routeObj.request = JSON.parse(route.request.body.raw);
          }

          created = await projectRouteRepo.create(routeObj);
        }
      } else {
        routeErrors.push({
          route: routeUrl,
          sequence: 2,
          msg: 'API already exists.',
        });
      }

      return created;
    }));
    routeSuccess = _.cloneDeep(_.reject(routeSuccess, _.isEmpty));
    routeErrors = _.cloneDeep((_.sortBy(routeErrors, 'sequence')));

    let responseMsg = OK;
    responseMsg = POSTMAN_UPLOADED;

    return {
      ...responseMsg,
      data: {
        error: routeErrors,
        success: routeSuccess,
      },
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    // console.log('error', err);
    return SERVER_ERROR;
  }
};

module.exports = useCase;
